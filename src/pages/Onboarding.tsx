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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '@/assets/G6SIcs01.svg';


const Onboarding = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [sendingReferralEmail, setSendingReferralEmail] = useState(false);
  const navigate = useNavigate();

  // Professional preference options
  const preferenceOptions = [
    'Frontend',
    'Backend', 
    'Fullstack',
    'AI',
    'Product Management',
    'UI/UX',
    'Applied AI (LLM, RAG)',
    'ML (Algorithms, Theoretical)',
    'Data Analyst',
    'App Development',
    'Programmer (DSA, Algorithms)',
    'Designer Graphic',
    'Non-tech (Management, Marketing, Ops)'
  ];

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
    projects: [{ title: '', description: '', techStack: [], techStackString: '', link: '' }],
    // Professional preferences
    preferences: {
      primary: '',
      secondary: ''
    },
    // Referral information
    referral: {
      name: '',
      email: ''
    },
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
    { number: 4, title: 'Projects', description: 'Showcase your top 2 Projects' },
    { number: 5, title: 'Referral', description: 'Refer Your Friends *' },
    { number: 6, title: 'Review & Submit', description: 'Confirm your details' }
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
          // Parsing progress tracking (could add UI progress bar here)
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

  const handleTechStackChange = (projectIndex, value) => {
    // Store the raw string value to allow typing commas
    handleArrayChange('projects', projectIndex, 'techStackString', value);
    
    // Also update the techStack array for processing
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech);
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

  const nextStep = async () => {
    if (currentStep < steps.length) {
      // If moving from referral step (step 5), send referral email
      if (currentStep === 5 && formData.referral.name && formData.referral.email) {
        setSendingReferralEmail(true);
        try {
          const response = await fetch('/api/send-referral-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              referralName: formData.referral.name,
              referralEmail: formData.referral.email,
              userName: formData.name,
              userEmail: formData.email
            }),
          });

          if (response.ok) {
            // Referral email sent successfully
            alert('Referral notification sent successfully to ' + formData.referral.name + '!');
          } else {
            console.error('Failed to send referral email');
            alert('Failed to send referral notification. Continuing with setup...');
          }
        } catch (error) {
          console.error('Error sending referral email:', error);
          alert('Error sending referral notification. Continuing with setup...');
        } finally {
          setSendingReferralEmail(false);
        }
      }
      
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
              <img 
                src={logo} 
                alt="Fornix Logo" 
                className="h-8 w-auto"
              />
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
                      <Badge className="bg-green-100 text-green-800">Resume Parsed</Badge>
                      <div className="text-xs text-gray-600">
                        <p>{formData.resumeData.fileName}</p>
                        <p>{formData.resumeData.wordCount} words extracted</p>
                        {formData.resumeData.extractedSections && 
                         (formData.resumeData.extractedSections as any).email && (
                          <p>Found email: {(formData.resumeData.extractedSections as any).email}</p>
                        )}
                        {formData.resumeData.extractedSections && 
                         (formData.resumeData.extractedSections as any).phone && (
                          <p> phone: {(formData.resumeData.extractedSections as any).phone}</p>
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
                            placeholder="MM/YYYY - MM/YYYY or Present"
                          />
                        </div>
                        <div className="mb-4">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => handleArrayChange('workExperience', index, 'description', e.target.value)}
                            placeholder="Describe your Contrubutions in bullet points"
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
                    <h3 className="text-lg font-semibold">University</h3>
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
                              placeholder="Bachelor of Teachnology in Computer Science"
                            />
                          </div>
                          <div>
                            <Label>University/College Name</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                              placeholder="Indian Institute of Technology Delhi"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <Label>Year</Label>
                          <Input
                            value={edu.year}
                            onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                            placeholder="yyyy-yyyy"
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
              <div className="space-y-8">
                {/* Professional Preferences Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Professional Expertise Preferences</h3>
                  
                  {/* Information Box */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-blue-600 mt-0.5">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Why we ask for preferences?</h4>
                        <p className="text-sm text-blue-800 mb-2">
                          We use this information to segregate profiles based on expertise and conduct profile reviews accordingly. 
                          This helps us match you with the most relevant opportunities.
                        </p>
                        <p className="text-sm text-blue-800 font-medium">
                          Please fill these preferences as they align with your overall profile and experience.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-base">Select Your Expertise Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Preference */}
                        <div>
                          <Label htmlFor="primary-preference">Primary Expertise *</Label>
                          <Select
                            value={formData.preferences.primary}
                            onValueChange={(value) => handleInputChange('preferences', { ...formData.preferences, primary: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your primary expertise" />
                            </SelectTrigger>
                            <SelectContent>
                              {preferenceOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Secondary Preference */}
                        <div>
                          <Label htmlFor="secondary-preference">Secondary Expertise (Optional)</Label>
                          <Select
                            value={formData.preferences.secondary || "none"}
                            onValueChange={(value) => handleInputChange('preferences', { ...formData.preferences, secondary: value === "none" ? "" : value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select secondary expertise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {preferenceOptions
                                .filter(option => option !== formData.preferences.primary)
                                .map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Selected Preferences Display */}
                      {(formData.preferences.primary || formData.preferences.secondary) && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <h4 className="text-sm font-medium text-green-900 mb-2">Selected Preferences:</h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.preferences.primary && (
                              <Badge className="bg-green-100 text-green-800">
                                Primary: {formData.preferences.primary}
                              </Badge>
                            )}
                            {formData.preferences.secondary && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Secondary: {formData.preferences.secondary}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Projects Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <Button
                      onClick={() => addArrayItem('projects', { title: '', description: '', techStack: [], techStackString: '', link: '' })}
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
                            placeholder="Eg: Diarization Pipeline"
                          />
                        </div>
                        <div>
                          <Label>Project Link</Label>
                          <Input
                            value={project.link}
                            onChange={(e) => handleArrayChange('projects', index, 'link', e.target.value)}
                            placeholder="Github or Live Link"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <Label>Description</Label>
                        <Textarea
                          value={project.description}
                          onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                          placeholder="Describe your project in points"
                          rows={3}
                        />
                      </div>
                      <div className="mb-4">
                        <Label>Tech Stack Used</Label>
                        <Input
                          value={project.techStackString || project.techStack.join(', ')}
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
              </div>
            )}

            {/* Step 5: Referral */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Add a Referral *</h3>
                  <p className="text-gray-600">Know someone who is looking for Job/Internship/Paid Projects? Refer them. Sharing is Caring .</p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Referral Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="referral-name">Referral Name *</Label>
                        <Input
                          id="referral-name"
                          value={formData.referral.name}
                          onChange={(e) => handleInputChange('referral', { ...formData.referral, name: e.target.value })}
                          placeholder="David Putra"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="referral-email">Referral Email *</Label>
                        <Input
                          id="referral-email"
                          type="email"
                          value={formData.referral.email}
                          onChange={(e) => handleInputChange('referral', { ...formData.referral, email: e.target.value })}
                          placeholder="friend@gmail.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 text-blue-600 mt-0.5">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900 mb-1">Why add a referral?</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Help our platform reach more users and increase overall discoverability for yourself and others</li>
                      
                            <li>• You will be eligible for background verification after successful referral</li>

                            <li>• Help our platform get best Talent.</li>
                            

                            
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {sendingReferralEmail && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          <div>
                            <p className="text-sm font-medium text-green-800">Sending referral notification...</p>
                            <p className="text-xs text-green-600">We're notifying {formData.referral.name} about your referral request.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
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

                {/* Professional Preferences Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Professional Expertise Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Primary Expertise:</strong> {formData.preferences.primary}</div>
                      {formData.preferences.secondary && (
                        <div><strong>Secondary Expertise:</strong> {formData.preferences.secondary}</div>
                      )}
                    </div>
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

                {/* Referral Review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Referral Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div><strong>Name:</strong> {formData.referral.name}</div>
                      <div><strong>Email:</strong> {formData.referral.email}</div>
                    </div>
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
                  disabled={
                    (currentStep === 1 && !formData.resumeData.extractedText) ||
                    (currentStep === 4 && !formData.preferences.primary) ||
                    (currentStep === 5 && (!formData.referral.name || !formData.referral.email)) ||
                    sendingReferralEmail
                  }
                >
                  {sendingReferralEmail ? 'Sending Email...' : 'Next'}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.preferences.primary || !formData.referral.name || !formData.referral.email}
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