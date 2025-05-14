import React, { useEffect, useState } from "react";
import { AlertCircle, Gauge, Wrench, Zap, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformance } from "@/context/PerformanceContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Scatter } from 'recharts';
import { parseVibrationData } from "@/lib/enginePerformance";

// Define threshold for spike detection
const SPIKE_THRESHOLD = 10;

const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={4} 
      fill="red"
    />
  );
};

const getPerformanceStatus = (score: number) => {
  if (score >= 80) {
    return {
      message: "No maintenance required",
      color: "text-green-500"
    };
  } else if (score >= 40) {
    return {
      message: "Regular maintenance recommended",
      color: "text-yellow-500"
    };
  } else {
    return {
      message: "Performance depleted, Please visit your nearest service center",
      color: "text-red-500"
    };
  }
};

const CarHealth = () => {
  const { performanceScore } = usePerformance();  // Use the existing context
  const [vibrationData, setVibrationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVibrationData = async () => {
      try {
        const data = await parseVibrationData('./vibration_data.csv');
        const formattedData = data.map(point => ({
          time: new Date(point.time).toLocaleTimeString(),
          magnitude: Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z),
          isSpike: Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z) > SPIKE_THRESHOLD
        }));
        setVibrationData(formattedData);
      } catch (error) {
        console.error('Error loading vibration data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVibrationData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-carPurple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="text-carPurple-200" size={18} />
              Engine Vibration
            </CardTitle>
            <CardDescription>Monitor engine vibration levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {vibrationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vibrationData}>
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="magnitude" 
                      stroke="#8884d8" 
                      dot={false}
                      strokeWidth={2}
                    />
                    <Scatter
                      data={vibrationData.filter(point => point.isSpike)}
                      dataKey="magnitude"
                      shape={<CustomDot />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400">Loading vibration data...</p>
                </div>
              )}
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
            <div className="h-24 flex flex-col items-center justify-end space-y-3 pb-2">
              <p className="text-gray-400 text-3xl font-bold">
                {loading ? "Loading..." : `${performanceScore}%`}
              </p>
              {!loading && (
                <p className={`text-base font-medium ${getPerformanceStatus(performanceScore).color}`}>
                  {getPerformanceStatus(performanceScore).message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-carPurple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="text-carPurple-200" size={18} />
              Tire Pressure
            </CardTitle>
            <CardDescription>Monitor all tire pressure levels</CardDescription>
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
