
# Smart Parking Management System - Complete Implementation

This is a comprehensive parking management system that uses hash maps and graph algorithms for intelligent space allocation.

## Project Structure

```
parking-management-system/
├── app.py                          # Flask backend server
├── parking_manager.py              # Core parking management logic
├── run_server.py                  # Server startup script
├── requirements.txt               # Python dependencies
├── templates/
│   └── index.html                 # HTML frontend template
├── static/
│   ├── style.css                  # CSS styling
│   └── script.js                  # JavaScript frontend logic
└── src/                           # React frontend (alternative)
    ├── components/                # React components
    ├── hooks/                     # React hooks
    ├── types/                     # TypeScript types
    └── utils/                     # Utility functions
```

## Features

### Backend (Flask + Python)
- **ParkingManager Class**: Core business logic using hash maps for O(1) space lookups
- **Graph Algorithms**: BFS for finding nearest available spaces
- **REST API**: Complete API for parking operations
- **Analytics**: Real-time occupancy tracking and optimization recommendations
- **Space Types**: Support for regular, disabled, electric, and compact spaces

### Frontend Options

#### 1. HTML/CSS/JavaScript (Ready to use)
- Static files in `templates/` and `static/`
- Real-time updates with fetch API
- Interactive parking grid visualization
- Responsive design with Tailwind-like styling

#### 2. React/TypeScript (Advanced)
- Modern React components with TypeScript
- Shadcn/ui component library
- Real-time data with React Query
- Advanced analytics with Recharts

## Quick Start

### Option 1: Run Flask Server with HTML Frontend

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Server**
   ```bash
   python run_server.py
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5000`
   - The HTML frontend will load automatically

### Option 2: Run React Frontend

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start React Development Server**
   ```bash
   npm run dev
   ```

3. **Start Flask Backend** (separate terminal)
   ```bash
   python run_server.py
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /api/parking-lot` - Get parking lot state
- `GET /api/analytics` - Get analytics data
- `POST /api/reserve-space` - Reserve a space
- `POST /api/release-reservation` - Release reservation
- `POST /api/update-occupancy` - Update space occupancy
- `POST /api/find-nearest` - Find nearest available space
- `GET /api/recommendations` - Get optimization recommendations

## Core Algorithms

### 1. Hash Map Implementation
- **Space Storage**: O(1) lookup time for any parking space
- **Key Format**: `"row-col"` (e.g., "3-7")
- **Value**: ParkingSpace object with all properties

### 2. BFS Pathfinding
- **Purpose**: Find nearest available space from any starting point
- **Implementation**: Breadth-first search on parking lot graph
- **Time Complexity**: O(V + E) where V = spaces, E = adjacencies

### 3. Space Allocation Optimization
- **Occupancy Analysis**: Real-time calculation of usage patterns
- **Load Balancing**: Recommendations for even distribution
- **Type-based Filtering**: Smart allocation based on space types

## Usage Examples

### Reserve a Space
```javascript
// Frontend JavaScript
await fetch('/api/reserve-space', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        space_id: '3-7',
        reserved_by: 'John Doe'
    })
});
```

### Find Nearest Space
```javascript
await fetch('/api/find-nearest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        row: 0,
        col: 0,
        space_type: 'electric'
    })
});
```

## Development

### Adding New Features
1. **Backend**: Extend `ParkingManager` class in `parking_manager.py`
2. **API**: Add new routes in `app.py`
3. **Frontend**: Update components in `src/components/`

### Testing
- Backend: `python -m pytest tests/`
- Frontend: `npm test`

## Deployment

### Production Setup
1. Use a production WSGI server (e.g., Gunicorn)
2. Set up a reverse proxy (e.g., Nginx)
3. Configure environment variables
4. Set up database for persistent storage

### Environment Variables
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
