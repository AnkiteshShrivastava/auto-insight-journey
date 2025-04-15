
import { AlertCircle, Battery, Gauge, Thermometer, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CarHealth = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-carPurple-200" size={24} />
        <p className="text-gray-500 italic">No data available yet. Connect your device to see real-time car health.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-carPurple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Battery className="text-carPurple-200" size={18} />
              Battery Health
            </CardTitle>
            <CardDescription>Current battery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center">
              <p className="text-gray-400">No data available</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-carPurple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gauge className="text-carPurple-200" size={18} />
              Engine Performance
            </CardTitle>
            <CardDescription>Engine efficiency and health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center">
              <p className="text-gray-400">No data available</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-carPurple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="text-carPurple-200" size={18} />
              Temperature
            </CardTitle>
            <CardDescription>Engine and system temperatures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center">
              <p className="text-gray-400">No data available</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-carPurple-200 md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="text-carPurple-200" size={18} />
              Maintenance Status
            </CardTitle>
            <CardDescription>Upcoming and recent maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 flex items-center justify-center">
              <p className="text-gray-400">No data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarHealth;
