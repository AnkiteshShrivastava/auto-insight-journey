
import { useState } from "react";
import Header from "@/components/Header";
import Navigation, { SectionType } from "@/components/Navigation";
import CarHealth from "@/components/CarHealth";
import PersonalInfo from "@/components/PersonalInfo";
import UserInfoForm from "@/components/UserInfoForm";
import JourneyAnalytics from "@/components/JourneyAnalytics";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("car-health");
  const isMobile = useIsMobile();

  const renderActiveSection = () => {
    switch (activeSection) {
      case "car-health":
        return <CarHealth />;
      case "personal-info":
        return (
          <div className="space-y-4">
            <UserInfoForm />
            <PersonalInfo />
          </div>
        );
      case "journey-analytics":
        return <JourneyAnalytics />;
      default:
        return <CarHealth />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-safe pb-safe">
      <InteractiveBackground />
      <Header />
      <div className={cn(
        "container mx-auto px-4 py-4 flex-grow",
        isMobile ? "max-w-full" : ""
      )}>
        <h1 className={cn(
          "font-bold text-carPurple-900 mb-1",
          isMobile ? "text-xl" : "text-2xl md:text-3xl mb-2"
        )}>Dashboard</h1>
        <p className={cn(
          "text-gray-500 mb-4",
          isMobile ? "text-sm" : "mb-6"
        )}>Monitor your vehicle's performance and journey data</p>
        
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        <div className={cn(
          "bg-white rounded-lg shadow-sm",
          isMobile ? "p-3 mt-2" : "p-4 md:p-6"
        )}>
          <h2 className={cn(
            "font-semibold text-carPurple-900 mb-4",
            isMobile ? "text-lg" : "text-xl md:text-2xl mb-6"
          )}>
            {activeSection === "car-health" && "Car Health Monitor"}
            {activeSection === "personal-info" && "Personal Information"}
            {activeSection === "journey-analytics" && "Journey Analytics"}
          </h2>
          
          {renderActiveSection()}
        </div>
      </div>
      
      <footer className="bg-carPurple-900/80 backdrop-blur-sm text-white py-3 px-4 mt-6">
        <div className="container mx-auto">
          <p className={cn(
            "text-center",
            isMobile ? "text-xs" : "text-sm"
          )}>
            © 2025 Auto Insight | Car Monitoring Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
