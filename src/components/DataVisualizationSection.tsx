import heroLandscape from "@/assets/hero-landscape.jpg";

const DataVisualizationSection = () => {
  const companies = [
    "LogoIpsum", "LogoIpsum", "LogoIpsum", "LogoIpsum", "LogoIpsum", "LogoIpsum"
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Data Visualization */}
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <img 
            src={heroLandscape} 
            alt="Data visualization over landscape" 
            className="w-full h-96 object-cover"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
            <div className="absolute top-8 left-8">
              <div className="text-6xl font-bold text-white mb-2">78%</div>
              <div className="text-white text-lg">Efficiency Improvements</div>
            </div>
            
            {/* Navigation Pills */}
            <div className="absolute top-8 right-8">
              <div className="flex bg-white/20 backdrop-blur-sm rounded-full p-1">
                <span className="px-4 py-2 text-white text-sm rounded-full bg-white/20">Benefits</span>
                <span className="px-4 py-2 text-white text-sm">Specifications</span>
                <span className="px-4 py-2 text-white text-sm">How-to</span>
                <span className="px-4 py-2 text-white text-sm">Contact Us</span>
              </div>
            </div>

            {/* Region Selector */}
            <div className="absolute top-8 right-8 mt-16">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm">All Regions (33)</span>
              </div>
            </div>

            {/* Year Labels */}
            <div className="absolute bottom-8 left-0 right-0">
              <div className="flex justify-between px-8 text-white text-sm">
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center">
          <p className="text-muted-foreground mb-8">Trusted by:</p>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            {companies.map((company, index) => (
              <div key={index} className="text-muted-foreground font-medium">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualizationSection;