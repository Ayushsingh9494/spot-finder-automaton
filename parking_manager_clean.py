# -*- coding: utf-8 -*-
"""
Smart Parking Management System
Handles parking lot operations, reservations, and analytics
"""

import random
from collections import deque
from typing import List, Dict, Optional, Tuple
import math

class ParkingSpace:
    """Represents a single parking space in the lot"""
    
    def __init__(self, space_id: str, row: int, col: int, space_type: str = "regular"):
        self.id = space_id
        self.row = row
        self.col = col
        self.space_type = space_type  # regular, disabled, ev_charging, vip
        self.is_occupied = False
        self.is_reserved = False
        self.reserved_by = None
        self.reservation_time = None
    
    def to_dict(self) -> Dict:
        """Convert space to dictionary representation"""
        return {
            'id': self.id,
            'row': self.row,
            'col': self.col,
            'space_type': self.space_type,
            'is_occupied': self.is_occupied,
            'is_reserved': self.is_reserved,
            'reserved_by': self.reserved_by,
            'reservation_time': self.reservation_time
        }

class ParkingManager:
    """Main parking lot management system"""
    
    def __init__(self, rows: int = 8, cols: int = 12):
        self.rows = rows
        self.cols = cols
        self.spaces = {}
        self.adjacency_list = {}
        self._initialize_parking_lot()
    
    def _initialize_parking_lot(self):
        """Initialize the parking lot with spaces and random occupancy"""
        
        # Create parking spaces
        for row in range(self.rows):
            for col in range(self.cols):
                space_id = f"{chr(65 + row)}{col + 1:02d}"
                
                # Assign space types
                space_type = "regular"
                if row == 0 and col < 2:  # First two spots in first row for disabled
                    space_type = "disabled"
                elif row == 0 and col < 4:  # Next two for VIP
                    space_type = "vip"
                elif row == 1 and col < 3:  # Some EV charging spots
                    space_type = "ev_charging"
                
                space = ParkingSpace(space_id, row, col, space_type)
                
                # Randomly occupy some spaces
                if random.random() < 0.3:  # 30% occupied
                    space.is_occupied = True
                
                self.spaces[space_id] = space
        
        # Build adjacency list for pathfinding
        self._build_adjacency_list()
    
    def _build_adjacency_list(self):
        """Build adjacency list for BFS pathfinding"""
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]  # up, down, left, right
        
        for row in range(self.rows):
            for col in range(self.cols):
                space_id = f"{chr(65 + row)}{col + 1:02d}"
                self.adjacency_list[space_id] = []
                
                for dr, dc in directions:
                    new_row, new_col = row + dr, col + dc
                    if 0 <= new_row < self.rows and 0 <= new_col < self.cols:
                        neighbor_id = f"{chr(65 + new_row)}{new_col + 1:02d}"
                        self.adjacency_list[space_id].append(neighbor_id)
    
    def get_lot_data(self) -> Dict:
        """Get current state of the parking lot"""
        spaces_data = [space.to_dict() for space in self.spaces.values()]
        
        return {
            'rows': self.rows,
            'cols': self.cols,
            'spaces': spaces_data,
            'total_spaces': len(self.spaces),
            'occupied_spaces': sum(1 for space in self.spaces.values() if space.is_occupied),
            'reserved_spaces': sum(1 for space in self.spaces.values() if space.is_reserved),
            'available_spaces': sum(1 for space in self.spaces.values() 
                                  if not space.is_occupied and not space.is_reserved)
        }
    
    def get_analytics(self) -> Dict:
        """Calculate and return parking analytics"""
        total_spaces = len(self.spaces)
        occupied_spaces = sum(1 for space in self.spaces.values() if space.is_occupied)
        reserved_spaces = sum(1 for space in self.spaces.values() if space.is_reserved)
        
        occupancy_rate = (occupied_spaces / total_spaces) * 100 if total_spaces > 0 else 0
        
        # Space type distribution
        space_types = {}
        for space in self.spaces.values():
            space_types[space.space_type] = space_types.get(space.space_type, 0) + 1
        
        # Mock peak hours data
        peak_hours = [
            {'hour': '08:00', 'occupancy': 85},
            {'hour': '12:00', 'occupancy': 95},
            {'hour': '17:00', 'occupancy': 90},
            {'hour': '20:00', 'occupancy': 60}
        ]
        
        return {
            'total_spaces': total_spaces,
            'occupied_spaces': occupied_spaces,
            'reserved_spaces': reserved_spaces,
            'available_spaces': total_spaces - occupied_spaces - reserved_spaces,
            'occupancy_rate': round(occupancy_rate, 2),
            'space_types': space_types,
            'peak_hours': peak_hours
        }
    
    def reserve_space(self, space_id: str, reserved_by: str) -> bool:
        """Reserve a parking space"""
        if space_id in self.spaces:
            space = self.spaces[space_id]
            if not space.is_occupied and not space.is_reserved:
                space.is_reserved = True
                space.reserved_by = reserved_by
                return True
        return False
    
    def release_reservation(self, space_id: str) -> bool:
        """Release a parking space reservation"""
        if space_id in self.spaces:
            space = self.spaces[space_id]
            if space.is_reserved:
                space.is_reserved = False
                space.reserved_by = None
                space.reservation_time = None
                return True
        return False
    
    def update_space_occupancy(self, space_id: str, is_occupied: bool) -> bool:
        """Update space occupancy status"""
        if space_id in self.spaces:
            space = self.spaces[space_id]
            space.is_occupied = is_occupied
            if is_occupied:
                # Clear reservation when occupied
                space.is_reserved = False
                space.reserved_by = None
            return True
        return False
    
    def find_nearest_available_space(self, start_row: int, start_col: int, space_type: Optional[str] = None) -> Optional[Dict]:
        """Find nearest available space using BFS"""
        start_id = f"{chr(65 + start_row)}{start_col + 1:02d}"
        
        if start_id not in self.spaces:
            return None
        
        queue = deque([start_id])
        visited = set([start_id])
        
        while queue:
            current_id = queue.popleft()
            current_space = self.spaces[current_id]
            
            if self._is_space_available(current_space, space_type):
                return current_space.to_dict()
            
            for neighbor_id in self.adjacency_list.get(current_id, []):
                if neighbor_id not in visited:
                    visited.add(neighbor_id)
                    queue.append(neighbor_id)
        
        return None
    
    def _is_space_available(self, space: ParkingSpace, space_type: Optional[str] = None) -> bool:
        """Check if space is available"""
        if space.is_occupied or space.is_reserved:
            return False
        
        if space_type and space.space_type != space_type:
            return False
        
        return True
    
    def get_optimization_recommendations(self) -> List[str]:
        """Get optimization recommendations based on current state"""
        recommendations = []
        
        analytics = self.get_analytics()
        occupancy_rate = analytics['occupancy_rate']
        
        if occupancy_rate > 90:
            recommendations.append("High occupancy detected. Consider implementing dynamic pricing.")
            recommendations.append("Suggest alternative parking locations to users.")
        elif occupancy_rate < 30:
            recommendations.append("Low occupancy detected. Consider promotional offers.")
        
        # Check space distribution
        total_spaces = analytics['total_spaces']
        space_types = analytics['space_types']
        
        regular_ratio = space_types.get('regular', 0) / total_spaces
        if regular_ratio < 0.8:
            recommendations.append("Consider optimizing space type distribution.")
        
        # Check for underutilized special spaces
        for space_type, count in space_types.items():
            if space_type != 'regular':
                occupied_count = sum(1 for space in self.spaces.values() 
                                   if space.space_type == space_type and space.is_occupied)
                utilization = (occupied_count / count) * 100 if count > 0 else 0
                
                if utilization < 20:
                    recommendations.append(f"Low utilization of {space_type} spaces ({utilization:.1f}%). Consider converting some to regular spaces.")
        
        if not recommendations:
            recommendations.append("Parking lot is operating efficiently.")
        
        return recommendations