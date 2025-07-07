
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ParkingSpace, ReservationRequest } from '@/types/parking';
import { MapPin, Clock, User, Car } from 'lucide-react';

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
  const [reservedBy, setReservedBy] = useState('');
  const [searchRow, setSearchRow] = useState(0);
  const [searchCol, setSearchCol] = useState(0);
  const [preferredType, setPreferredType] = useState<string>('');

  const handleReserve = () => {
    if (selectedSpace && reservedBy.trim()) {
      onReserveSpace(selectedSpace.id, reservedBy.trim());
      setReservedBy('');
    }
  };

  const handleFindNearest = () => {
    const request: ReservationRequest = {};
    if (preferredType) {
      request.spaceType = preferredType as any;
    }
    onFindNearestSpace(searchRow, searchCol, request);
  };

  return (
    <div className="space-y-6">
      {/* Selected Space Info */}
      {selectedSpace && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Space {selectedSpace.id}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Type</Label>
                <p className="font-medium capitalize">{selectedSpace.spaceType}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className={`font-medium ${
                  selectedSpace.isOccupied ? 'text-red-600' : 
                  selectedSpace.isReserved ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {selectedSpace.isOccupied ? 'Occupied' : 
                   selectedSpace.isReserved ? 'Reserved' : 'Available'}
                </p>
              </div>
            </div>

            {selectedSpace.isReserved && selectedSpace.reservedBy && (
              <div>
                <Label>Reserved by</Label>
                <p className="font-medium">{selectedSpace.reservedBy}</p>
              </div>
            )}

            <div className="space-y-2">
              {!selectedSpace.isOccupied && !selectedSpace.isReserved && (
                <div className="space-y-2">
                  <Label htmlFor="reservedBy">Reserve for:</Label>
                  <div className="flex gap-2">
                    <Input
                      id="reservedBy"
                      placeholder="Enter name or license plate"
                      value={reservedBy}
                      onChange={(e) => setReservedBy(e.target.value)}
                    />
                    <Button onClick={handleReserve} disabled={!reservedBy.trim()}>
                      Reserve
                    </Button>
                  </div>
                </div>
              )}

              {selectedSpace.isReserved && (
                <Button 
                  onClick={() => onReleaseReservation(selectedSpace.id)}
                  variant="outline"
                  className="w-full"
                >
                  Release Reservation
                </Button>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => onUpdateOccupancy(selectedSpace.id, !selectedSpace.isOccupied)}
                  variant={selectedSpace.isOccupied ? "destructive" : "default"}
                  className="flex-1"
                >
                  Mark as {selectedSpace.isOccupied ? 'Available' : 'Occupied'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Find Nearest Space */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Find Nearest Space
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="searchRow">Start Row</Label>
              <Input
                id="searchRow"
                type="number"
                min="0"
                value={searchRow}
                onChange={(e) => setSearchRow(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="searchCol">Start Column</Label>
              <Input
                id="searchCol"
                type="number"
                min="0"
                value={searchCol}
                onChange={(e) => setSearchCol(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label>Preferred Type</Label>
            <Select value={preferredType} onValueChange={setPreferredType}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any type</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
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
