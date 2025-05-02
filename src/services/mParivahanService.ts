
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MParivahanUserData {
  fullName: string;
  vehicleNumber: string;
  registrationAuthority: string;
  registrationDate: string;
  contactNumber: string;
  licenseNumber: string;
  photoUrl: string;
}

export const useMParivahanService = () => {
  const { toast } = useToast();

  const linkMParivahanAccount = async (dlNumber: string): Promise<MParivahanUserData | null> => {
    try {
      // Try to fetch data from your mParivahan API files
      // This is a placeholder, you would import and use your actual API files here
      console.log("Attempting to link mParivahan account with DL:", dlNumber);
      
      // For now, we'll use a mock response, but you would replace this with your actual API call
      // using the files you mentioned
      
      // Using window.mParivahanAPI if it exists (assuming your files expose this global)
      if (window.mParivahanAPI && typeof window.mParivahanAPI.fetchUserData === 'function') {
        const response = await window.mParivahanAPI.fetchUserData(dlNumber);
        return response;
      }
      
      // Fallback to mock data if the API is not available
      const mockData: MParivahanUserData = {
        fullName: "John Doe",
        vehicleNumber: "MH01AB1234",
        registrationAuthority: "RTO Mumbai (MH-01)",
        registrationDate: "2019-06-15",
        contactNumber: "+91 9876543210",
        licenseNumber: dlNumber,
        photoUrl: "https://example.com/photo.jpg"
      };

      return mockData;
    } catch (error: any) {
      console.error("Error linking mParivahan account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to link mParivahan account",
        variant: "destructive",
      });
      return null;
    }
  };

  const saveUserProfileData = async (userId: string, data: MParivahanUserData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          vehicle_number: data.vehicleNumber,
          registration_authority: data.registrationAuthority,
          registration_date: data.registrationDate,
          contact_number: data.contactNumber,
          license_number: data.licenseNumber,
          photo_url: data.photoUrl,
        })
        .eq('id', userId);

      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Error saving profile data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile data",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    linkMParivahanAccount,
    saveUserProfileData
  };
};

// Add a TypeScript declaration for the global mParivahan API
declare global {
  interface Window {
    mParivahanAPI?: {
      fetchUserData: (dlNumber: string) => Promise<MParivahanUserData>;
    };
  }
}
