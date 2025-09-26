import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker - use the correct worker file
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
} catch {
  // Fallback: try legacy path or disable worker
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = null;
  }
}

export const parseResume = async (file, onProgress = null) => {
  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please upload a PDF or Word document (.pdf, .docx, .doc)');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    if (onProgress) onProgress(10);

    let extractedText = '';
    
    if (file.type === 'application/pdf') {
      try {
        extractedText = await parsePDF(file, onProgress);
      } catch (pdfError) {
        // If PDF parsing fails, provide a helpful fallback message
        console.warn('PDF parsing failed:', pdfError);
        throw new Error('PDF parsing is currently not available. Please try uploading a DOCX file instead, or manually enter your information.');
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'application/msword') {
      extractedText = await parseDOCX(file, onProgress);
    }

    if (onProgress) onProgress(100);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('No text could be extracted from this file. Please check if the file contains readable text or try uploading a different format.');
    }

    return {
      extractedText: extractedText.trim(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      parsedAt: new Date().toISOString(),
      wordCount: extractedText.trim().split(/\s+/).filter(word => word.length > 0).length
    };

  } catch (error) {
    console.error('Resume parsing error:', error);
    throw error; // Re-throw the original error to preserve the specific message
  }
};

const parsePDF = async (file, onProgress) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (onProgress) onProgress(30);
    
    // Handle worker setup issues
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    if (onProgress) onProgress(50);
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    if (numPages === 0) {
      throw new Error('PDF appears to be empty or corrupted');
    }
    
    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .filter(item => item.str && item.str.trim().length > 0)
          .map(item => item.str)
          .join(' ');
        fullText += pageText + '\n';
        
        if (onProgress) {
          const progress = 50 + (i / numPages) * 40;
          onProgress(progress);
        }
      } catch (pageError) {
        console.warn(`Error processing page ${i}:`, pageError);
        // Continue processing other pages
      }
    }
    
    if (!fullText.trim()) {
      throw new Error('No text could be extracted from this PDF. It may be image-based or encrypted.');
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    
    if (error.message.includes('worker')) {
      throw new Error(`PDF parsing failed due to worker setup. Please try uploading a DOCX file instead, or try again later.`);
    } else if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
    } else if (error.message.includes('password')) {
      throw new Error('Password-protected PDFs are not supported. Please upload an unprotected version.');
    } else {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }
};

const parseDOCX = async (file, onProgress) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    if (onProgress) onProgress(30);
    
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (onProgress) onProgress(80);
    
    return result.value;
  } catch (error) {
    throw new Error(`DOCX parsing failed: ${error.message}`);
  }
};

// Simple text extraction fallback for when parsing fails
export const extractTextFallback = async (file) => {
  try {
    const text = await file.text();
    return {
      extractedText: text,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      parsedAt: new Date().toISOString(),
      wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length,
      method: 'fallback'
    };
  } catch (error) {
    throw new Error('Could not extract text from file. Please ensure the file is not corrupted.');
  }
};

// Helper function to extract structured information from text
export const extractResumeInfo = (text) => {
  const info = {
    rawText: text,
    extractedSections: {}
  };

  try {
    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      info.extractedSections.email = emailMatch[0];
    }

    // Extract phone numbers (multiple patterns)
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      /\+?\d{1,3}[-\s]?\d{3,4}[-\s]?\d{3,4}[-\s]?\d{3,4}/,
      /\(\d{3}\)\s?\d{3}-?\d{4}/
    ];
    
    for (const pattern of phonePatterns) {
      const phoneMatch = text.match(pattern);
      if (phoneMatch) {
        info.extractedSections.phone = phoneMatch[0];
        break;
      }
    }

    // Extract potential skills (expanded list)
    const skillsPattern = /(JavaScript|TypeScript|Python|Java|React|Node\.js|Angular|Vue|HTML|CSS|SQL|MongoDB|PostgreSQL|MySQL|AWS|Azure|GCP|Docker|Kubernetes|Git|GitHub|C\+\+|C#|PHP|Ruby|Swift|Kotlin|Flutter|Android|iOS|Machine Learning|AI|Data Science|Agile|Scrum|DevOps|Linux|Windows|REST|API|JSON|XML|Bootstrap|Tailwind|Sass|Less|Express|Django|Flask|Spring|Laravel|Unity|Photoshop|Figma|Sketch)/gi;
    const skills = [...new Set(text.match(skillsPattern) || [])];
    if (skills.length > 0) {
      info.extractedSections.skills = skills;
    }

    // Extract years of experience (multiple patterns)
    const experiencePatterns = [
      /(\d+)[\+\s]*(years?|yrs?)\s*(of\s*)?(experience|exp)/i,
      /(\d+)\+?\s*(year|yr)\s*(experience|exp)/i,
      /(over|more than)\s*(\d+)\s*(years?|yrs?)/i
    ];
    
    for (const pattern of experiencePatterns) {
      const experienceMatch = text.match(pattern);
      if (experienceMatch) {
        info.extractedSections.experience = experienceMatch[0];
        break;
      }
    }

    // Extract education keywords
    const educationMatch = text.match(/(Bachelor|Master|PhD|B\.S\.|B\.A\.|M\.S\.|M\.A\.|MBA|Computer Science|Engineering|University|College|Degree|Graduate|Undergraduate)/gi);
    if (educationMatch) {
      info.extractedSections.education = [...new Set(educationMatch)];
    }

    // Extract company names (common patterns)
    const companyPatterns = /(Google|Microsoft|Apple|Amazon|Meta|Facebook|Netflix|Tesla|Uber|Airbnb|Spotify|Slack|Adobe|Oracle|IBM|Intel|NVIDIA|Salesforce|Twitter|LinkedIn|Dropbox|Stripe|Zoom|Shopify|Atlassian|Red Hat|VMware)/gi;
    const companies = [...new Set(text.match(companyPatterns) || [])];
    if (companies.length > 0) {
      info.extractedSections.companies = companies;
    }

  } catch (error) {
    console.warn('Error extracting structured info:', error);
  }

  return info;
};