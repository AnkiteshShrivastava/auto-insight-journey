
import { Calendar, Clock, MapPin, Route } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JourneyAnalytics = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="recent">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="recent">Recent Journeys</TabsTrigger>
          <TabsTrigger value="stats">Journey Stats</TabsTrigger>
          <TabsTrigger value="history">Full History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Route className="text-carPurple-200" size={24} />
            <p className="text-gray-500 italic">No journey data available yet. Your recent trips will appear here.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="border-l-4 border-l-carPurple-200">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-carPurple-200" />
                        <span className="text-gray-400">No journey data</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-carPurple-200" />
                        <span className="text-gray-400">-</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Clock size={16} className="text-carPurple-200" />
                        <span className="text-gray-400">-</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">- km</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Journey Statistics</CardTitle>
              <CardDescription>Overview of your driving patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">No journey statistics available yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Journey History</CardTitle>
              <CardDescription>Complete history of your trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">No journey history available yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneyAnalytics;
