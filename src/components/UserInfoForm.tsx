import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Upload, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { retrieveKeyPair, generateKeyPair, encryptData } from "@/utils/pqCrypto";

interface UserFormData {
  full_name: string;
  vehicle_number: string;
  registration_authority: string;
  registration_date: string;
  contact_number: string;
  license_number: string;
}

const UserInfoForm = () => {
  const [loading, setLoading] = useState(false);
  const [encryptionLoading, setEncryptionLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [hasKeys, setHasKeys] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const form = useForm<UserFormData>({
    defaultValues: {
      full_name: "",
      vehicle_number: "",
      registration_authority: "",
      registration_date: "",
      contact_number: "",
      license_number: ""
    }
  });

  // Check for existing keys on mount
  useEffect(() => {
    const checkKeys = async () => {
      try {
        const keyPair = await retrieveKeyPair();
        setHasKeys(!!keyPair);
        
        if (!keyPair) {
          // Generate new keys if none exist
          await generateKeyPair();
          setHasKeys(true);
          toast({
            title: "Security Keys Generated",
            description: "Your encryption keys have been created.",
          });
        }
      } catch (error) {
        console.error("Error checking/generating keys:", error);
        toast({
          title: "Error",
          description: "Failed to set up encryption",
          variant: "destructive",
        });
      }
    };
    
    checkKeys();
  }, []);

  // Load existing user data if available
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // Set form values with existing data
          form.reset({
            full_name: data.full_name || "",
            vehicle_number: data.vehicle_number || "",
            registration_authority: data.registration_authority || "",
            registration_date: data.registration_date ? new Date(data.registration_date).toISOString().split('T')[0] : "",
            contact_number: data.contact_number || "",
            license_number: data.license_number || ""
          });
          
          setPhotoUrl(data.photo_url);
        }
      } catch (error: any) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [user, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload a photo",
        variant: "destructive",
      });
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadLoading(true);

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `license-photos/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('user-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase
        .storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      // Update photo URL in state
      setPhotoUrl(data.publicUrl);
      
      // Update the form data with the current values
      const currentFormValues = form.getValues();
      
      // Update the profile with the photo URL and all current form values
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          photo_url: data.publicUrl,
          full_name: currentFormValues.full_name,
          vehicle_number: currentFormValues.vehicle_number,
          registration_authority: currentFormValues.registration_authority,
          registration_date: currentFormValues.registration_date,
          contact_number: currentFormValues.contact_number,
          license_number: currentFormValues.license_number
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "License photo and information updated successfully",
      });

    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your information",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setEncryptionLoading(true);

    try {
      // Encrypt sensitive data
      const sensitiveData = {
        full_name: data.full_name,
        vehicle_number: data.vehicle_number,
        contact_number: data.contact_number,
        license_number: data.license_number,
      };
      
      const encryptedData = await encryptData(sensitiveData);
      setEncryptionLoading(false);
      
      // Save user data to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          vehicle_number: data.vehicle_number,
          registration_authority: data.registration_authority,
          registration_date: data.registration_date,
          contact_number: data.contact_number,
          license_number: data.license_number,
          photo_url: photoUrl,
          encrypted_data: encryptedData, // Store the encrypted data
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your information has been securely updated with encryption",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update your information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setEncryptionLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className={cn(isMobile ? "px-4 py-3" : "")}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <CardTitle className={cn("text-lg", isMobile && "text-base")}>Update Your Information</CardTitle>
          <div className="flex items-center gap-1 text-green-700">
            <Shield size={16} />
            <span className="text-xs font-medium">Secure Encryption</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(isMobile ? "px-4 pb-4" : "")}>
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoUrl || undefined} alt="License Photo" />
              <AvatarFallback>
                <Camera className="h-12 w-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <Button 
              size="sm"
              variant="outline"
              className="absolute bottom-0 right-0"
              disabled={uploadLoading}
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <Upload className={cn("h-4 w-4", uploadLoading && "animate-spin")} />
            </Button>
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploadLoading}
            />
          </div>
          <p className="text-sm text-gray-500">Upload your license photo</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="license_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your license number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicle_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your vehicle number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registration_authority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Authority</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration authority" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registration_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your contact number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={loading || !hasKeys}
              className={cn(
                "w-full bg-carBlue-300 hover:bg-carBlue-400 text-white", 
                isMobile && "h-11"
              )}
            >
              {loading ? (encryptionLoading ? "Encrypting..." : "Updating...") : "Securely Update Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserInfoForm;
