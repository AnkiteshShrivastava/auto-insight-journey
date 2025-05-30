
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      navigate("/login");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className={cn(
        "container mx-auto flex justify-between items-center",
        isMobile ? "px-3 py-2" : "px-4 py-3"
      )}>
        <div className="flex items-center gap-2">
          <Car className={cn(
            "text-carPurple-200",
            isMobile ? "h-5 w-5" : "h-6 w-6"
          )} />
          <span className={cn(
            "font-semibold text-carPurple-900",
            isMobile ? "text-base" : "text-lg"
          )}>Auto Insight</span>
        </div>
        
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 hidden sm:inline-block">
              {user.email}
            </span>
            <Avatar 
              className={cn(
                "cursor-pointer", 
                isMobile ? "h-7 w-7" : "h-8 w-8"
              )} 
              onClick={handleLogout}
            >
              <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ""} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
