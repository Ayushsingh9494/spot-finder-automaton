
import { ParkingLot, ParkingSpace, ReservationRequest } from '@/types/parking';

export class ParkingManager {
  private lot: ParkingLot;

  constructor(lot: ParkingLot) {
    this.lot = lot;
  }

  // Reserve a parking space
  reserveSpace(spaceId: string, reservedBy: string): boolean {
    const space = this.lot.spaces.get(spaceId);
    if (!space || space.isOccupied || space.isReserved) {
      return false;
    }

    space.isReserved = true;
    space.reservedBy = reservedBy;
    space.reservationTime = new Date();
    this.lot.spaces.set(spaceId, space);
    
    console.log(`Space ${spaceId} reserved by ${reservedBy}`);
    return true;
  }

  // Release a reservation
  releaseReservation(spaceId: string): boolean {
    const space = this.lot.spaces.get(spaceId);
    if (!space || !space.isReserved) {
      return false;
    }

    space.isReserved = false;
    space.reservedBy = undefined;
    space.reservationTime = undefined;
    this.lot.spaces.set(spaceId, space);
    
    console.log(`Reservation released for space ${spaceId}`);
    return true;
  }

  // Update space occupancy
  updateSpaceOccupancy(spaceId: string, isOccupied: boolean): boolean {
    const space = this.lot.spaces.get(spaceId);
    if (!space) {
      return false;
    }

    space.isOccupied = isOccupied;
    if (isOccupied) {
      // If marking as occupied, release any reservation
      space.isReserved = false;
      space.reservedBy = undefined;
      space.reservationTime = undefined;
    }
    
    this.lot.spaces.set(spaceId, space);
    console.log(`Space ${spaceId} marked as ${isOccupied ? 'occupied' : 'available'}`);
    return true;
  }

  // Find nearest available space using BFS
  findNearestAvailableSpace(startRow: number, startCol: number, request: ReservationRequest = {}): ParkingSpace | null {
    const visited = new Set<string>();
    const queue: Array<{ row: number; col: number; distance: number }> = [];
    
    queue.push({ row: startRow, col: startCol, distance: 0 });
    visited.add(`${startRow}-${startCol}`);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const spaceId = `${current.row}-${current.col}`;
      const space = this.lot.spaces.get(spaceId);

      if (space && this.isSpaceAvailable(space, request)) {
        console.log(`Found nearest space: ${spaceId} at distance ${current.distance}`);
        return space;
      }

      // Add adjacent spaces to queue
      const adjacentSpaces = this.lot.adjacencyList.get(spaceId) || [];
      for (const adjacentId of adjacentSpaces) {
        if (!visited.has(adjacentId)) {
          visited.add(adjacentId);
          const [row, col] = adjacentId.split('-').map(Number);
          queue.push({ row, col, distance: current.distance + 1 });
        }
      }
    }

    console.log('No available space found');
    return null;
  }

  // Check if space is available and matches criteria
  private isSpaceAvailable(space: ParkingSpace, request: ReservationRequest): boolean {
    if (space.isOccupied || space.isReserved) {
      return false;
    }

    if (request.spaceType && space.spaceType !== request.spaceType) {
      return false;
    }

    if (request.preferredRow !== undefined && space.row !== request.preferredRow) {
      return false;
    }

    if (request.preferredCol !== undefined && space.col !== request.preferredCol) {
      return false;
    }

    return true;
  }

  // Get optimization recommendations
  optimizeSpaceAllocation(): string[] {
    const recommendations: string[] = [];
    const spaces = Array.from(this.lot.spaces.values());
    
    // Calculate occupancy rate
    const occupiedSpaces = spaces.filter(s => s.isOccupied).length;
    const totalSpaces = spaces.length;
    const occupancyRate = (occupiedSpaces / totalSpaces) * 100;

    if (occupancyRate > 80) {
      recommendations.push('High occupancy detected (>80%). Consider expanding parking capacity or implementing dynamic pricing.');
    }

    // Check for clustering of occupied spaces
    const occupiedByRow = spaces.reduce((acc, space) => {
      if (space.isOccupied) {
        acc[space.row] = (acc[space.row] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const maxOccupiedRow = Math.max(...Object.values(occupiedByRow));
    const minOccupiedRow = Math.min(...Object.values(occupiedByRow));

    if (maxOccupiedRow - minOccupiedRow > 3) {
      recommendations.push('Uneven space distribution detected. Consider guiding traffic to less occupied areas.');
    }

    // Check disabled space utilization
    const disabledSpaces = spaces.filter(s => s.spaceType === 'disabled');
    const occupiedDisabledSpaces = disabledSpaces.filter(s => s.isOccupied).length;
    
    if (disabledSpaces.length > 0 && occupiedDisabledSpaces / disabledSpaces.length < 0.1) {
      recommendations.push('Low utilization of disabled spaces. Consider converting some to regular spaces.');
    }

    // Check electric vehicle space utilization
    const electricSpaces = spaces.filter(s => s.spaceType === 'electric');
    const occupiedElectricSpaces = electricSpaces.filter(s => s.isOccupied).length;
    
    if (electricSpaces.length > 0 && occupiedElectricSpaces / electricSpaces.length > 0.9) {
      recommendations.push('High demand for electric vehicle spaces. Consider adding more charging stations.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Current space allocation is optimal. No immediate changes recommended.');
    }

    return recommendations;
  }

  // Get current lot statistics
  getLotStatistics() {
    const spaces = Array.from(this.lot.spaces.values());
    return {
      total: spaces.length,
      occupied: spaces.filter(s => s.isOccupied).length,
      reserved: spaces.filter(s => s.isReserved).length,
      available: spaces.filter(s => !s.isOccupied && !s.isReserved).length,
      byType: spaces.reduce((acc, space) => {
        acc[space.spaceType] = (acc[space.spaceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}
