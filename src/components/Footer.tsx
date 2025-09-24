const Footer = () => {
  return (
    <footer className="py-16 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-foreground rounded"></div>
            <span className="text-muted-foreground">© Area. 2025</span>
          </div>
          
          <div className="text-muted-foreground">
            All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;