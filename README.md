# 🚗 Smart Parking Management System

An intelligent parking space allocation system built with React and TypeScript, featuring real-time space management, BFS pathfinding algorithms, and comprehensive analytics dashboard.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Features

- **Real-time Parking Grid**: Interactive visual representation of parking spaces with color-coded status indicators
- **Smart Space Management**: Reserve, release, and update occupancy of parking spaces in real-time
- **Intelligent Search Algorithm**: Find nearest available spaces using Breadth-First Search (BFS) graph traversal
- **Analytics Dashboard**: Track occupancy rates, space utilization patterns, and peak hour trends
- **Optimization Engine**: Get AI-powered recommendations for improving space allocation efficiency
- **Space Type Support**: Handle regular, electric, disabled, and compact parking spaces
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile devices

## 🚀 Live Demo

[Add your deployment link here]

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI component library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Algorithms & Data Structures
- **Breadth-First Search (BFS)** - O(V+E) complexity for pathfinding
- **Hash Maps** - O(1) space lookup and updates
- **Adjacency Lists** - Efficient graph representation for parking lot
- **Priority Queues** - Optimization recommendations ranking

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd smart-parking-management
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
bun install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
smart-parking-management/
├── src/
│   ├── components/
│   │   ├── ParkingLotGrid.tsx      # Main parking lot visualization
│   │   ├── ParkingSpaceCard.tsx    # Individual space component
│   │   ├── ParkingAnalytics.tsx    # Analytics dashboard
│   │   ├── ReservationPanel.tsx    # Reservation management
│   │   └── ui/                     # Shadcn UI components
│   ├── hooks/
│   │   └── useParkingManager.ts    # Core parking logic hook
│   ├── types/
│   │   └── parking.ts              # TypeScript type definitions
│   ├── utils/
│   │   ├── parkingAlgorithms.ts    # BFS and optimization logic
│   │   └── parkingLotGenerator.ts  # Parking lot initialization
│   ├── pages/
│   │   └── Index.tsx               # Main application page
│   └── index.css                   # Global styles & design tokens
├── public/                         # Static assets
└── vite.config.ts                  # Vite configuration
```

## 🎯 Key Features Explained

### 1. Intelligent Space Finding (BFS Algorithm)
```typescript
// O(V+E) time complexity using BFS
findNearestAvailableSpace(startRow, startCol, preferences)
```
- Uses graph traversal to find the nearest available space
- Supports filtering by space type (electric, disabled, compact)
- Guarantees shortest path to available space

### 2. Real-time Space Management
- **Hash Map Storage**: O(1) lookup for any parking space
- **Adjacency List**: Efficient neighbor tracking for BFS
- **State Management**: React hooks for real-time UI updates

### 3. Analytics Dashboard
- Occupancy rate tracking
- Peak hours visualization
- Space type distribution
- Utilization trends over time

### 4. Optimization Recommendations
- Analyzes current parking lot usage patterns
- Suggests optimal space type distribution
- Identifies underutilized areas
- Provides actionable insights for efficiency improvements

## 🎮 Usage

### Viewing Parking Lot
- Color-coded spaces: 🟢 Available, 🟡 Reserved, 🔴 Occupied
- Click any space to view details and management options

### Reserving a Space
1. Click on an available (green) space
2. Enter your name in the reservation panel
3. Click "Reserve Space" button

### Finding Nearest Space
1. Enter your current position (row, column)
2. Optionally select space type preference
3. Click "Find Nearest Space"
4. System highlights the optimal space using BFS

### Viewing Analytics
- Navigate to the analytics section
- View real-time occupancy statistics
- Analyze peak usage patterns
- Review space type distribution

### Getting Recommendations
- Click "Get Recommendations" in the optimization panel
- Review AI-generated suggestions
- Implement changes to improve efficiency

## 🔧 Configuration

### Parking Lot Size
Modify in `src/hooks/useParkingManager.ts`:
```typescript
export const useParkingManager = (rows: number = 8, cols: number = 12)
```

### Space Type Distribution
Adjust in `src/utils/parkingLotGenerator.ts`:
```typescript
const spaceTypes = ['regular', 'electric', 'disabled', 'compact'];
```

## 🧪 Building for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The production-ready files will be in the `dist/` directory.

## 📊 Algorithm Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Space Lookup | O(1) | O(1) |
| Reserve Space | O(1) | O(1) |
| Find Nearest | O(V+E) | O(V) |
| Update Occupancy | O(1) | O(1) |
| Get Analytics | O(N) | O(1) |

Where:
- V = Number of parking spaces (vertices)
- E = Number of adjacencies (edges)
- N = Total spaces

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

[Your Name]
- GitHub: [@yourusername]
- LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- Inspired by real-world parking management challenges

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

⭐ Star this repository if you find it helpful!
