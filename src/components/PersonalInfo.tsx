import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, FileText, User, MapPin, Calendar, Phone, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { decryptData } from "@/utils/pqCrypto";

interface UserData {
  full_name: string | null;
  vehicle_number: string | null;
  photo_url: string | null;
  registration_authority: string | null;
  registration_date: string | null;
  contact_number: string | null;
  license_number: string | null;
  encrypted_data?: string | null;
}

const PersonalInfo = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [decryptedData, setDecryptedData] = useState<Record<string, any> | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
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
        
        // Try to decrypt the encrypted data if available
        if (data?.encrypted_data) {
          setIsDecrypting(true);
          try {
            const decrypted = await decryptData(data.encrypted_data);
            setDecryptedData(decrypted);
          } catch (decryptError) {
            console.error("Failed to decrypt data:", decryptError);
            toast({
              title: "Decryption Error",
              description: "Could not decrypt your secure data",
              variant: "destructive",
            });
          } finally {
            setIsDecrypting(false);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
        setIsDecrypting(false);
      }
    };

    fetchUserData();
  }, [user]);

  const getDisplayValue = (key: string, defaultValue: string | null) => {
    // First try to get the value from decrypted data if available
    if (decryptedData && key in decryptedData) {
      return decryptedData[key] || "Not available";
    }
    
    // Otherwise use the regular data
    return defaultValue || "Not available";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="text-carPurple-200" />
            Personal Information
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-700">
            <Shield className="h-3 w-3" /> Secure Encryption
          </Badge>
        </div>
        <CardDescription>Your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {isDecrypting && (
          <div className="text-center p-4">
            <p className="text-sm text-gray-500">Decrypting your secure data...</p>
          </div>
        )}
        
        {!isDecrypting && userData ? (
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
                  <p className="font-medium">{getDisplayValue("full_name", userData.full_name)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Car className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium">{getDisplayValue("vehicle_number", userData.vehicle_number)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Registration Authority</p>
                  <p className="font-medium">{getDisplayValue("registration_authority", userData.registration_authority)}</p>
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
                  <p className="font-medium">{getDisplayValue("contact_number", userData.contact_number)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="text-carPurple-200 mt-1" size={20} />
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium">{getDisplayValue("license_number", userData.license_number)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-gray-500">No user information available</p>
            <p className="text-sm text-gray-400 mt-2">
              Update your information using the form above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
