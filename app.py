from flask import Flask, render_template, request, jsonify
from parking_manager import ParkingManager
import json

app = Flask(__name__)

# Initialize parking manager
parking_manager = ParkingManager(rows=8, cols=12)

@app.route('/')
def index():
    """Render the main parking management page"""
    return render_template('index.html')

@app.route('/api/parking-lot')
def get_parking_lot():
    """Get current parking lot state"""
    return jsonify(parking_manager.get_lot_data())

@app.route('/api/analytics')
def get_analytics():
    """Get parking analytics"""
    return jsonify(parking_manager.get_analytics())

@app.route('/api/reserve-space', methods=['POST'])
def reserve_space():
    """Reserve a parking space"""
    data = request.get_json()
    space_id = data.get('space_id')
    reserved_by = data.get('reserved_by', 'User')
    
    success = parking_manager.reserve_space(space_id, reserved_by)
    return jsonify({'success': success, 'message': f'Space {space_id} {"reserved" if success else "could not be reserved"}'})

@app.route('/api/release-reservation', methods=['POST'])
def release_reservation():
    """Release a parking space reservation"""
    data = request.get_json()
    space_id = data.get('space_id')
    
    success = parking_manager.release_reservation(space_id)
    return jsonify({'success': success, 'message': f'Reservation for space {space_id} {"released" if success else "could not be released"}'})

@app.route('/api/update-occupancy', methods=['POST'])
def update_occupancy():
    """Update space occupancy status"""
    data = request.get_json()
    space_id = data.get('space_id')
    is_occupied = data.get('is_occupied')
    
    success = parking_manager.update_space_occupancy(space_id, is_occupied)
    status = "occupied" if is_occupied else "available"
    return jsonify({'success': success, 'message': f'Space {space_id} marked as {status}'})

@app.route('/api/find-nearest', methods=['POST'])
def find_nearest_space():
    """Find nearest available space"""
    data = request.get_json()
    row = data.get('row', 0)
    col = data.get('col', 0)
    space_type = data.get('space_type')
    
    nearest_space = parking_manager.find_nearest_available_space(row, col, space_type)
    
    if nearest_space:
        return jsonify({
            'success': True, 
            'space': nearest_space,
            'message': f'Nearest space found: {nearest_space["id"]}'
        })
    else:
        return jsonify({
            'success': False, 
            'space': None,
            'message': 'No available space found'
        })

@app.route('/api/recommendations')
def get_recommendations():
    """Get optimization recommendations"""
    recommendations = parking_manager.get_optimization_recommendations()
    return jsonify({'recommendations': recommendations})

if __name__ == '__main__':
    app.run(debug=True, port=5000)