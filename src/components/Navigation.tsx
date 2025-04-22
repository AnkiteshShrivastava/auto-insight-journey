
import { useState } from "react";
import { Activity, Car, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export type SectionType = "car-health" | "personal-info" | "journey-analytics";

interface NavigationProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
}

const Navigation = ({ activeSection, setActiveSection }: NavigationProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  
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

  const handleNavClick = (section: SectionType) => {
    setActiveSection(section);
    if (isMobile) setOpen(false);
  };

  // Mobile Navigation with Sheet
  if (isMobile) {
    return (
      <div className="my-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm text-gray-700">
              <Menu size={20} />
              <span className="font-medium">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[75%] sm:w-[350px] pt-12">
            <div className="space-y-2 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex items-center gap-3 w-full p-3 rounded-md transition-colors",
                    activeSection === item.id
                      ? "bg-carPurple-200 text-white"
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon size={22} />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="bg-white p-3 rounded-lg shadow-sm mt-2">
          <div className="text-sm font-medium text-gray-600">
            Currently viewing: {navItems.find(item => item.id === activeSection)?.name}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Navigation
  return (
    <div className="bg-white shadow-sm my-6 rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 divide-x">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "flex flex-row items-center justify-center sm:justify-start gap-2 p-4 transition-colors",
              activeSection === item.id
                ? "bg-carPurple-200 text-white"
                : "hover:bg-gray-50"
            )}
          >
            <item.icon size={24} />
            <span className="text-sm font-medium">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
