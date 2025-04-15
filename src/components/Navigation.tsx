
import { useState } from "react";
import { Activity, Car, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type SectionType = "car-health" | "personal-info" | "journey-analytics";

interface NavigationProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const isMobile = useIsMobile();
  
  const navItems = [
    {
      id: "car-health" as SectionType,
      name: "Car Health",
      icon: Car,
    },
    {
      id: "personal-info" as SectionType,
      name: "Personal Info",
      icon: User,
    },
    {
      id: "journey-analytics" as SectionType,
      name: "Journey Analytics",
      icon: Activity,
    },
  ];

  return (
    <div className="bg-white shadow-sm my-6 rounded-lg overflow-hidden">
      <div className={`grid ${isMobile ? 'grid-cols-3' : 'grid-cols-3'} divide-x`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 p-4 transition-colors",
              activeSection === item.id
                ? "bg-carPurple-200 text-white"
                : "hover:bg-gray-50"
            )}
          >
            <item.icon size={isMobile ? 20 : 24} />
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
