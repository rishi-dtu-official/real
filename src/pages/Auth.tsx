import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "../components/GoogleLoginButton";
import FirebaseSetupHelper from "../components/FirebaseSetupHelper";

const Auth = () => {
  return (
    <div 
      className="min-h-screen flex relative"
      style={{
        background: 'linear-gradient(90deg, #10b981 0%, #059669 45%, rgba(16, 185, 129, 0.8) 60%, rgba(249, 250, 251, 0.9) 80%, #f9fafb 100%)'
      }}
    >
      {/* Left Section - Green Gradient with Content */}
      <motion.div 
        className="flex-1 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="absolute top-8 left-8 z-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">F</span>
            </div>
            <span className="text-white text-2xl font-bold">Fornix</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center h-full px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Ensure a Fast and<br />
              <span className="text-white/90">Successful Journey</span>{" "}
              <span className="text-white/80">to<br />Your Next Career Move</span>
            </h1>
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="space-y-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✉</span>
              </div>
              <span className="text-white text-lg">
                <strong>2X</strong> More Qualified Job Matches
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⏰</span>
              </div>
              <span className="text-white text-lg">
                <strong>60%</strong> Time Savings in Job Searches
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📞</span>
              </div>
              <span className="text-white text-lg">
                <strong>50%</strong> More Interview Invites
              </span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/3 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-white/5 rounded-full"></div>
        </div>
      </motion.div>

      {/* Right Section - Auth Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center px-8 relative"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Welcome to <span className="text-green-600">Fornix</span>
            </h2>
            
            <FirebaseSetupHelper />
            
            <div className="mt-8">
              <GoogleLoginButton />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;