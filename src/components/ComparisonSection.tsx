import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ComparisonSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [

    { name: "Verified and Accurate Candidate Profiles", area: true, websurge: false, hyperview: true },
    { name: "AI based Candidates Reccomendations", area: true, websurge: false, hyperview: false },
    { name: "AI Resume / Projects Checking System", area: true, websurge: false, hyperview: false },
    { name: "Candidate Trust Score", area: true, websurge: false, hyperview: false },

    { name: "Ultra-fast Interview Scheduling", area: true, websurge: false, hyperview: false },
    { name: "Dedicated Hiring Expert support", area: true, websurge: false, hyperview: false },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="text-sm uppercase tracking-wider text-primary mb-4"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            For Companies
          </motion.p>
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Why Choose Fornix?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            You need a solution that helps you get best talent in minimum time and effort. That's why we developed Fornix. A founder friendly approach to streamline your Hiring Program.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="outline" className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80">
              Contact Us
            </Button>
          </motion.div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div 
          className="bg-card rounded-3xl p-8 border border-border"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div 
            className="grid grid-cols-4 gap-8"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Header Row */}
            <motion.div 
              className="font-semibold text-lg text-foreground"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
            ></motion.div>
            <motion.div 
              className="font-semibold text-lg text-foreground text-center"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
            >Fornix</motion.div>
            <motion.div 
              className="font-semibold text-lg text-muted-foreground text-center"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
            >Linkedin/Job Boards</motion.div>
            <motion.div 
              className="font-semibold text-lg text-muted-foreground text-center"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
            >Career Site</motion.div>

            {/* Feature Rows */}
            {features.map((feature, index) => (
              <>
                <motion.div 
                  key={`${index}-name`} 
                  className="py-4 text-foreground"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{ x: 5 }}
                >
                  {feature.name}
                </motion.div>
                <motion.div 
                  key={`${index}-area`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.area ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
                <motion.div 
                  key={`${index}-websurge`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.websurge ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
                <motion.div 
                  key={`${index}-hyperview`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.hyperview ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
              </>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;