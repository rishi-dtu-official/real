import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
  const navigate = useNavigate();

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
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Sign Out
            </Button>
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
              Resume
              {userProfile.resumeUrl && (
                <Button
                  onClick={() => window.open(userProfile.resumeUrl, '_blank')}
                  variant="outline"
                  size="sm"
                >
                  View Resume
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile.resumeUrl ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✅ Uploaded
                </Badge>
                <span className="text-sm text-gray-600">Resume uploaded successfully</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
            </CardHeader>
            <CardContent>
              {userProfile.workExperience && userProfile.workExperience.length > 0 ? (
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
              {userProfile.education && userProfile.education.length > 0 ? (
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
              {userProfile.projects && userProfile.projects.length > 0 ? (
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;