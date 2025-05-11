import { Calendar, History, MapPin, Route } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const JourneyAnalytics = () => {
  const isMobile = useIsMobile();
  const [savedFrames, setSavedFrames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch initial saved frames
    fetch("/saved_frames")
      .then((res) => res.json())
      .then((data) => setSavedFrames(data.frames));

    // Connect to the WebSocket server
    const socket = io("http://localhost:5000");

    // Listen for new frames
    socket.on("new_frame", (data) => {
      setSavedFrames((prev) => [...prev, data.filename]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recent">
        <TabsList className="bg-slate-100 w-full">
          <TabsTrigger value="recent" className="flex-1">
            Recent Journeys
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            Journey Stats
          </TabsTrigger>
          <TabsTrigger value="images" className="flex-1">
            Saved Frames
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            Full History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Route className="text-carPurple-200" size={24} />
            <p className="text-gray-500 italic">
              No journey data available yet. Your recent trips will appear here.
            </p>
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
              <CardDescription>
                Overview of your driving patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-400">
                  No journey statistics available yet
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Frames</CardTitle>
              <CardDescription>
                Images captured during abnormal events
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              {savedFrames.map((frame, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
                  <img
                    src={`/saved_frames/${frame}`}
                    alt={`Frame ${index}`}
                    className="rounded-lg shadow-md"
                  />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {frame}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Journey History</CardTitle>
              <CardDescription>Complete history of your trips</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <ScrollArea className={cn("h-64", isMobile ? "w-full" : "")}>
                <div className={cn(isMobile ? "min-w-[600px] px-4" : "")}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">
                          Date
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          From
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">To</TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Distance
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Duration
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 sm:py-4">
                            -
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 sm:py-4">
                            -
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 sm:py-4">
                            -
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 sm:py-4">
                            -
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs sm:text-sm py-2 sm:py-4">
                            -
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center justify-center p-4">
                <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
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
