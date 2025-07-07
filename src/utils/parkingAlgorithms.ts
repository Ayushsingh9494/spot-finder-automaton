
import { ParkingSpace, ParkingLot, ReservationRequest } from '@/types/parking';

export class ParkingManager {
  private lot: ParkingLot;
  private spaceHashMap: Map<string, ParkingSpace>;

  constructor(lot: ParkingLot) {
    this.lot = lot;
    this.spaceHashMap = new Map(lot.spaces);
  }

  // BFS to find nearest available space
  findNearestAvailableSpace(startRow: number, startCol: number, request: ReservationRequest = {}): ParkingSpace | null {
    const queue: Array<{row: number, col: number, distance: number}> = [];
    const visited = new Set<string>();
    const startId = `${startRow}-${startCol}`;
    
    queue.push({ row: startRow, col: startCol, distance: 0 });
    visited.add(startId);

    while (queue.length > 0) {
      const { row, col, distance } = queue.shift()!;
      const spaceId = `${row}-${col}`;
      const space = this.spaceHashMap.get(spaceId);

      if (space && this.isSpaceAvailable(space, request)) {
        console.log(`Found nearest available space: ${spaceId} at distance ${distance}`);
        return space;
      }

      // Add adjacent spaces to queue
      const adjacentSpaces = this.lot.adjacencyList.get(spaceId) || [];
      for (const adjId of adjacentSpaces) {
        if (!visited.has(adjId)) {
          visited.add(adjId);
          const [adjRow, adjCol] = adjId.split('-').map(Number);
          queue.push({ row: adjRow, col: adjCol, distance: distance + 1 });
        }
      }
    }

    console.log('No available space found');
    return null;
  }

  private isSpaceAvailable(space: ParkingSpace, request: ReservationRequest): boolean {
    if (space.isOccupied || space.isReserved) return false;
    if (request.spaceType && space.spaceType !== request.spaceType) return false;
    return true;
  }

  // Reserve a space using hash map for O(1) lookup
  reserveSpace(spaceId: string, reservedBy: string): boolean {
    const space = this.spaceHashMap.get(spaceId);
    if (!space || space.isOccupied || space.isReserved) {
      console.log(`Cannot reserve space ${spaceId}: not available`);
      return false;
    }

    space.isReserved = true;
    space.reservedBy = reservedBy;
    space.reservationTime = new Date();
    
    console.log(`Space ${spaceId} reserved by ${reservedBy}`);
    return true;
  }

  // Release a reservation
  releaseReservation(spaceId: string): boolean {
    const space = this.spaceHashMap.get(spaceId);
    if (!space || !space.isReserved) return false;

    space.isReserved = false;
    space.reservedBy = undefined;
    space.reservationTime = undefined;
    
    console.log(`Reservation released for space ${spaceId}`);
    return true;
  }

  // Optimize space allocation based on usage patterns
  optimizeSpaceAllocation(): string[] {
    const recommendations: string[] = [];
    const spacesByType = new Map<string, ParkingSpace[]>();
    
    // Group spaces by type
    for (const [id, space] of this.spaceHashMap) {
      if (!spacesByType.has(space.spaceType)) {
        spacesByType.set(space.spaceType, []);
      }
      spacesByType.get(space.spaceType)!.push(space);
    }

    // Analyze usage patterns and suggest optimizations
    spacesByType.forEach((spaces, type) => {
      const occupancyRate = spaces.filter(s => s.isOccupied).length / spaces.length;
      if (occupancyRate > 0.9) {
        recommendations.push(`Consider adding more ${type} spaces (${Math.round(occupancyRate * 100)}% occupied)`);
      } else if (occupancyRate < 0.3) {
        recommendations.push(`${type} spaces are underutilized (${Math.round(occupancyRate * 100)}% occupied)`);
      }
    });

    return recommendations;
  }

  // Get all available spaces by type
  getAvailableSpacesByType(spaceType?: string): ParkingSpace[] {
    const availableSpaces: ParkingSpace[] = [];
    
    for (const [id, space] of this.spaceHashMap) {
      if (!space.isOccupied && !space.isReserved) {
        if (!spaceType || space.spaceType === spaceType) {
          availableSpaces.push(space);
        }
      }
    }
    
    return availableSpaces;
  }

  // Update space occupancy
  updateSpaceOccupancy(spaceId: string, isOccupied: boolean): boolean {
    const space = this.spaceHashMap.get(spaceId);
    if (!space) return false;

    space.isOccupied = isOccupied;
    if (isOccupied && space.isReserved) {
      // Clear reservation when space becomes occupied
      space.isReserved = false;
      space.reservedBy = undefined;
      space.reservationTime = undefined;
    }
    
    console.log(`Space ${spaceId} occupancy updated: ${isOccupied ? 'occupied' : 'available'}`);
    return true;
  }
}
