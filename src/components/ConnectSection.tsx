import { Button } from "@/components/ui/button";

const ConnectSection = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
          Connect with us
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Schedule a quick call to learn how Area can turn your regional data into a powerful advantage.
        </p>
        
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg rounded-full w-full max-w-md"
        >
          Learn More ↗
        </Button>
      </div>
    </section>
  );
};

export default ConnectSection;