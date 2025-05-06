
import { Calendar, History, MapPin, Route } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const JourneyAnalytics = () => {
  const isMobile = useIsMobile();

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
                        <Calendar size={16} className="text-carPurple-200" />
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
              <ScrollArea className={cn("h-64", isMobile ? "max-w-[calc(100vw-3rem)]" : "")}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-nowrap">-</TableCell>
                        <TableCell className="whitespace-nowrap">-</TableCell>
                        <TableCell className="whitespace-nowrap">-</TableCell>
                        <TableCell className="whitespace-nowrap">-</TableCell>
                        <TableCell className="whitespace-nowrap">-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="mt-4 flex items-center justify-center">
                <p className="text-sm text-gray-400 flex items-center gap-1">
                  <History size={14} />
                  No journey history available yet
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JourneyAnalytics;

