import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    "Personalized onboarding call",
    "Niche positioning & market analysis",
    "Resume & LinkedIn profile overhaul",
    "Personal brand strategy",
    "40–50 targeted applications daily",
    "Resume tailored for each application",
    "Direct outreach to hiring managers",
    "Cold outreach to recruiters",
    "100% human-written, zero AI",
    "Continues until you land an offer",
  ];

  return (
    <section id="pricing" className="py-24 bg-background">
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
            Pricing
          </motion.p>
          <motion.h2
            className="text-5xl md:text-6xl font-bold text-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            No hidden costs. Pay only when it works.
          </motion.p>
        </motion.div>

        {/* Single Pricing Card */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            className="rounded-3xl p-10 border border-primary bg-card shadow-lg"
            whileHover={{
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 },
            }}
          >
            {/* Onboarding Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-bold text-foreground">$99</span>
              <span className="text-muted-foreground">/onboarding</span>
            </div>
            <p className="text-muted-foreground mb-6">
              One-time onboarding fee to kick things off. We begin with a personalized call to understand your expertise, build your niche positioning, and overhaul your resume & LinkedIn profile.
            </p>

            {/* Divider */}
            <div className="border-t border-border my-6" />

            {/* Per Interview Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-foreground">Then $99</span>
              <span className="text-muted-foreground">/per interview secured</span>
            </div>
            <p className="text-muted-foreground mb-8">
              After onboarding, we begin marketing you from applying to jobs, reaching out to recruiters, and customizing your resume for each opportunity. You only pay when you get invited to an interview. This continues until you land your next offer.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                className="w-full rounded-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => window.open('https://form.typeform.com/to/nmoqxv10', '_blank')}
              >
                Apply for Cohort
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
