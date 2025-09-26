import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

export const uploadResume = async (file, userId, onProgress = null) => {
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

    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${sanitizedFileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, `resumes/${userId}/${fileName}`);

    // Upload with progress tracking
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(handleStorageError(error));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                fileName: sanitizedFileName,
                originalName: file.name,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString()
              });
            } catch (error) {
              reject(handleStorageError(error));
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        fileName: sanitizedFileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
    }

  } catch (error) {
    console.error('Resume upload error:', error);
    throw handleStorageError(error);
  }
};

const handleStorageError = (error) => {
  console.error('Storage error details:', error);
  
  switch (error.code) {
    case 'storage/unauthorized':
      return new Error('You are not authorized to upload files. Please make sure you are signed in.');
    
    case 'storage/canceled':
      return new Error('Upload was canceled');
    
    case 'storage/unknown':
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('XMLHttpRequest')) {
        return new Error('CORS Error: Firebase Storage is not configured for this domain. Please check Firebase Console → Storage → Rules and CORS settings.');
      }
      return new Error(`Upload failed: ${error.message}`);
    
    case 'storage/invalid-format':
      return new Error('Invalid file format. Please upload a PDF or Word document.');
    
    case 'storage/invalid-argument':
      return new Error('Invalid file. Please select a valid resume file.');
    
    case 'storage/retry-limit-exceeded':
      return new Error('Upload failed after multiple attempts. Please try again later.');
    
    case 'storage/quota-exceeded':
      return new Error('Storage quota exceeded. Please contact support.');
    
    default:
      if (error.message.includes('CORS')) {
        return new Error('CORS Error: Please configure Firebase Storage CORS settings for your domain.');
      }
      return error.message ? new Error(error.message) : new Error('Upload failed. Please try again.');
  }
};