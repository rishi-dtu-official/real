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
      title: "Amplify Your Potential",
      description: "Unlock AI driven reccomendations to improve your profile, Discover jobs and projects as per your skills and experience."
    },
    {
      icon: Globe,
      title: "Control Your Global Exposure", 
      description: "Get Discovered by startups around the World, work with them, grow your skills, expand your network, and build a global career."
    },
    {
      icon: Languages,
      title: "Fair Skill-Based Opportunities",
      description: "Get judged for what you can do, not just your résumé. Bypass traditional ATS filters and let your skills speak directly to opportunities."
    },
    {
      icon: TrendingUp,
      title: "Hassle-Free Access",
      description: "No more applying to hundreds of jobs manually. Startups find you directly, saving your time and effort while maximizing your chances."
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
            For Talents
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
            Fornix helps you discover jobs and projects based on your profile, without individually applying to each of them.
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