import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import heroLandscape from "@/assets/hero-landscape.png";

const MapSuccessSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      number: "01",
      title: "The Problem",
      description: "Job searching for senior-level professionals (5+ years) is a full-time job in itself. You compete with 500+ applications and internal referrals for every role posted.",
    },
    {
      number: "02", 
      title: "Our Solution",
      description: "We offer complete done-for-you job search services solving your lack of know-how on marketing yourself and lack of bandwidth to dedicate to the search.",
    },
    {
      number: "03",
      title: "The Result", 
      description: "You get directly invited to interviews without putting hours of effort everyday. We handle all the hard, repetitive work so you can focus on preparing and performing.",
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 className="text-5xl md:text-6xl font-bold text-foreground">
            Our Mission
          </motion.h2>
          <motion.div
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

        {/* Steps */}
        <motion.div 
          className="grid md:grid-cols-3 gap-12 mb-16"
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
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="space-y-6"
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div 
                className="text-8xl font-light text-muted-foreground"
                whileHover={{ scale: 1.1, color: "#82c341" }}
                transition={{ duration: 0.3 }}
              >
                {step.number}
              </motion.div>
              <h3 className="text-2xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default MapSuccessSection;