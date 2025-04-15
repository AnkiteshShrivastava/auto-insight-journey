
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, FileText, User, MapPin, Calendar, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  name: string;
  vehicleNumber: string;
  photoUrl: string;
}

const PersonalInfo = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "default",
    });
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="text-carPurple-200" />
            Personal Information
          </CardTitle>
          <CardDescription>Your profile information from mParivahan</CardDescription>
        </CardHeader>
        <CardContent>
          {userData ? (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={userData.photoUrl} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="mt-4 text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Car className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Vehicle Number</p>
                    <p className="font-medium">{userData.vehicleNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Registration Authority</p>
                    <p className="font-medium">RTO Mumbai (MH-01)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Registration Date</p>
                    <p className="font-medium">15-06-2019</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">+91 98XXXXXXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="text-carPurple-200 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">License Number</p>
                    <p className="font-medium">MH0120190012345</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">No user information available</p>
              <p className="text-sm text-gray-400 mt-2">Please log in to view your information</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfo;
