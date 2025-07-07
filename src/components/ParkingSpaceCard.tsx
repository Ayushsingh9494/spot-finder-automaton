
import React from 'react';
import { ParkingSpace } from '@/types/parking';
import { Car, Zap, Users, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParkingSpaceCardProps {
  space: ParkingSpace;
  onClick: (space: ParkingSpace) => void;
  isSelected?: boolean;
}

const ParkingSpaceCard: React.FC<ParkingSpaceCardProps> = ({ space, onClick, isSelected }) => {
  const getSpaceColor = () => {
    if (space.isOccupied) return 'bg-red-500 hover:bg-red-600';
    if (space.isReserved) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  const getSpaceIcon = () => {
    switch (space.spaceType) {
      case 'electric':
        return <Zap className="w-3 h-3" />;
      case 'disabled':
        return <Users className="w-3 h-3" />;
      case 'compact':
        return <Minus className="w-3 h-3" />;
      default:
        return <Car className="w-3 h-3" />;
    }
  };

  return (
    <div
      onClick={() => onClick(space)}
      className={cn(
        'w-12 h-12 rounded-lg border-2 border-white cursor-pointer transition-all duration-200 flex items-center justify-center text-white shadow-sm',
        getSpaceColor(),
        isSelected && 'ring-2 ring-blue-400 ring-offset-2',
        'hover:scale-105 hover:shadow-md'
      )}
      title={`Space ${space.id} - ${space.spaceType} ${space.isOccupied ? '(Occupied)' : space.isReserved ? '(Reserved)' : '(Available)'}`}
    >
      {getSpaceIcon()}
    </div>
  );
};

export default ParkingSpaceCard;
