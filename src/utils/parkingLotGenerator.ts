
import { ParkingLot, ParkingSpace } from '@/types/parking';

export function generateParkingLot(rows: number, cols: number): ParkingLot {
  const spaces = new Map<string, ParkingSpace>();
  const adjacencyList = new Map<string, string[]>();

  // Generate spaces with realistic distribution
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const spaceId = `${row}-${col}`;
      
      // Determine space type based on position
      let spaceType: ParkingSpace['spaceType'] = 'regular';
      if (row === 0 && col < 2) spaceType = 'disabled'; // Front row disabled spaces
      else if (col === 0 && row < 3) spaceType = 'electric'; // Left column electric
      else if (Math.random() < 0.2) spaceType = 'compact'; // 20% compact spaces
      
      const space: ParkingSpace = {
        id: spaceId,
        row,
        col,
        isOccupied: Math.random() < 0.4, // 40% initially occupied
        isReserved: false,
        spaceType
      };

      spaces.set(spaceId, space);
    }
  }

  // Build adjacency list for graph representation
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const spaceId = `${row}-${col}`;
      const adjacent: string[] = [];

      // Add adjacent spaces (4-directional)
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          adjacent.push(`${newRow}-${newCol}`);
        }
      }

      adjacencyList.set(spaceId, adjacent);
    }
  }

  return {
    id: 'main-lot',
    name: 'Main Parking Lot',
    rows,
    cols,
    spaces,
    adjacencyList
  };
}
