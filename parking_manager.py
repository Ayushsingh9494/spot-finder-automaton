import random
import math
from collections import deque
from datetime import datetime

class ParkingSpace:
    def __init__(self, id, row, col, space_type="regular"):
        self.id = id
        self.row = row
        self.col = col
        self.space_type = space_type
        self.is_occupied = False
        self.is_reserved = False
        self.reserved_by = None
        self.reservation_time = None

    def to_dict(self):
        return {
            'id': self.id,
            'row': self.row,
            'col': self.col,
            'spaceType': self.space_type,
            'isOccupied': self.is_occupied,
            'isReserved': self.is_reserved,
            'reservedBy': self.reserved_by,
            'reservationTime': self.reservation_time.isoformat() if self.reservation_time else None
        }

class ParkingManager:
    def __init__(self, rows=8, cols=12):
        self.rows = rows
        self.cols = cols
        self.spaces = {}
        self.adjacency_list = {}
        self._initialize_parking_lot()

    def _initialize_parking_lot(self):
        """Initialize parking lot with spaces and adjacency list"""
        # Create spaces
        for row in range(self.rows):
            for col in range(self.cols):
                space_id = f"{row}-{col}"
                space_type = self._determine_space_type(row, col)
                space = ParkingSpace(space_id, row, col, space_type)
                
                # Randomly occupy some spaces for demonstration
                if random.random() < 0.3:  # 30% occupied
                    space.is_occupied = True
                
                self.spaces[space_id] = space

        # Build adjacency list for graph traversal
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

    def _determine_space_type(self, row, col):
        """Determine space type based on position"""
        # First row for disabled spaces
        if row == 0 and col < 4:
            return "disabled"
        # Last row for electric vehicle spaces
        elif row == self.rows - 1 and col < 6:
            return "electric"
        # Some compact spaces in the middle
        elif row == self.rows // 2 and col % 3 == 0:
            return "compact"
        else:
            return "regular"

    def get_lot_data(self):
        """Get current parking lot state"""
        spaces_list = [space.to_dict() for space in self.spaces.values()]
        return {
            'id': 'main-lot',
            'name': 'Main Parking Lot',
            'rows': self.rows,
            'cols': self.cols,
            'spaces': spaces_list
        }

    def get_analytics(self):
        """Calculate and return parking analytics"""
        spaces = list(self.spaces.values())
        total_spaces = len(spaces)
        occupied_spaces = sum(1 for s in spaces if s.is_occupied)
        reserved_spaces = sum(1 for s in spaces if s.is_reserved)
        available_spaces = total_spaces - occupied_spaces - reserved_spaces
        
        # Space type distribution
        space_type_distribution = {}
        for space in spaces:
            space_type = space.space_type
            space_type_distribution[space_type] = space_type_distribution.get(space_type, 0) + 1
        
        # Mock peak hours data
        peak_hours = []
        for hour in range(24):
            occupancy = max(0, min(100, 50 + 30 * math.sin((hour - 6) * math.pi / 12) + random.randint(-10, 10)))
            peak_hours.append({'hour': hour, 'occupancy': occupancy})
        
        return {
            'totalSpaces': total_spaces,
            'occupiedSpaces': occupied_spaces,
            'reservedSpaces': reserved_spaces,
            'availableSpaces': available_spaces,
            'occupancyRate': round((occupied_spaces / total_spaces) * 100, 1),
            'peakHours': peak_hours,
            'spaceTypeDistribution': space_type_distribution
        }

    def reserve_space(self, space_id, reserved_by):
        """Reserve a parking space"""
        space = self.spaces.get(space_id)
        if not space or space.is_occupied or space.is_reserved:
            return False
        
        space.is_reserved = True
        space.reserved_by = reserved_by
        space.reservation_time = datetime.now()
        return True

    def release_reservation(self, space_id):
        """Release a reservation"""
        space = self.spaces.get(space_id)
        if not space or not space.is_reserved:
            return False
        
        space.is_reserved = False
        space.reserved_by = None
        space.reservation_time = None
        return True

    def update_space_occupancy(self, space_id, is_occupied):
        """Update space occupancy status"""
        space = self.spaces.get(space_id)
        if not space:
            return False
        
        space.is_occupied = is_occupied
        if is_occupied:
            # Clear reservation when occupied
            space.is_reserved = False
            space.reserved_by = None
            space.reservation_time = None
        
        return True

    def find_nearest_available_space(self, start_row, start_col, space_type=None):
        """Find nearest available space using BFS"""
        visited = set()
        queue = deque([(start_row, start_col, 0)])
        visited.add(f"{start_row}-{start_col}")
        
        while queue:
            row, col, distance = queue.popleft()
            space_id = f"{row}-{col}"
            space = self.spaces.get(space_id)
            
            if space and self._is_space_available(space, space_type):
                return {
                    'id': space.id,
                    'row': space.row,
                    'col': space.col,
                    'spaceType': space.space_type,
                    'distance': distance
                }
            
            # Add adjacent spaces to queue
            for adjacent_id in self.adjacency_list.get(space_id, []):
                if adjacent_id not in visited:
                    visited.add(adjacent_id)
                    adj_row, adj_col = map(int, adjacent_id.split('-'))
                    queue.append((adj_row, adj_col, distance + 1))
        
        return None

    def _is_space_available(self, space, space_type=None):
        """Check if space is available and matches criteria"""
        if space.is_occupied or space.is_reserved:
            return False
        
        if space_type and space.space_type != space_type:
            return False
        
        return True

    def get_optimization_recommendations(self):
        """Get optimization recommendations"""
        spaces = list(self.spaces.values())
        recommendations = []
        
        # Calculate occupancy rate
        occupied_spaces = sum(1 for s in spaces if s.is_occupied)
        total_spaces = len(spaces)
        occupancy_rate = (occupied_spaces / total_spaces) * 100
        
        if occupancy_rate > 80:
            recommendations.append('High occupancy detected (>80%). Consider expanding parking capacity or implementing dynamic pricing.')
        
        # Check for clustering of occupied spaces
        occupied_by_row = {}
        for space in spaces:
            if space.is_occupied:
                occupied_by_row[space.row] = occupied_by_row.get(space.row, 0) + 1
        
        if occupied_by_row:
            max_occupied_row = max(occupied_by_row.values())
            min_occupied_row = min(occupied_by_row.values())
            
            if max_occupied_row - min_occupied_row > 3:
                recommendations.append('Uneven space distribution detected. Consider guiding traffic to less occupied areas.')
        
        # Check disabled space utilization
        disabled_spaces = [s for s in spaces if s.space_type == 'disabled']
        if disabled_spaces:
            occupied_disabled = sum(1 for s in disabled_spaces if s.is_occupied)
            if occupied_disabled / len(disabled_spaces) < 0.1:
                recommendations.append('Low utilization of disabled spaces. Consider converting some to regular spaces.')
        
        # Check electric vehicle space utilization
        electric_spaces = [s for s in spaces if s.space_type == 'electric']
        if electric_spaces:
            occupied_electric = sum(1 for s in electric_spaces if s.is_occupied)
            if occupied_electric / len(electric_spaces) > 0.9:
                recommendations.append('High demand for electric vehicle spaces. Consider adding more charging stations.')
        
        if not recommendations:
            recommendations.append('Current space allocation is optimal. No immediate changes recommended.')
        
        return recommendations