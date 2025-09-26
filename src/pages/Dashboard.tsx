import React, { useEffect, useState } from 'react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const navigate = useNavigate();

  // Handle input changes for editable fields
  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Handle array field changes (workExperience, education, projects)
  const handleArrayChange = (arrayName, index, field, value) => {
    setEditData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setEditData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setEditData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  // Handle resume re-upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeUploading(true);
    setResumeError('');
    try {
      const { parseResume, extractResumeInfo } = await import('../lib/uploadUtils');
      const parseResult = await parseResume(file, () => {});
      const extractedInfo = extractResumeInfo(parseResult.extractedText);
      setEditData(prev => ({
        ...prev,
        resumeData: {
          ...parseResult,
          extractedSections: extractedInfo.extractedSections
        }
      }));
      alert('Resume parsed successfully! Extracted ' + parseResult.wordCount + ' words.');
    } catch (error) {
      setResumeError(error.message);
    }
    setResumeUploading(false);
  };

  // Enter edit mode
  const startEdit = () => {
    setEditData({ ...userProfile });
    setEditMode(true);
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditMode(false);
    setEditData(null);
    setResumeError('');
  };

  // Save changes
  const saveEdit = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        ...editData,
        uid: user.uid,
        email: user.email,
        updatedAt: new Date()
      });
      setUserProfile(editData);
      setEditMode(false);
      setEditData(null);
      setResumeError('');
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        // User is not logged in, show error and redirect to landing page
        alert('Error while logging in. Please try again.');
        navigate('/');
        return;
      }

      // Check if user document exists in Firestore
      setProfileLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          // User document exists, show profile
          setUserProfile(userDocSnap.data());
        } else {
          // User document doesn't exist, redirect to onboarding
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Fornix Dashboard</span>
            </div>
            <div className="flex gap-2">
              {!editMode && (
                <Button onClick={startEdit} variant="outline" className="text-gray-600 hover:text-gray-800">
                  Update Profile
                </Button>
              )}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={userProfile.name || 'User'}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userProfile.name || user.displayName || 'User'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                {userProfile.phone && (
                  <p className="text-gray-600">{userProfile.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Resume Data
              {!editMode && userProfile.resumeData?.extractedText && (
                <Button
                  onClick={() => {
                    const newWindow = window.open('', '_blank');
                    if (newWindow) {
                      newWindow.document.write(`
                        <html>
                          <head><title>Resume Text - ${userProfile.resumeData.fileName}</title></head>
                          <body style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                            <h1>Parsed Resume Text</h1>
                            <p><strong>File:</strong> ${userProfile.resumeData.fileName}</p>
                            <p><strong>Word Count:</strong> ${userProfile.resumeData.wordCount}</p>
                            <p><strong>Parsed:</strong> ${new Date(userProfile.resumeData.parsedAt).toLocaleString()}</p>
                            <hr>
                            <pre style="white-space: pre-wrap;">${userProfile.resumeData.extractedText}</pre>
                          </body>
                        </html>
                      `);
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  View Parsed Text
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <div className="space-y-3">
                <input type="file" accept=".pdf,.docx,.doc" onChange={handleResumeUpload} disabled={resumeUploading} />
                {resumeUploading && <span className="text-sm text-gray-500">Parsing resume...</span>}
                {resumeError && <span className="text-sm text-red-500">{resumeError}</span>}
                {editData?.resumeData?.extractedText && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Parsed</Badge>
                    <span className="text-sm text-gray-600">Resume parsed successfully</span>
                  </div>
                )}
              </div>
            ) : userProfile.resumeData?.extractedText ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✅ Parsed
                  </Badge>
                  <span className="text-sm text-gray-600">Resume parsed successfully</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>File:</strong> {userProfile.resumeData.fileName}</div>
                  <div><strong>Word Count:</strong> {userProfile.resumeData.wordCount}</div>
                  <div><strong>File Size:</strong> {(userProfile.resumeData.fileSize / 1024).toFixed(1)} KB</div>
                  <div><strong>Parsed:</strong> {new Date(userProfile.resumeData.parsedAt).toLocaleDateString()}</div>
                </div>
                {userProfile.resumeData.extractedSections && Object.keys(userProfile.resumeData.extractedSections).length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Auto-extracted Information:</h4>
                    <div className="space-y-1 text-xs">
                      {(userProfile.resumeData.extractedSections as any).email && (
                        <div>📧 Email: {(userProfile.resumeData.extractedSections as any).email}</div>
                      )}
                      {(userProfile.resumeData.extractedSections as any).phone && (
                        <div>📞 Phone: {(userProfile.resumeData.extractedSections as any).phone}</div>
                      )}
                      {(userProfile.resumeData.extractedSections as any).skills && (
                        <div>🛠️ Skills: {(userProfile.resumeData.extractedSections as any).skills.join(', ')}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  ❌ Not Uploaded
                </Badge>
                <span className="text-sm text-gray-600">No resume found</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  {editData?.workExperience?.map((exp, index) => (
                    <div key={index} className="border-l-2 border-green-200 pl-4 pb-2">
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Role"
                        value={exp.role}
                        onChange={e => handleArrayChange('workExperience', index, 'role', e.target.value)}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Company"
                        value={exp.company}
                        onChange={e => handleArrayChange('workExperience', index, 'company', e.target.value)}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Duration"
                        value={exp.duration}
                        onChange={e => handleArrayChange('workExperience', index, 'duration', e.target.value)}
                      />
                      <textarea
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Description"
                        value={exp.description}
                        onChange={e => handleArrayChange('workExperience', index, 'description', e.target.value)}
                      />
                      <button type="button" className="text-xs text-red-500" onClick={() => removeArrayItem('workExperience', index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="text-xs text-green-600 mt-2" onClick={() => addArrayItem('workExperience', { company: '', role: '', duration: '', description: '' })}>+ Add Experience</button>
                </div>
              ) : userProfile.workExperience && userProfile.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-green-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                      <p className="text-sm text-green-600">{exp.company}</p>
                      <p className="text-xs text-gray-500">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work experience added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  {editData?.education?.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4 pb-2">
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={e => handleArrayChange('education', index, 'degree', e.target.value)}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="School"
                        value={edu.school}
                        onChange={e => handleArrayChange('education', index, 'school', e.target.value)}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Year"
                        value={edu.year}
                        onChange={e => handleArrayChange('education', index, 'year', e.target.value)}
                      />
                      <button type="button" className="text-xs text-red-500" onClick={() => removeArrayItem('education', index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="text-xs text-blue-600 mt-2" onClick={() => addArrayItem('education', { degree: '', school: '', year: '' })}>+ Add Education</button>
                </div>
              ) : userProfile.education && userProfile.education.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.education.map((edu, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-sm text-blue-600">{edu.school}</p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No education information added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-4">
                  {editData?.projects?.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-2">
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Title"
                        value={project.title}
                        onChange={e => handleArrayChange('projects', index, 'title', e.target.value)}
                      />
                      <textarea
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Description"
                        value={project.description}
                        onChange={e => handleArrayChange('projects', index, 'description', e.target.value)}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Tech Stack (comma separated)"
                        value={project.techStack?.join(', ') || ''}
                        onChange={e => handleArrayChange('projects', index, 'techStack', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                      />
                      <input
                        className="block w-full border rounded px-2 py-1 mb-1"
                        placeholder="Link"
                        value={project.link}
                        onChange={e => handleArrayChange('projects', index, 'link', e.target.value)}
                      />
                      <button type="button" className="text-xs text-red-500" onClick={() => removeArrayItem('projects', index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="text-xs text-gray-600 mt-2" onClick={() => addArrayItem('projects', { title: '', description: '', techStack: [], link: '' })}>+ Add Project</button>
                </div>
              ) : userProfile.projects && userProfile.projects.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.projects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        {project.link && (
                          <Button
                            onClick={() => window.open(project.link, '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                      )}
                      {project.techStack && project.techStack.length > 0 && (
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
                </div>
              ) : (
                <p className="text-gray-500">No projects added yet</p>
              )}
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media & Links</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">GitHub:</span>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="GitHub URL"
                      value={editData?.githubUrl || ''}
                      onChange={e => handleEditChange('githubUrl', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="LinkedIn URL"
                      value={editData?.linkedinUrl || ''}
                      onChange={e => handleEditChange('linkedinUrl', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Portfolio:</span>
                    <input
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Portfolio URL"
                      value={editData?.portfolioUrl || ''}
                      onChange={e => handleEditChange('portfolioUrl', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {userProfile.githubUrl && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">GitHub:</span>
                      <Button
                        onClick={() => window.open(userProfile.githubUrl, '_blank')}
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                      >
                        {userProfile.githubUrl}
                      </Button>
                    </div>
                  )}
                  {userProfile.linkedinUrl && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">LinkedIn:</span>
                      <Button
                        onClick={() => window.open(userProfile.linkedinUrl, '_blank')}
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                      >
                        {userProfile.linkedinUrl}
                      </Button>
                    </div>
                  )}
                  {userProfile.portfolioUrl && (
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Portfolio:</span>
                      <Button
                        onClick={() => window.open(userProfile.portfolioUrl, '_blank')}
                        variant="link"
                        className="p-0 h-auto text-blue-600"
                      >
                        {userProfile.portfolioUrl}
                      </Button>
                    </div>
                  )}
                  {!userProfile.githubUrl && !userProfile.linkedinUrl && !userProfile.portfolioUrl && (
                    <p className="text-gray-500">No social media links added yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Buttons - Only show in edit mode */}
        {editMode && (
          <div className="flex justify-center gap-4 py-8 border-t bg-white sticky bottom-0 z-10 shadow-lg">
            <Button 
              onClick={saveEdit} 
              disabled={resumeUploading}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
            >
              {resumeUploading ? 'Processing...' : 'Save Changes'}
            </Button>
            <Button 
              onClick={cancelEdit} 
              variant="outline"
              className="px-8 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;