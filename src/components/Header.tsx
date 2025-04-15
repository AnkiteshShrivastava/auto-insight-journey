
import { Car } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-carPurple-900 text-white py-4 px-6 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <Car size={isMobile ? 24 : 32} className="text-carPurple-200" />
        <h1 className={`font-bold ${isMobile ? "text-xl" : "text-2xl"}`}>Auto Insight</h1>
      </div>
      <div>
        <span className="bg-carPurple-200 text-carPurple-900 py-1 px-3 rounded-full text-sm font-semibold">
          Beta
        </span>
      </div>
    </header>
  );
};

export default Header;
