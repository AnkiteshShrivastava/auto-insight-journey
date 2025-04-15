
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserData {
  name: string;
  photoUrl: string;
}

const Header = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-carPurple-200" />
          <span className="font-semibold text-lg text-carPurple-900">Auto Insight</span>
        </div>
        
        {userData && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 hidden sm:inline-block">
              {userData.name}
            </span>
            <Avatar className="h-8 w-8 cursor-pointer" onClick={handleLogout}>
              <AvatarImage src={userData.photoUrl} alt={userData.name} />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
