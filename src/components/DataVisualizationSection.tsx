import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

const DataVisualizationSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      number: "12M+",
      label: "Jobs processed monthly",
      bgColor: "bg-gray-100",
      dotColor: "text-gray-400"
    },
    {
      number: "12K+",
      label: "Happy Developers",
      bgColor: "bg-yellow-300",
      dotColor: "text-yellow-600"
    },
    {
      number: "800+",
      label: "Organizations saving time",
      bgColor: "bg-gray-100",
      dotColor: "text-gray-400"
    }
  ];

  const investors = [
    { name: "Y Combinator", logo: "YC" },
    { name: "Google Ventures", logo: "GV" }
  ];

  // Dot pattern component
  const DotPattern = ({ color }) => (
    <div className={`absolute inset-0 opacity-30 ${color}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="lg:pr-8"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Not just trusted by the best — backed by them too
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Including angels like Kelsey Hightower, Spencer Kimball, and NFL athlete Kevin Beachum of the Arizona Cardinals.
            </motion.p>

            {/* Investors */}
            <motion.div 
              className="flex items-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {investors.map((investor, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-8 h-8 bg-foreground text-background rounded flex items-center justify-center text-sm font-bold">
                    {investor.logo}
                  </div>
                  <span className="text-muted-foreground font-medium">{investor.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-[#82c341] hover:bg-green-500 text-black font-semibold px-8 py-3 rounded-full">
                FIND US ON LINKEDIN
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
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
            {/* First stat - takes full width on top */}
            <motion.div 
              className="col-span-2 relative rounded-lg p-8 min-h-[200px] flex flex-col justify-center items-center text-center overflow-hidden"
              style={{ backgroundColor: stats[0].bgColor === "bg-gray-100" ? "#f3f4f6" : "" }}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <DotPattern color={stats[0].dotColor} />
              <motion.div 
                className="text-6xl font-bold text-foreground mb-2 relative z-10"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {stats[0].number}
              </motion.div>
              <div className="text-foreground text-lg font-medium relative z-10">{stats[0].label}</div>
            </motion.div>

            {/* Second stat - top right with yellow background */}
            <motion.div 
              className="relative rounded-lg p-8 min-h-[200px] flex flex-col justify-center items-center text-center overflow-hidden bg-[#82c341]"
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <DotPattern color="text-green-200" />
              <motion.div 
                className="text-6xl font-bold text-foreground mb-2 relative z-10"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              >
                {stats[1].number}
              </motion.div>
              <div className="text-foreground text-lg font-medium relative z-10">{stats[1].label}</div>
            </motion.div>

            {/* Third stat - bottom left */}
            <motion.div 
              className="relative rounded-lg p-8 min-h-[200px] flex flex-col justify-center items-center text-center overflow-hidden"
              style={{ backgroundColor: "#f3f4f6" }}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <DotPattern color="text-gray-400" />
              <motion.div 
                className="text-6xl font-bold text-foreground mb-2 relative z-10"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 2
                }}
              >
                {stats[2].number}
              </motion.div>
              <div className="text-foreground text-lg font-medium relative z-10">{stats[2].label}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualizationSection;