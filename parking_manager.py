import random
from collections import deque
from datetime import datetime
import math

class ParkingManager:
    def __init__(self, rows=8, cols=12):
        self.rows = rows
        self.cols = cols
        self.spaces = {}
        self.adjacency_list = {}
        self.highlighted_space = None
        self._initialize_parking_lot()
    
    def _initialize_parking_lot(self):
        """Initialize the parking lot with spaces and adjacency relationships"""
        # Create parking spaces
        space_types = ['regular', 'disabled', 'electric', 'compact']
        
        for row in range(self.rows):
            for col in range(self.cols):
                space_id = f"{row}-{col}"
                
                # Assign space types with realistic distribution
                if random.random() < 0.1:  # 10% disabled
                    space_type = 'disabled'
                elif random.random() < 0.15:  # 15% electric
                    space_type = 'electric'
                elif random.random() < 0.2:  # 20% compact
                    space_type = 'compact'
                else:
                    space_type = 'regular'
                
                self.spaces[space_id] = {
                    'id': space_id,
                    'row': row,
                    'col': col,
                    'is_occupied': random.choice([True, False]),
                    'is_reserved': False,
                    'reserved_by': None,
                    'space_type': space_type,
                    'reservation_time': None
                }
        
        # Build adjacency list for graph algorithms
        self._build_adjacency_list()
    
    def _build_adjacency_list(self):
        """Build adjacency list for finding nearest spaces"""
        for row in range(self.rows):
            for col in range(self.cols):
                space_id = f"{row}-{col}"
                self.adjacency_list[space_id] = []
                
                # Add adjacent spaces (4-directional)
                directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
                for dr, dc in directions:
                    new_row, new_col = row + dr, col + dc
                    if 0 <= new_row < self.rows and 0 <= new_col < self.cols:
                        adjacent_id = f"{new_row}-{new_col}"
                        self.adjacency_list[space_id].append(adjacent_id)
    
    def reserve_space(self, space_id, reserved_by):
        """Reserve a parking space"""
        if space_id not in self.spaces:
            return False
        
        space = self.spaces[space_id]
        if space['is_occupied'] or space['is_reserved']:
            return False
        
        space['is_reserved'] = True
        space['reserved_by'] = reserved_by
        space['reservation_time'] = datetime.now()
        return True
    
    def release_reservation(self, space_id):
        """Release a parking space reservation"""
        if space_id not in self.spaces:
            return False
        
        space = self.spaces[space_id]
        space['is_reserved'] = False
        space['reserved_by'] = None
        space['reservation_time'] = None
        return True
    
    def update_space_occupancy(self, space_id, is_occupied):
        """Update the occupancy status of a parking space"""
        if space_id not in self.spaces:
            return False
        
        space = self.spaces[space_id]
        space['is_occupied'] = is_occupied
        
        # If marking as occupied, release any reservation
        if is_occupied:
            space['is_reserved'] = False
            space['reserved_by'] = None
            space['reservation_time'] = None
        
        return True
    
    def find_nearest_available_space(self, start_row, start_col, request=None):
        """Find the nearest available parking space using BFS"""
        if request is None:
            request = {}
        
        start_id = f"{start_row}-{start_col}"
        if start_id not in self.spaces:
            return None
        
        # BFS to find nearest available space
        queue = deque([(start_id, 0)])
        visited = {start_id}
        
        while queue:
            current_id, distance = queue.popleft()
            current_space = self.spaces[current_id]
            
            # Check if this space meets criteria
            if self._is_space_available(current_space, request):
                self.highlighted_space = current_id
                return current_space
            
            # Add adjacent spaces to queue
            for adjacent_id in self.adjacency_list[current_id]:
                if adjacent_id not in visited:
                    visited.add(adjacent_id)
                    queue.append((adjacent_id, distance + 1))
        
        return None
    
    def _is_space_available(self, space, request):
        """Check if a space is available and meets request criteria"""
        # Basic availability check
        if space['is_occupied'] or space['is_reserved']:
            return False
        
        # Check space type requirement
        if request.get('space_type') and space['space_type'] != request['space_type']:
            return False
        
        return True
    
    def get_optimization_recommendations(self):
        """Generate optimization recommendations based on current state"""
        recommendations = []
        stats = self.get_analytics()
        
        # Check occupancy rate
        if stats['occupancy_rate'] > 85:
            recommendations.append("High occupancy detected. Consider implementing dynamic pricing or time limits.")
        
        # Check space type utilization
        space_type_usage = {}
        for space in self.spaces.values():
            space_type = space['space_type']
            if space_type not in space_type_usage:
                space_type_usage[space_type] = {'total': 0, 'occupied': 0}
            
            space_type_usage[space_type]['total'] += 1
            if space['is_occupied']:
                space_type_usage[space_type]['occupied'] += 1
        
        for space_type, usage in space_type_usage.items():
            if usage['total'] > 0:
                utilization = usage['occupied'] / usage['total']
                if utilization < 0.3:
                    recommendations.append(f"Low utilization of {space_type} spaces ({utilization:.1%}). Consider converting some to regular spaces.")
                elif utilization > 0.9:
                    recommendations.append(f"High demand for {space_type} spaces ({utilization:.1%}). Consider adding more.")
        
        # Check for clustering of occupied spaces
        occupied_spaces = [s for s in self.spaces.values() if s['is_occupied']]
        if len(occupied_spaces) > 10:
            # Simple clustering check
            avg_row = sum(s['row'] for s in occupied_spaces) / len(occupied_spaces)
            avg_col = sum(s['col'] for s in occupied_spaces) / len(occupied_spaces)
            
            # Count spaces far from center
            far_spaces = sum(1 for s in occupied_spaces 
                           if abs(s['row'] - avg_row) > 2 or abs(s['col'] - avg_col) > 3)
            
            if far_spaces / len(occupied_spaces) > 0.4:
                recommendations.append("Occupied spaces are scattered. Consider guidance to promote clustering for easier navigation.")
        
        if not recommendations:
            recommendations.append("Current parking allocation appears optimal. No immediate changes recommended.")
        
        return recommendations
    
    def get_analytics(self):
        """Get parking lot analytics"""
        total_spaces = len(self.spaces)
        occupied_spaces = sum(1 for s in self.spaces.values() if s['is_occupied'])
        reserved_spaces = sum(1 for s in self.spaces.values() if s['is_reserved'])
        available_spaces = total_spaces - occupied_spaces - reserved_spaces
        
        occupancy_rate = (occupied_spaces / total_spaces * 100) if total_spaces > 0 else 0
        
        # Space type distribution
        space_type_distribution = {}
        for space in self.spaces.values():
            space_type = space['space_type']
            if space_type not in space_type_distribution:
                space_type_distribution[space_type] = 0
            space_type_distribution[space_type] += 1
        
        return {
            'total_spaces': total_spaces,
            'occupied_spaces': occupied_spaces,
            'reserved_spaces': reserved_spaces,
            'available_spaces': available_spaces,
            'occupancy_rate': round(occupancy_rate, 1),
            'space_type_distribution': space_type_distribution
        }
    
    def get_lot_data(self):
        """Get complete parking lot data for frontend"""
        return {
            'name': 'Main Parking Lot',
            'rows': self.rows,
            'cols': self.cols,
            'spaces': self.spaces,
            'highlighted_space': self.highlighted_space
        }
    
    def clear_highlights(self):
        """Clear highlighted spaces"""
        self.highlighted_space = None