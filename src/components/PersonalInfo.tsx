
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, FileText, User, MapPin, Calendar, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  full_name: string | null;
  vehicle_number: string | null;
  photo_url: string | null;
  registration_authority: string | null;
  registration_date: string | null;
  contact_number: string | null;
  license_number: string | null;
}

const PersonalInfo = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserData(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      }
    };

    fetchUserData();
  }, [user]);

  return (
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
                <AvatarImage src={userData.photo_url || undefined} alt={userData.full_name || ""} />
                <AvatarFallback>{userData.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <User className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.full_name || "Not available"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Car className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium">{userData.vehicle_number || "Not available"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Registration Authority</p>
                  <p className="font-medium">{userData.registration_authority || "Not available"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Registration Date</p>
                  <p className="font-medium">
                    {userData.registration_date ? new Date(userData.registration_date).toLocaleDateString() : "Not available"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-medium">{userData.contact_number || "Not available"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium">{userData.license_number || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No user information available</p>
            <p className="text-sm text-gray-400 mt-2">
              Link your mParivahan account above to view your information
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
