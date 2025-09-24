import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MapSuccessSection from "@/components/MapSuccessSection";
import ComparisonSection from "@/components/ComparisonSection";
import BigPictureSection from "@/components/BigPictureSection";
import BenefitsSection from "@/components/BenefitsSection";
import DataVisualizationSection from "@/components/DataVisualizationSection";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <MapSuccessSection />
      <ComparisonSection />
      <BigPictureSection />
      <BenefitsSection />
      <DataVisualizationSection />
      <ConnectSection />
      <Footer />
    </div>
  );
};

export default Index;