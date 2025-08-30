from flask import Flask, render_template, request, jsonify
from parking_manager import ParkingManager
import json
import random

app = Flask(__name__)

# Initialize parking manager with a default lot
parking_manager = ParkingManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/parking-lot', methods=['GET'])
def get_parking_lot():
    """Get the current parking lot state"""
    return jsonify(parking_manager.get_lot_data())

@app.route('/api/reserve-space', methods=['POST'])
def reserve_space():
    """Reserve a parking space"""
    data = request.get_json()
    space_id = data.get('space_id')
    reserved_by = data.get('reserved_by', 'Anonymous')
    
    success = parking_manager.reserve_space(space_id, reserved_by)
    
    if success:
        return jsonify({
            'success': True,
            'message': f'Space {space_id} reserved successfully',
            'lot_data': parking_manager.get_lot_data()
        })
    else:
        return jsonify({
            'success': False,
            'message': f'Failed to reserve space {space_id}'
        }), 400

@app.route('/api/release-reservation', methods=['POST'])
def release_reservation():
    """Release a parking space reservation"""
    data = request.get_json()
    space_id = data.get('space_id')
    
    success = parking_manager.release_reservation(space_id)
    
    if success:
        return jsonify({
            'success': True,
            'message': f'Reservation for space {space_id} released',
            'lot_data': parking_manager.get_lot_data()
        })
    else:
        return jsonify({
            'success': False,
            'message': f'Failed to release reservation for space {space_id}'
        }), 400

@app.route('/api/toggle-occupancy', methods=['POST'])
def toggle_occupancy():
    """Toggle the occupancy status of a parking space"""
    data = request.get_json()
    space_id = data.get('space_id')
    is_occupied = data.get('is_occupied')
    
    success = parking_manager.update_space_occupancy(space_id, is_occupied)
    
    if success:
        status = 'occupied' if is_occupied else 'available'
        return jsonify({
            'success': True,
            'message': f'Space {space_id} marked as {status}',
            'lot_data': parking_manager.get_lot_data()
        })
    else:
        return jsonify({
            'success': False,
            'message': f'Failed to update space {space_id}'
        }), 400

@app.route('/api/find-nearest', methods=['POST'])
def find_nearest_space():
    """Find the nearest available parking space"""
    data = request.get_json()
    start_row = data.get('start_row', 0)
    start_col = data.get('start_col', 0)
    space_type = data.get('space_type', '')
    
    request_criteria = {}
    if space_type:
        request_criteria['space_type'] = space_type
    
    nearest_space = parking_manager.find_nearest_available_space(
        start_row, start_col, request_criteria
    )
    
    if nearest_space:
        return jsonify({
            'success': True,
            'message': f'Nearest available space found: {nearest_space["id"]}',
            'space': nearest_space,
            'lot_data': parking_manager.get_lot_data()
        })
    else:
        return jsonify({
            'success': False,
            'message': 'No available spaces found matching your criteria'
        }), 404

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """Get parking lot analytics"""
    return jsonify(parking_manager.get_analytics())

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get optimization recommendations"""
    return jsonify({
        'recommendations': parking_manager.get_optimization_recommendations()
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)