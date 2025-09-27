import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/G6SIcs01.svg";

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative px-6"
      style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
      }}
    >
      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <img 
          src={logo} 
          alt="Fornix Logo" 
          className="h-20 w-auto"
        />
      </div>

      {/* Main Content - Centered */}
      <motion.div 
        className="w-full max-w-md relative z-10 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Find Your Next<br />
            <span className="text-white/90">Opportunity</span>
          </h1>
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-white/90 mb-6">
           Join Fornix
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <GoogleLoginButton />
          </div>
        </motion.div>
      </motion.div>

      {/* Looking for Talent Button - Bottom Center */}
      <motion.div
        className="absolute bottom-8 left-2/5 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button
          variant="ghost"
          className="text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm border border-white/20"
          onClick={() => navigate('/submit-request')}
        >
          Looking for Talent? Click here
        </Button>
      </motion.div>
    </div>
  );
};

export default Auth;