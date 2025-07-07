
import React from 'react';
import { ParkingLot, ParkingSpace } from '@/types/parking';
import ParkingSpaceCard from './ParkingSpaceCard';

interface ParkingLotGridProps {
  lot: ParkingLot;
  selectedSpace?: ParkingSpace;
  onSpaceClick: (space: ParkingSpace) => void;
  highlightedSpaces?: Set<string>;
}

const ParkingLotGrid: React.FC<ParkingLotGridProps> = ({ 
  lot, 
  selectedSpace, 
  onSpaceClick, 
  highlightedSpaces 
}) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{lot.name}</h3>
      <div 
        className="grid gap-2 justify-items-center"
        style={{ 
          gridTemplateColumns: `repeat(${lot.cols}, 1fr)`,
          maxWidth: `${lot.cols * 3.5}rem`
        }}
      >
        {Array.from({ length: lot.rows }, (_, row) =>
          Array.from({ length: lot.cols }, (_, col) => {
            const spaceId = `${row}-${col}`;
            const space = lot.spaces.get(spaceId);
            if (!space) return null;
            
            return (
              <ParkingSpaceCard
                key={spaceId}
                space={space}
                onClick={onSpaceClick}
                isSelected={selectedSpace?.id === spaceId || highlightedSpaces?.has(spaceId)}
              />
            );
          })
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default ParkingLotGrid;
