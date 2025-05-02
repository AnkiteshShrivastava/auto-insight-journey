
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useMParivahanService } from "@/services/mParivahanService";

const MParivahanLinking = () => {
  const [dlNumber, setDlNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const mParivahanService = useMParivahanService();

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to link your account",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Use the mParivahan service to link the account
      const userData = await mParivahanService.linkMParivahanAccount(dlNumber);
      
      if (!userData) {
        throw new Error("Failed to retrieve user data");
      }

      // Save the user profile data to Supabase
      const success = await mParivahanService.saveUserProfileData(user.id, userData);
      
      if (success) {
        toast({
          title: "Account Linked",
          description: "Your mParivahan account has been successfully linked.",
        });
      }
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
    <Card className="w-full">
      <CardHeader className={cn(isMobile ? "px-4 py-3" : "")}>
        <CardTitle className={cn("text-lg", isMobile && "text-base")}>Link mParivahan Account</CardTitle>
      </CardHeader>
      <CardContent className={cn(isMobile ? "px-4 pb-4" : "")}>
        <form onSubmit={handleLinkAccount} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dlNumber">Driving License Number</Label>
            <Input
              id="dlNumber"
              placeholder="Enter your DL number"
              value={dlNumber}
              onChange={(e) => setDlNumber(e.target.value)}
              required
              className={cn(isMobile && "text-base h-11")}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className={cn("w-full", isMobile && "h-11")}
          >
            {loading ? "Linking..." : "Link Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MParivahanLinking;
