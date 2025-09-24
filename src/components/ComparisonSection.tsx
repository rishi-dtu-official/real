import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const ComparisonSection = () => {
  const features = [
    { name: "Ultra-fast browsing", area: true, websurge: true, hyperview: false },
    { name: "Advanced AI insights", area: true, websurge: false, hyperview: false },
    { name: "Seamless integration", area: true, websurge: false, hyperview: false },
    { name: "Advanced AI insights", area: true, websurge: false, hyperview: false },
    { name: "Ultra-fast browsing", area: true, websurge: true, hyperview: false },
    { name: "Full UTF-8 support", area: true, websurge: false, hyperview: false },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-wider text-primary mb-4">Specs</p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
            Why Choose Area?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            You need a solution that keeps up. That's why we developed Area. A developer-friendly approach to streamline your business.
          </p>
          <Button variant="outline" className="rounded-full bg-sage text-sage-foreground border-sage hover:bg-sage/80">
            Discover More
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-3xl p-8 border border-border">
          <div className="grid grid-cols-4 gap-8">
            {/* Header Row */}
            <div className="font-semibold text-lg text-foreground"></div>
            <div className="font-semibold text-lg text-foreground text-center">Area</div>
            <div className="font-semibold text-lg text-muted-foreground text-center">WebSurge</div>
            <div className="font-semibold text-lg text-muted-foreground text-center">HyperView</div>

            {/* Feature Rows */}
            {features.map((feature, index) => (
              <>
                <div key={`${index}-name`} className="py-4 text-foreground">
                  {feature.name}
                </div>
                <div key={`${index}-area`} className="py-4 flex justify-center">
                  {feature.area ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div key={`${index}-websurge`} className="py-4 flex justify-center">
                  {feature.websurge ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div key={`${index}-hyperview`} className="py-4 flex justify-center">
                  {feature.hyperview ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;