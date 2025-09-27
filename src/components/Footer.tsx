import logo from "@/assets/G6SIcs01.svg";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#82c341' }}>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Section */}
          <div className="flex flex-col space-y-6 text-center lg:text-left">
            <div>
              <h2 className="text-white text-4xl font-bold mb-4">Stay</h2>
              <h2 className="text-white text-4xl font-bold mb-6">Connected</h2>
            </div>
            
            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-lg">support@fornixai.tech</span>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white text-lg">Whitefield, Bangalore</span>
              </div>
            </div>
            
            {/* LinkedIn Link */}
            <div className="flex justify-center lg:justify-start">
              <button 
                onClick={() => window.open('https://www.linkedin.com/in/rishi-r-37b014334/', '_blank')}
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 transition-colors px-6 py-3 rounded-lg"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-white font-medium">Find us on LinkedIn</span>
              </button>
            </div>
            
            <div className="text-white/80 text-sm">
              ©2025 by Fornix, Inc.
            </div>
          </div>

          {/* Right Section - Logo */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <img 
                src={logo} 
                alt="Fornix Logo" 
                className="h-40 w-auto drop-shadow-2xl filter brightness-110"
                style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3)) brightness(1.1)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;