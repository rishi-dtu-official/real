import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/G6SIcs01.svg';

const SubmitRequest = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    personName: '',
    organisation: '',
    jobPosition: '',
    description: '',
    contactEmail: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-hiring-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            personName: '',
            organisation: '',
            jobPosition: '',
            description: '',
            contactEmail: '',
            phone: ''
          });
          setSubmitted(false);
        }, 3000);
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: 2 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-6">We'll get back to you within 24 hours with the perfect candidates.</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo} 
                alt="Fornix Logo" 
                className="h-10 w-50"
              />
              <span className="text-2xl font-bold text-gray-800">Fornix</span>
            </div>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-600 hover:text-green-600"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Find Your Perfect
            <span className="text-green-600 block">Talent Match</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your hiring needs and we'll connect you with top-tier professionals 
            who are ready to make an impact at your organization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-sm border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Submit Hiring Request</CardTitle>
              <p className="text-gray-600">Fill out the details below and we'll find the right candidates for you</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="personName" className="text-gray-700 font-medium">Your Name *</Label>
                    <Input
                      id="personName"
                      value={formData.personName}
                      onChange={(e) => handleInputChange('personName', e.target.value)}
                      placeholder="John Smith"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="organisation" className="text-gray-700 font-medium">Organization *</Label>
                    <Input
                      id="organisation"
                      value={formData.organisation}
                      onChange={(e) => handleInputChange('organisation', e.target.value)}
                      placeholder="Tech Corp Inc."
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="contactEmail" className="text-gray-700 font-medium">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="john@techcorp.com"
                      required
                      className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Label htmlFor="jobPosition" className="text-gray-700 font-medium">Job Position *</Label>
                  <Input
                    id="jobPosition"
                    value={formData.jobPosition}
                    onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                    placeholder="Senior Software Engineer"
                    required
                    className="border-green-200 focus:border-green-500 focus:ring-green-200"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Label htmlFor="description" className="text-gray-700 font-medium">Job Description & Requirements *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the role, required skills, experience level, and any specific requirements..."
                    rows={6}
                    required
                    className="border-green-200 focus:border-green-500 focus:ring-green-200 resize-none"
                  />
                </motion.div>

                {/* Creative Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex justify-center pt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.personName || !formData.organisation || !formData.jobPosition || !formData.description || !formData.contactEmail}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting Request...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Submit Request</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </motion.div>
                        </div>
                      )}
                    </Button>
                    
                    {/* Button glow effect */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(34, 197, 94, 0.3)",
                          "0 0 30px rgba(34, 197, 94, 0.5)",
                          "0 0 20px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-green-500 rounded-full -z-10 blur-xl opacity-30"
                    />
                  </motion.div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

       
      </main>
    </div>
  );
};

export default SubmitRequest;