import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { parseResume, extractResumeInfo } from '../lib/uploadUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


const Onboarding = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    workExperience: [{ company: '', role: '', duration: '', description: '' }],
    education: [{ degree: '', school: '', year: '' }],
    projects: [{ title: '', description: '', techStack: [], link: '' }],
    // Resume parsing data instead of file URL
    resumeData: {
      extractedText: '',
      fileName: '',
      fileSize: 0,
      fileType: '',
      parsedAt: '',
      wordCount: 0,
      extractedSections: {}
    }
  });

  const steps = [
    { number: 1, title: 'Resume Upload', description: 'Upload your resume' },
    { number: 2, title: 'Personal Details', description: 'Basic information' },
    { number: 3, title: 'Experience & Education', description: 'Professional background' },
    { number: 4, title: 'Projects', description: 'Showcase your work' },
    { number: 5, title: 'Review & Submit', description: 'Confirm your details' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // User is not logged in, redirect to auth page
        navigate('/auth');
        return;
      }

      setUser(currentUser);
      
      // Pre-fill email from auth
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.displayName || ''
      }));

      // Check if user document already exists
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          // User document exists, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking user document:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeUploading(true);

    try {
      const parseResult = await parseResume(
        file,
        (progress) => {
          console.log('Parsing progress:', progress + '%');
        }
      );
      
      // Extract structured information from the parsed text
      const extractedInfo = extractResumeInfo(parseResult.extractedText);
      
      setFormData(prev => ({
        ...prev,
        resumeData: {
          ...parseResult,
          extractedSections: extractedInfo.extractedSections
        },
        // Auto-fill form fields with extracted information if available
        email: extractedInfo.extractedSections.email || prev.email,
        phone: extractedInfo.extractedSections.phone || prev.phone,
      }));

      alert('Resume parsed successfully! ' + 
            `Extracted ${parseResult.wordCount} words from your resume.`);
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert(`Error parsing resume: ${error.message}`);
    }
    setResumeUploading(false);
  };

  const handleTechStackChange = (projectIndex, techStack) => {
    const techArray = techStack.split(',').map(tech => tech.trim()).filter(tech => tech);
    handleArrayChange('projects', projectIndex, 'techStack', techArray);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save user data to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...formData,
        uid: user.uid,
        email: user.email,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Error saving profile. Please try again.');
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Profile Setup</span>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number <= currentStep 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.number}
                </div>
                <p className="text-xs text-gray-600 mt-1">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Step 1: Resume Upload */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {resumeFile ? resumeFile.name : 'Drop your resume here, or click to browse'}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    className="sr-only"
                    disabled={resumeUploading}
                  />
                  {resumeUploading && (
                    <div className="mt-4">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm text-green-600 mt-2">Uploading...</p>
                    </div>
                  )}
                  {formData.resumeData.extractedText && (
                    <div className="mt-4 space-y-2">
                      <Badge className="bg-green-100 text-green-800">✅ Resume Parsed</Badge>
                      <div className="text-xs text-gray-600">
                        <p>📄 {formData.resumeData.fileName}</p>
                        <p>📊 {formData.resumeData.wordCount} words extracted</p>
                        {formData.resumeData.extractedSections && 
                         (formData.resumeData.extractedSections as any).email && (
                          <p>📧 Found email: {(formData.resumeData.extractedSections as any).email}</p>
                        )}
                        {formData.resumeData.extractedSections && 
                         (formData.resumeData.extractedSections as any).phone && (
                          <p>📞 Found phone: {(formData.resumeData.extractedSections as any).phone}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Experience & Education */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Work Experience */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button
                      onClick={() => addArrayItem('workExperience', { company: '', role: '', duration: '', description: '' })}
                      variant="outline"
                      size="sm"
                    >
                      Add Experience
                    </Button>
                  </div>
                  {formData.workExperience.map((exp, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => handleArrayChange('workExperience', index, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Input
                              value={exp.role}
                              onChange={(e) => handleArrayChange('workExperience', index, 'role', e.target.value)}
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => handleArrayChange('workExperience', index, 'duration', e.target.value)}
                            placeholder="Jan 2020 - Present"
                          />
                        </div>
                        <div className="mb-4">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => handleArrayChange('workExperience', index, 'description', e.target.value)}
                            placeholder="Describe your role and achievements..."
                            rows={3}
                          />
                        </div>
                        {formData.workExperience.length > 1 && (
                          <Button
                            onClick={() => removeArrayItem('workExperience', index)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button
                      onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })}
                      variant="outline"
                      size="sm"
                    >
                      Add Education
                    </Button>
                  </div>
                  {formData.education.map((edu, index) => (
                    <Card key={index} className="mb-4">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                              placeholder="Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div>
                            <Label>School</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label>Year</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                            placeholder="2024"
                          />
                        </div>
                        {formData.education.length > 1 && (
                          <Button
                            onClick={() => removeArrayItem('education', index)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Projects */}
            {currentStep === 4 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <Button
                    onClick={() => addArrayItem('projects', { title: '', description: '', techStack: [], link: '' })}
                    variant="outline"
                    size="sm"
                  >
                    Add Project
                  </Button>
                </div>
                {formData.projects.map((project, index) => (
                  <Card key={index} className="mb-4">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Project Title</Label>
                          <Input
                            value={project.title}
                            onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                            placeholder="My Awesome Project"
                          />
                        </div>
                        <div>
                          <Label>Project Link</Label>
                          <Input
                            value={project.link}
                            onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                            placeholder="https://github.com/user/project"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <Label>Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                          placeholder="Describe your project..."
                          rows={3}
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Tech Stack (comma-separated)</Label>
                        <Input
                          value={project.techStack.join(', ')}
                          onChange={(e) => handleTechStackChange(index, e.target.value)}
                          placeholder="React, Node.js, MongoDB, AWS"
                        />
                        {project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.techStack.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {formData.projects.length > 1 && (
                        <Button
                          onClick={() => removeArrayItem('projects', index)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Review Your Information</h3>
                
                {/* Personal Info Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {formData.name}</div>
                      <div><strong>Email:</strong> {formData.email}</div>
                      <div><strong>Phone:</strong> {formData.phone || 'Not provided'}</div>
                      <div><strong>Resume:</strong> {formData.resumeData.extractedText ? '✅ Parsed' : '❌ Not uploaded'}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Experience Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Work Experience ({formData.workExperience.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.workExperience.map((exp, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <div className="font-medium">{exp.role} at {exp.company}</div>
                        <div className="text-sm text-gray-600">{exp.duration}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Education ({formData.education.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <div className="font-medium">{edu.degree}</div>
                        <div className="text-sm text-gray-600">{edu.school} - {edu.year}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Projects Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Projects ({formData.projects.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.projects.map((project, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-gray-600 mb-2">{project.description}</div>
                        {project.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1 || isSubmitting}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !formData.resumeData.extractedText}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.email}
                >
                  {isSubmitting ? 'Saving...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Onboarding;