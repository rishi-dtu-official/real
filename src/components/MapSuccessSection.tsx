import { Button } from "@/components/ui/button";
import heroLandscape from "@/assets/hero-landscape.jpg";

const MapSuccessSection = () => {
  const steps = [
    {
      number: "01",
      title: "Get Started",
      description: "With our intuitive setup, you're up and running in minutes."
    },
    {
      number: "02", 
      title: "Customize and Configure",
      description: "Adapt Area to your specific requirements and preferences."
    },
    {
      number: "03",
      title: "Grow Your Business", 
      description: "Make informed decisions to exceed your goals."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground">
            Map Your Success
          </h2>
          <Button variant="outline" className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80">
            Discover More
          </Button>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="space-y-6">
              <div className="text-8xl font-light text-muted-foreground">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Image */}
        <div className="relative h-64 rounded-3xl overflow-hidden">
          <img 
            src={heroLandscape} 
            alt="Ocean landscape" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSuccessSection;