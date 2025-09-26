const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#82c341' }}>
      {/* Decorative circles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-10 right-32 w-64 h-64 border-2 border-white/20 rounded-full"></div>
        <div className="absolute -bottom-16 right-16 w-96 h-96 border-2 border-white/20 rounded-full"></div>
        <div className="absolute top-32 -right-32 w-48 h-48 border-2 border-white/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-white text-4xl font-bold mb-4">Stay</h2>
              <h2 className="text-white text-4xl font-bold">Connected</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* LinkedIn Icon */}
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
              
              {/* Subscribe Button */}
              <button className="bg-black/30 hover:bg-black/40 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-colors">
                <span>Subscribe</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="text-white/80 text-sm">
              ©2025 by Fornix, Inc.
            </div>
          </div>

          {/* Right Section - Logo */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: '#82c341' }}>FORNIX</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;