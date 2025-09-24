import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">
            Area
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-foreground hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#specifications" className="text-foreground hover:text-primary transition-colors">
              Specifications
            </a>
            <a href="#how-to" className="text-foreground hover:text-primary transition-colors">
              How-to
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>

          <Button variant="default" size="sm" className="hidden md:block">
            Learn More
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;