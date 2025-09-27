import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { id: "map-success", label: "Home" },
  { id: "specifications", label: "Mission" },
  { id: "big-picture", label: "For Companies" },
  { id: "benefits", label: "For Talent" },
  { id: "data-visualization", label: "Data" },
  { id: "contact", label: "Contact" },
];

const Navigation = () => {
  const active = useActiveSection();
  const navigate = useNavigate();
  
  return (
    <>
      {/* Static Logo - Only visible on Hero Section, doesn't follow scroll */}
      <div className="absolute top-4 left-6 z-50">
        <div className="text-4xl font-bold text-foreground">
          Fornix AI
        </div>
      </div>

      {/* Fixed Navigation Container - Follows scroll */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <motion.nav
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-black/20"
        >
          <div className="px-5 py-1">
            <div className="flex items-center space-x-4 relative">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className={`relative px-3 py-2 transition-colors text-foreground ${
                    active === link.id ? "text-primary font-semibold" : "hover:text-primary"
                  }`}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 rounded bg-primary"
                      style={{ zIndex: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Static Learn More Button - Only visible on Hero Section, doesn't follow scroll */}
      <div className="absolute top-4 right-6 z-50">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-black/20"
        >
          <div className="p-2">
            <Button 
              variant="default" 
              size="sm" 
              className="rounded-full px-6"
              onClick={() => navigate('/auth')}
            >
              Looking for Work
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Navigation;