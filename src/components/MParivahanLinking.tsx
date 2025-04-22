
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const MParivahanLinking = () => {
  const [dlNumber, setDlNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock mParivahan data
      const mockData = {
        fullName: "John Doe",
        vehicleNumber: "MH01AB1234",
        registrationAuthority: "RTO Mumbai (MH-01)",
        registrationDate: "2019-06-15",
        contactNumber: "+91 9876543210",
        licenseNumber: dlNumber,
        photoUrl: "https://example.com/photo.jpg"
      };

      // Update user profile with mock mParivahan data
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: mockData.fullName,
          vehicle_number: mockData.vehicleNumber,
          registration_authority: mockData.registrationAuthority,
          registration_date: mockData.registrationDate,
          contact_number: mockData.contactNumber,
          license_number: mockData.licenseNumber,
          photo_url: mockData.photoUrl,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Account Linked",
        description: "Your mParivahan account has been successfully linked.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Link mParivahan Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLinkAccount} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dlNumber">Driving License Number</Label>
            <Input
              id="dlNumber"
              placeholder="Enter your DL number"
              value={dlNumber}
              onChange={(e) => setDlNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Linking..." : "Link Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MParivahanLinking;
