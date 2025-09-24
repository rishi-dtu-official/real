import { Button } from "@/components/ui/button";
import heroLandscape from "@/assets/hero-landscape.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroLandscape} 
          alt="Beautiful landscape with rolling hills" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          Browse everything.
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
          Area turns your data into clear, vibrant visuals that show you exactly what's happening in each region.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg rounded-full">
            Learn More ↗
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-foreground px-8 py-4 text-lg rounded-full">
            Discover More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;