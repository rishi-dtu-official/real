import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useParallax } from "@/hooks/use-parallax";
import { useNavigate } from "react-router-dom";
import FluidCanvas from "./FluidCanvas";
import heroLandscape from "@/assets/hero-landscape.png";

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
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Get Work Effortlessly.
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
            <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-foreground px-8 py-4 text-lg rounded-full">
              Looking to Hire
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;