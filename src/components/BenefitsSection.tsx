import { BarChart, Globe, Languages, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BenefitsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: BarChart,
      title: "Stand Out From 500+ Applicants",
      description: "We polish your profile and execute an aggressive, structured job targeting strategy so you rise above the pile of competing applicants."
    },
    {
      icon: Globe,
      title: "40–50 Targeted Applications Daily", 
      description: "We find and apply to roles on your behalf every single day, meticulously tailoring your resume for each application to maximize recruiter visibility."
    },
    {
      icon: Languages,
      title: "100% Human-Written, Zero AI",
      description: "Every resume, application, and outreach message is written by our team not AI. So the person reading actually reads about you, not AI slop."
    },
    {
      icon: TrendingUp,
      title: "Pay Only When It Works",
      description: "$99 onboarding fee, then $99 per interview secured. No hidden costs. We keep working until you land your next offer."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="text-sm uppercase tracking-wider text-primary mb-8"
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
            We've cracked the code.
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A small team of experts dedicated to landing your next job offer. Done-for-you job search for executive and senior-level professionals.
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="space-y-6"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
                whileHover={{ 
                  scale: 1.2, 
                  backgroundColor: "#82c341",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  whileHover={{ 
                    color: "#ffffff",
                    transition: { duration: 0.3 }
                  }}
                >
                  <benefit.icon className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;