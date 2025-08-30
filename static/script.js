
// Global variables
let parkingData = {};
let highlightedSpace = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadParkingData();
    loadAnalytics();
    setInterval(loadParkingData, 5000); // Refresh every 5 seconds
});

// Load parking lot data
async function loadParkingData() {
    try {
        const response = await fetch('/api/parking-lot');
        parkingData = await response.json();
        renderParkingGrid();
        updateSpaceStats();
    } catch (error) {
        console.error('Error loading parking data:', error);
        showMessage('Error loading parking data', 'error');
    }
}

// Load analytics data
async function loadAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const analytics = await response.json();
        updateAnalyticsDashboard(analytics);
    } catch (error) {
        console.error('Error loading analytics:', error);
    }
}

// Render parking grid
function renderParkingGrid() {
    const grid = document.getElementById('parkingGrid');
    grid.innerHTML = '';
    
    const spaces = parkingData.spaces || [];
    
    spaces.forEach(space => {
        const spaceElement = document.createElement('div');
        spaceElement.className = 'parking-space';
        spaceElement.id = `space-${space.id}`;
        spaceElement.textContent = space.id;
        
        // Add status classes
        if (space.isOccupied) {
            spaceElement.classList.add('occupied');
        } else if (space.isReserved) {
            spaceElement.classList.add('reserved');
        } else {
            spaceElement.classList.add('available');
        }
        
        // Add space type classes
        if (space.spaceType !== 'regular') {
            spaceElement.classList.add(space.spaceType);
        }
        
        // Add click handler
        spaceElement.addEventListener('click', () => selectSpace(space.id));
        
        grid.appendChild(spaceElement);
    });
}

// Select a parking space
function selectSpace(spaceId) {
    // Remove previous highlight
    if (highlightedSpace) {
        document.getElementById(`space-${highlightedSpace}`).classList.remove('highlighted');
    }
    
    // Highlight new space
    const spaceElement = document.getElementById(`space-${spaceId}`);
    spaceElement.classList.add('highlighted');
    highlightedSpace = spaceId;
    
    // Update form fields
    document.getElementById('reserveSpaceId').value = spaceId;
    document.getElementById('occupancySpaceId').value = spaceId;
    
    showMessage(`Selected space: ${spaceId}`, 'info');
}

// Update space statistics
function updateSpaceStats() {
    const spaces = parkingData.spaces || [];
    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(s => s.isOccupied).length;
    const reservedSpaces = spaces.filter(s => s.isReserved).length;
    const availableSpaces = totalSpaces - occupiedSpaces - reservedSpaces;
    const occupancyRate = ((occupiedSpaces / totalSpaces) * 100).toFixed(1);
    
    document.getElementById('totalSpaces').textContent = totalSpaces;
    document.getElementById('occupiedSpaces').textContent = occupiedSpaces;
    document.getElementById('reservedSpaces').textContent = reservedSpaces;
    document.getElementById('availableSpaces').textContent = availableSpaces;
    document.getElementById('occupancyRate').textContent = `${occupancyRate}%`;
}

// Update analytics dashboard
function updateAnalyticsDashboard(analytics) {
    loadRecommendations();
}

// Find nearest available space
async function findNearestSpace() {
    const startRow = parseInt(document.getElementById('startRow').value) || 0;
    const startCol = parseInt(document.getElementById('startCol').value) || 0;
    const spaceType = document.getElementById('spaceType').value || null;
    
    try {
        const response = await fetch('/api/find-nearest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                row: startRow,
                col: startCol,
                space_type: spaceType
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.space) {
            selectSpace(result.space.id);
            showMessage(result.message, 'success');
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error finding nearest space:', error);
        showMessage('Error finding nearest space', 'error');
    }
}

// Reserve a parking space
async function reserveSpace() {
    const spaceId = document.getElementById('reserveSpaceId').value;
    const reservedBy = document.getElementById('reservedBy').value;
    
    if (!spaceId || !reservedBy) {
        showMessage('Please enter space ID and name', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/reserve-space', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                space_id: spaceId,
                reserved_by: reservedBy
            })
        });
        
        const result = await response.json();
        showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            loadParkingData();
            document.getElementById('reservedBy').value = '';
        }
    } catch (error) {
        console.error('Error reserving space:', error);
        showMessage('Error reserving space', 'error');
    }
}

// Release reservation
async function releaseReservation() {
    const spaceId = document.getElementById('reserveSpaceId').value;
    
    if (!spaceId) {
        showMessage('Please enter space ID', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/release-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                space_id: spaceId
            })
        });
        
        const result = await response.json();
        showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            loadParkingData();
        }
    } catch (error) {
        console.error('Error releasing reservation:', error);
        showMessage('Error releasing reservation', 'error');
    }
}

// Toggle space occupancy
async function toggleOccupancy(isOccupied) {
    const spaceId = document.getElementById('occupancySpaceId').value;
    
    if (!spaceId) {
        showMessage('Please enter space ID', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/update-occupancy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                space_id: spaceId,
                is_occupied: isOccupied
            })
        });
        
        const result = await response.json();
        showMessage(result.message, result.success ? 'success' : 'error');
        
        if (result.success) {
            loadParkingData();
        }
    } catch (error) {
        console.error('Error updating occupancy:', error);
        showMessage('Error updating occupancy', 'error');
    }
}

// Load optimization recommendations
async function loadRecommendations() {
    try {
        const response = await fetch('/api/recommendations');
        const data = await response.json();
        
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = '';
        
        data.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 3000);
}
