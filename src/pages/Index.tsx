
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ParkingLotGrid from '@/components/ParkingLotGrid';
import ReservationPanel from '@/components/ReservationPanel';
import ParkingAnalyticsComponent from '@/components/ParkingAnalytics';
import { useParkingManager } from '@/hooks/useParkingManager';
import { Car, BarChart3, Settings, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    lot,
    selectedSpace,
    highlightedSpaces,
    analytics,
    setSelectedSpace,
    reserveSpace,
    releaseReservation,
    updateSpaceOccupancy,
    findNearestSpace,
    getOptimizationRecommendations,
    clearHighlights
  } = useParkingManager();

  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleSpaceClick = (space: any) => {
    setSelectedSpace(space);
    clearHighlights();
    console.log(`Selected space: ${space.id}`);
  };

  const handleReservation = (spaceId: string, reservedBy: string) => {
    if (reserveSpace(spaceId, reservedBy)) {
      toast({
        title: "Space Reserved",
        description: `Space ${spaceId} has been reserved for ${reservedBy}`,
      });
    } else {
      toast({
        title: "Reservation Failed",
        description: "Unable to reserve this space",
        variant: "destructive",
      });
    }
  };

  const handleReleaseReservation = (spaceId: string) => {
    if (releaseReservation(spaceId)) {
      toast({
        title: "Reservation Released",
        description: `Space ${spaceId} is now available`,
      });
    }
  };

  const handleUpdateOccupancy = (spaceId: string, isOccupied: boolean) => {
    if (updateSpaceOccupancy(spaceId, isOccupied)) {
      toast({
        title: "Space Updated",
        description: `Space ${spaceId} marked as ${isOccupied ? 'occupied' : 'available'}`,
      });
    }
  };

  const handleFindNearest = (row: number, col: number, request: any) => {
    const nearestSpace = findNearestSpace(row, col, request);
    if (nearestSpace) {
      toast({
        title: "Nearest Space Found",
        description: `Space ${nearestSpace.id} is the nearest available space`,
      });
    } else {
      toast({
        title: "No Space Available",
        description: "No available spaces match your criteria",
        variant: "destructive",
      });
    }
  };

  const handleOptimization = () => {
    const recs = getOptimizationRecommendations();
    setRecommendations(recs);
    if (recs.length > 0) {
      toast({
        title: "Optimization Analysis Complete",
        description: `Found ${recs.length} recommendations`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Parking Management System
          </h1>
          <p className="text-lg text-gray-600">
            Intelligent space allocation using hash maps and graph algorithms
          </p>
        </div>

        <Tabs defaultValue="parking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="parking" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Parking Lot
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Parking Lot Layout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ParkingLotGrid
                      lot={lot}
                      selectedSpace={selectedSpace}
                      onSpaceClick={handleSpaceClick}
                      highlightedSpaces={highlightedSpaces}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <ReservationPanel
                  selectedSpace={selectedSpace}
                  onReserveSpace={handleReservation}
                  onReleaseReservation={handleReleaseReservation}
                  onFindNearestSpace={handleFindNearest}
                  onUpdateOccupancy={handleUpdateOccupancy}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Parking Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ParkingAnalyticsComponent analytics={analytics} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Space Allocation Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">
                    Analyze current usage patterns and get optimization recommendations
                  </p>
                  <Button onClick={handleOptimization}>
                    Analyze & Optimize
                  </Button>
                </div>

                {recommendations.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Recommendations:</h3>
                    <div className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
