import geometricBlocks from "@/assets/geometric-blocks.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const BigPictureSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      number: "01",
      title: "Get reccomended Talent effortlessly: No more digging through resumes, so you invest time, energy and money in what matters.",
    },
    {
      number: "02",
      title: "Get Every profile with 100% accuracy, no more resume lies: We verify everything so you know exactly what you're getting."
    },
    {
      number: "03",
      title: "Filter candidates with real parameters, not by ATS/Resume Keywords: Interview with best fits and reduce possibility of Bad Hires."
    },
    {
      number: "04",
      title: "Majority of operations handled by us, so can focus on final interview and hiring decisions, not the entire hiring process."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              See the Big Picture
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Small Organisations .
            </motion.p>
            
            <motion.div 
              className="space-y-8 mb-12"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-6"
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <motion.span 
                    className="text-2xl font-light text-muted-foreground"
                    whileHover={{ scale: 1.2, color: "#82c341" }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.number}
                  </motion.span>
                  <p className="text-lg text-foreground">
                    {feature.title}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80"
                onClick={() => navigate('/submit-request')}
              >
                Contact Us
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="rounded-3xl overflow-hidden bg-earth"
              whileHover={{ scale: 1.02, rotate: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={geometricBlocks} 
                alt="Abstract geometric shapes representing data visualization" 
                className="w-full h-96 object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BigPictureSection;