import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/use-parallax";
import { useNavigate } from "react-router-dom";
import FluidCanvas from "./FluidCanvas";
import heroLandscape from "@/assets/hero-landscape.png";
import logo from "@/assets/G6SIcs01.svg";

const HeroSection = () => {
  const { ref, backgroundY } = useParallax();
  const navigate = useNavigate();

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <img 
          src={heroLandscape} 
          alt="Beautiful landscape with rolling hills" 
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>

      {/* Fluid Paint Animation Overlay */}
      <div className="absolute inset-0 z-10">
        <FluidCanvas />
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-20 text-center text-white px-6 max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(1px)',
        }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img 
            src={logo} 
            alt="Fornix Logo" 
            className="h-20 md:h-24 w-auto drop-shadow-2xl"
          />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8 leading-tight font-mono"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Get Work{" "}
          </motion.span>
          <motion.span className="relative inline-block">
            <motion.span
              className="text-black font-black tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: 1.8 }}
            >
              {/* Typewriter effect for each letter */}
              {"Effortlessly".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    opacity: { duration: 0.05, delay: 1.8 + (index * 0.08) },
                    scale: { duration: 0.1, delay: 1.8 + (index * 0.08) },
                    y: { 
                      duration: 0.3, 
                      delay: 1.8 + (index * 0.08),
                      ease: "easeOut"
                    }
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
            {/* Typing cursor */}
            <motion.span
              className="text-black ml-1 font-thin"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 2.5
                },
                scale: {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2.5
                }
              }}
            >
              |
            </motion.span>
            {/* Final period */}
            <motion.span
              className="text-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: [0, 1.2, 1],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                opacity: { duration: 0.3, delay: 3.5 },
                scale: { 
                  duration: 0.4, 
                  delay: 3.5,
                  ease: "backOut"
                },
                rotate: { 
                  duration: 0.4, 
                  delay: 3.5 
                }
              }}
            >
              
            </motion.span>
          </motion.span>
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Fornix saves you from applying hell, and let companies discover your true potential via our platform.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-full"
              onClick={() => navigate('/auth')}
            >
              Looking for Work
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-black hover:bg-white hover:text-foreground px-8 py-4 text-lg rounded-full"
              onClick={() => navigate('/submit-request')}
            >
              Looking to Hire
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated LinkedIn Follow Button */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -8, 0],
            boxShadow: [
              "0 4px 20px rgba(0, 119, 181, 0.3)",
              "0 8px 30px rgba(0, 119, 181, 0.5)",
              "0 4px 20px rgba(0, 119, 181, 0.3)"
            ]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="group cursor-pointer"
          onClick={() => window.open('https://www.linkedin.com/company/fornixai/', '_blank')}
        >
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm border border-blue-500/30 relative overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              animate={{
                background: [
                  "linear-gradient(45deg, #0077b5, #00a0dc)",
                  "linear-gradient(45deg, #00a0dc, #0077b5)",
                  "linear-gradient(45deg, #0077b5, #00a0dc)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 opacity-20"
            />
            
            {/* Sparkle effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-1 right-1 w-3 h-3"
            >
              <div className="w-full h-full bg-white/40 rounded-full animate-pulse" />
            </motion.div>
            
            <div className="flex items-center space-x-3 relative z-10">
              {/* LinkedIn Logo with pulse animation */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white drop-shadow-lg"
                >
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    fill="currentColor"
                  />
                </svg>
                
                {/* Animated ring around logo */}
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border-2 border-white/50 rounded-full"
                />
              </motion.div>
              
              <div className="text-white">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 }}
                  className="text-sm font-bold leading-tight"
                >
                  Follow Us
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.2 }}
                  className="text-xs opacity-90"
                >
                  @FornixAI
                </motion.div>
              </div>
              
              {/* Arrow with bounce animation */}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-white/80"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>
            
            {/* Hover effect overlay */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            
            {/* Floating particles */}
            <motion.div
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute top-0 left-2 w-1 h-1 bg-white/60 rounded-full"
            />
            <motion.div
              animate={{
                y: [-20, -40, -20],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute top-0 right-4 w-1 h-1 bg-white/60 rounded-full"
            />
          </div>
          
          {/* Pulsing notification dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"
          >
            <motion.div
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-1 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
        
        {/* Tooltip on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20 whitespace-nowrap pointer-events-none"
        >
          <div className="font-medium">Join our LinkedIn community! 🚀</div>
          <div className="text-xs opacity-80">Get latest updates & career tips</div>
          {/* Tooltip arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/80" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;