
import React, { useState } from 'react';
import { ParkingSpace, ReservationRequest } from '@/types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Clock, Car } from 'lucide-react';

interface ReservationPanelProps {
  selectedSpace?: ParkingSpace;
  onReserveSpace: (spaceId: string, reservedBy: string) => void;
  onReleaseReservation: (spaceId: string) => void;
  onFindNearestSpace: (row: number, col: number, request: ReservationRequest) => void;
  onUpdateOccupancy: (spaceId: string, isOccupied: boolean) => void;
}

const ReservationPanel: React.FC<ReservationPanelProps> = ({
  selectedSpace,
  onReserveSpace,
  onReleaseReservation,
  onFindNearestSpace,
  onUpdateOccupancy
}) => {
  const [reservationName, setReservationName] = useState('');
  const [searchRow, setSearchRow] = useState(0);
  const [searchCol, setSearchCol] = useState(0);
  const [searchType, setSearchType] = useState<'regular' | 'disabled' | 'electric' | 'compact'>('regular');

  const handleReserveSpace = () => {
    if (selectedSpace && reservationName.trim()) {
      onReserveSpace(selectedSpace.id, reservationName.trim());
      setReservationName('');
    }
  };

  const handleReleaseReservation = () => {
    if (selectedSpace) {
      onReleaseReservation(selectedSpace.id);
    }
  };

  const handleToggleOccupancy = () => {
    if (selectedSpace) {
      onUpdateOccupancy(selectedSpace.id, !selectedSpace.isOccupied);
    }
  };

  const handleFindNearest = () => {
    onFindNearestSpace(searchRow, searchCol, { spaceType: searchType });
  };

  const getSpaceTypeColor = (type: string) => {
    switch (type) {
      case 'electric': return 'bg-yellow-100 text-yellow-800';
      case 'disabled': return 'bg-blue-100 text-blue-800';
      case 'compact': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Selected Space Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Selected Space
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSpace ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Space ID</Label>
                  <p className="font-medium">{selectedSpace.id}</p>
                </div>
                <div>
                  <Label>Position</Label>
                  <p className="font-medium">Row {selectedSpace.row}, Col {selectedSpace.col}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <Badge className={getSpaceTypeColor(selectedSpace.spaceType)}>
                    {selectedSpace.spaceType}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={selectedSpace.isOccupied ? 'destructive' : selectedSpace.isReserved ? 'secondary' : 'default'}>
                    {selectedSpace.isOccupied ? 'Occupied' : selectedSpace.isReserved ? 'Reserved' : 'Available'}
                  </Badge>
                </div>
              </div>

              {selectedSpace.isReserved && selectedSpace.reservedBy && (
                <div>
                  <Label>Reserved By</Label>
                  <p className="font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedSpace.reservedBy}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {!selectedSpace.isOccupied && !selectedSpace.isReserved && (
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Enter your name"
                      value={reservationName}
                      onChange={(e) => setReservationName(e.target.value)}
                    />
                    <Button onClick={handleReserveSpace} disabled={!reservationName.trim()} className="w-full">
                      Reserve Space
                    </Button>
                  </div>
                )}

                {selectedSpace.isReserved && (
                  <Button onClick={handleReleaseReservation} variant="outline" className="flex-1">
                    Release Reservation
                  </Button>
                )}

                <Button 
                  onClick={handleToggleOccupancy} 
                  variant={selectedSpace.isOccupied ? "destructive" : "default"}
                  className="flex-1"
                >
                  Mark as {selectedSpace.isOccupied ? 'Available' : 'Occupied'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Click on a parking space to view details
            </p>
          )}
        </CardContent>
      </Card>

      {/* Find Nearest Space */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Find Nearest Space
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search-row">Starting Row</Label>
              <Input
                id="search-row"
                type="number"
                min="0"
                max="7"
                value={searchRow}
                onChange={(e) => setSearchRow(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="search-col">Starting Column</Label>
              <Input
                id="search-col"
                type="number"
                min="0"
                max="11"
                value={searchCol}
                onChange={(e) => setSearchCol(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="space-type">Preferred Space Type</Label>
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleFindNearest} className="w-full">
            Find Nearest Available Space
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationPanel;
