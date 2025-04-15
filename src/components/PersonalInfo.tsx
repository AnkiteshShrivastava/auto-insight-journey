
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, CreditCard, FileText, User } from "lucide-react";

const PersonalInfo = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<null | {
    ownerName: string;
    vehicleClass: string;
    registrationDate: string;
    insuranceValidity: string;
    registrationAuthority: string;
    model: string;
  }>(null);

  // This is a placeholder for the mParivahan API call
  const fetchVehicleDetails = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll just set some dummy data
      // In a real implementation, this would be the response from the mParivahan API
      setUserData({
        ownerName: "Rajesh Kumar",
        vehicleClass: "LMV - Car",
        registrationDate: "15-06-2019",
        insuranceValidity: "14-06-2025",
        registrationAuthority: "RTO Mumbai (MH-01)",
        model: "Maruti Suzuki Swift",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="text-carPurple-200" />
            Vehicle Information
          </CardTitle>
          <CardDescription>Enter your vehicle registration number to fetch details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter Vehicle Number (e.g., MH01AB1234)"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="flex-1"
            />
            <Button 
              className="bg-carPurple-200 hover:bg-carPurple-300 text-white"
              onClick={fetchVehicleDetails}
              disabled={loading || !vehicleNumber}
            >
              {loading ? "Fetching..." : "Fetch Details"}
            </Button>
          </div>
          
          <div className="mt-6">
            {userData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Owner Name</p>
                      <p className="font-medium">{userData.ownerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Car className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Class</p>
                      <p className="font-medium">{userData.vehicleClass}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{userData.registrationDate}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Insurance Valid Until</p>
                      <p className="font-medium">{userData.insuranceValidity}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Registration Authority</p>
                      <p className="font-medium">{userData.registrationAuthority}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Car className="text-carPurple-200 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="font-medium">{userData.model}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-500">Enter your vehicle number and click "Fetch Details" to view your information</p>
                <p className="text-sm text-gray-400 mt-2">Data will be fetched from the mParivahan API</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfo;
