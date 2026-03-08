import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const ComparisonSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    { name: "Niche Positioning & Personal Branding", fornix: true, otherAgencies: false, self: false },
    { name: "Handcrafted Resume & LinkedIn Profile Building", fornix: true, otherAgencies: false, self: false },
    { name: "40–50 Targeted Applications Daily", fornix: true, otherAgencies: false, self: false },
    { name: "Direct Outreach to Hiring Managers & Recruiters", fornix: true, otherAgencies: false, self: false },
    { name: "100% Human-Written, No AI Slop", fornix: true, otherAgencies: false, self: true },
    { name: "End-to-End Process Until You Get Interviews", fornix: true, otherAgencies: false, self: false },
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
            For Job Seekers
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
            We handle niche positioning, profile building, daily applications, and direct outreach all 100% human-written. You just show up for interviews.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80"
              onClick={() => window.open('https://form.typeform.com/to/nmoqxv10', '_blank')}
            >
              Apply for Cohort
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
            >Other Agencies</motion.div>
            <motion.div 
              className="font-semibold text-lg text-muted-foreground text-center"
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
            >Self</motion.div>

            {/* Feature Rows */}
            {features.map((feature, index) => (
              <React.Fragment key={`feature-${index}`}>
                <motion.div 
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
                  key={`${index}-fornix`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.fornix ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
                <motion.div 
                  key={`${index}-otherAgencies`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.otherAgencies ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
                <motion.div 
                  key={`${index}-self`} 
                  className="py-4 flex justify-center"
                  variants={{
                    hidden: { opacity: 0, scale: 0 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {feature.self ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;