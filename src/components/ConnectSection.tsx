import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";

const ConnectSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleDemoRequest = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/request-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-background">
      <motion.div 
        className="max-w-4xl mx-auto px-6 text-center"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Put hiring
          
          on autopilot
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          From posting job to Closing, Make process faster , save cash, AI based reccomended hires, and less manual work in shortlisting.
        </motion.p>
        
        <form onSubmit={handleDemoRequest}>
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              className="flex-1 w-full sm:w-auto"
              whileFocus={{ scale: 1.02 }}
            >
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isSubmitting || submitted}
                className={`h-14 px-6 text-lg bg-white border-2 rounded-full focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 ${
                  error ? 'border-red-400' : 'border-gray-200'
                } ${submitted ? 'border-green-400 bg-green-50' : ''}`}
              />
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: isSubmitting || submitted ? 1 : 1.05,
                boxShadow: isSubmitting || submitted ? "none" : "0 10px 25px rgba(0, 0, 0, 0.2)"
              }}
              whileTap={{ scale: isSubmitting || submitted ? 1 : 0.95 }}
            >
              <Button 
                type="submit"
                size="lg"
                disabled={isSubmitting || submitted || !email}
                className={`h-14 px-8 py-4 text-lg rounded-full font-semibold transition-all duration-200 whitespace-nowrap ${
                  submitted 
                    ? 'bg-green-600 hover:bg-green-600 text-white' 
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : submitted ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Request Sent!</span>
                  </div>
                ) : (
                  'Request a Callback'
                )}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Error/Success Messages */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: error || submitted ? 1 : 0, 
              height: error || submitted ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-center"
          >
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}
            {submitted && (
              <p className="text-green-600 text-sm font-medium">
                Demo request sent! We'll contact you within 24 hours.
              </p>
            )}
          </motion.div>
        </form>
      </motion.div>
    </section>
  );
};

export default ConnectSection;