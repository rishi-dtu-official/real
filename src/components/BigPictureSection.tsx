import geometricBlocks from "@/assets/geometric-blocks.jpg";
import { Button } from "@/components/ui/button";

const BigPictureSection = () => {
  const features = [
    {
      number: "01",
      title: "Spot Trends in Seconds: No more digging through numbers."
    },
    {
      number: "02", 
      title: "Get Everyone on the Same Page: Share easy-to-understand reports with your team."
    },
    {
      number: "03",
      title: "Make Presentations Pop: Interactive maps and dashboards keep your audience engaged."
    },
    {
      number: "04",
      title: "Your Global Snapshot: Get a quick, clear overview of your entire operation."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
              See the Big Picture
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Area turns your data into clear, vibrant visuals that show you exactly what's happening in each region.
            </p>
            
            <div className="space-y-8 mb-12">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-6">
                  <span className="text-2xl font-light text-muted-foreground">
                    {feature.number}
                  </span>
                  <p className="text-lg text-foreground">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80">
              Discover More
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-earth">
              <img 
                src={geometricBlocks} 
                alt="Abstract geometric shapes representing data visualization" 
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BigPictureSection;