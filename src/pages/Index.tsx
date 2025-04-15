
import { useState } from "react";
import Header from "@/components/Header";
import Navigation, { SectionType } from "@/components/Navigation";
import CarHealth from "@/components/CarHealth";
import PersonalInfo from "@/components/PersonalInfo";
import JourneyAnalytics from "@/components/JourneyAnalytics";

const Index = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("car-health");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "car-health":
        return <CarHealth />;
      case "personal-info":
        return <PersonalInfo />;
      case "journey-analytics":
        return <JourneyAnalytics />;
      default:
        return <CarHealth />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-carPurple-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">Monitor your vehicle's performance and journey data</p>
        
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-carPurple-900">
            {activeSection === "car-health" && "Car Health Monitor"}
            {activeSection === "personal-info" && "Personal Information"}
            {activeSection === "journey-analytics" && "Journey Analytics"}
          </h2>
          
          {renderActiveSection()}
        </div>
      </div>
      
      <footer className="bg-carPurple-900 text-white py-4 px-6 mt-12">
        <div className="container mx-auto">
          <p className="text-center text-sm">
            © 2025 Auto Insight | Car Monitoring Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
