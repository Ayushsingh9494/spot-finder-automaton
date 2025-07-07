
import { useState, useEffect, useMemo } from 'react';
import { ParkingLot, ParkingSpace, ReservationRequest, ParkingAnalytics } from '@/types/parking';
import { ParkingManager } from '@/utils/parkingAlgorithms';
import { generateParkingLot } from '@/utils/parkingLotGenerator';

export const useParkingManager = (rows: number = 8, cols: number = 12) => {
  const [lot, setLot] = useState<ParkingLot>(() => generateParkingLot(rows, cols));
  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | undefined>();
  const [highlightedSpaces, setHighlightedSpaces] = useState<Set<string>>(new Set());

  const parkingManager = useMemo(() => new ParkingManager(lot), [lot]);

  // Calculate analytics
  const analytics: ParkingAnalytics = useMemo(() => {
    const spaces = Array.from(lot.spaces.values());
    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(s => s.isOccupied).length;
    const reservedSpaces = spaces.filter(s => s.isReserved).length;
    const availableSpaces = totalSpaces - occupiedSpaces - reservedSpaces;
    
    const spaceTypeDistribution = spaces.reduce((acc, space) => {
      acc[space.spaceType] = (acc[space.spaceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mock peak hours data
    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      occupancy: Math.floor(Math.random() * 100)
    }));

    return {
      totalSpaces,
      occupiedSpaces,
      reservedSpaces,
      availableSpaces,
      occupancyRate: (occupiedSpaces / totalSpaces) * 100,
      peakHours,
      spaceTypeDistribution
    };
  }, [lot]);

  const updateLot = () => {
    setLot(prevLot => ({
      ...prevLot,
      spaces: new Map(prevLot.spaces)
    }));
  };

  const reserveSpace = (spaceId: string, reservedBy: string) => {
    if (parkingManager.reserveSpace(spaceId, reservedBy)) {
      updateLot();
      return true;
    }
    return false;
  };

  const releaseReservation = (spaceId: string) => {
    if (parkingManager.releaseReservation(spaceId)) {
      updateLot();
      return true;
    }
    return false;
  };

  const updateSpaceOccupancy = (spaceId: string, isOccupied: boolean) => {
    if (parkingManager.updateSpaceOccupancy(spaceId, isOccupied)) {
      updateLot();
      return true;
    }
    return false;
  };

  const findNearestSpace = (row: number, col: number, request: ReservationRequest = {}) => {
    const nearestSpace = parkingManager.findNearestAvailableSpace(row, col, request);
    if (nearestSpace) {
      setSelectedSpace(nearestSpace);
      setHighlightedSpaces(new Set([nearestSpace.id]));
      console.log(`Nearest space found: ${nearestSpace.id}`);
    } else {
      setHighlightedSpaces(new Set());
      console.log('No available space found');
    }
    return nearestSpace;
  };

  const getOptimizationRecommendations = () => {
    return parkingManager.optimizeSpaceAllocation();
  };

  return {
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
    clearHighlights: () => setHighlightedSpaces(new Set())
  };
};
