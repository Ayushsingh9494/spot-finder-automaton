
export interface ParkingSpace {
  id: string;
  row: number;
  col: number;
  isOccupied: boolean;
  isReserved: boolean;
  reservedBy?: string;
  spaceType: 'regular' | 'disabled' | 'electric' | 'compact';
  reservationTime?: Date;
}

export interface ParkingLot {
  id: string;
  name: string;
  rows: number;
  cols: number;
  spaces: Map<string, ParkingSpace>;
  adjacencyList: Map<string, string[]>;
}

export interface ReservationRequest {
  spaceType?: 'regular' | 'disabled' | 'electric' | 'compact';
  preferredRow?: number;
  preferredCol?: number;
  duration?: number; // in minutes
}

export interface ParkingAnalytics {
  totalSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  availableSpaces: number;
  occupancyRate: number;
  peakHours: { hour: number; occupancy: number }[];
  spaceTypeDistribution: Record<string, number>;
}
