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
          Put revenue{" "}
          <span className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-cyan-400 text-black font-bold text-2xl md:text-3xl rounded-lg mx-2">
            +
          </span>{" "}
          on autopilot
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          From contract to close — faster cash, accurate books, and less manual work.
        </motion.p>
        
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
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 px-6 text-lg bg-white border-2 border-gray-200 rounded-full focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
            />
          </motion.div>
          
          <motion.div
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="h-14 bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full font-semibold transition-all duration-200 whitespace-nowrap"
            >
              Request a demo
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ConnectSection;