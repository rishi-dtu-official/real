import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MapSuccessSection from "@/components/MapSuccessSection";
import ComparisonSection from "@/components/ComparisonSection";
import BigPictureSection from "@/components/BigPictureSection";
import BenefitsSection from "@/components/BenefitsSection";
import DataVisualizationSection from "@/components/DataVisualizationSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navigation />
      <HeroSection />
      <motion.div 
        id="map-success"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <MapSuccessSection />
      </motion.div>
      <motion.div 
        id="specifications"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <ComparisonSection />
      </motion.div>
      <motion.div 
        id="big-picture"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <BigPictureSection />
      </motion.div>
      <motion.div 
        id="benefits"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <BenefitsSection />
      </motion.div>
      <motion.div 
        id="data-visualization"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <DataVisualizationSection />
      </motion.div>
      <motion.div 
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <ConnectSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Index;