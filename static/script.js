// Global variables
let currentParkingLot = null;
let highlightedSpaceId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadParkingLot();
    loadAnalytics();
    loadRecommendations();
});

// API helper function
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`/api${endpoint}`, options);
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showMessage('Network error occurred', 'error');
        return null;
    }
}

// Load parking lot data
async function loadParkingLot() {
    const data = await apiCall('/parking-lot');
    if (data) {
        currentParkingLot = data;
        renderParkingGrid(data.spaces);
    }
}

// Load analytics data
async function loadAnalytics() {
    const data = await apiCall('/analytics');
    if (data) {
        updateAnalyticsDisplay(data);
    }
}

// Load recommendations
async function loadRecommendations() {
    const data = await apiCall('/recommendations');
    if (data) {
        updateRecommendations(data.recommendations);
    }
}

// Render parking grid
function renderParkingGrid(spaces) {
    const grid = document.getElementById('parkingGrid');
    grid.innerHTML = '';
    
    spaces.forEach(space => {
        const spaceElement = document.createElement('div');
        spaceElement.className = 'parking-space';
        spaceElement.id = `space-${space.id}`;
        spaceElement.textContent = space.id;
        
        // Add space state classes
        if (space.isOccupied) {
            spaceElement.classList.add('occupied');
        } else if (space.isReserved) {
            spaceElement.classList.add('reserved');
        } else {
            spaceElement.classList.add('available');
        }
        
        // Add space type classes
        spaceElement.classList.add(space.spaceType);
        
        // Add click handler
        spaceElement.addEventListener('click', () => selectSpace(space));
        
        grid.appendChild(spaceElement);
    });
}

// Select a space
function selectSpace(space) {
    // Update form fields
    document.getElementById('reserveSpaceId').value = space.id;
    document.getElementById('occupancySpaceId').value = space.id;
    
    // Show space info
    showMessage(`Selected space ${space.id} (${space.spaceType})`, 'info');
}

// Find nearest space
async function findNearestSpace() {
    const row = parseInt(document.getElementById('startRow').value);
    const col = parseInt(document.getElementById('startCol').value);
    const spaceType = document.getElementById('spaceType').value;
    
    const data = await apiCall('/find-nearest', 'POST', {
        row: row,
        col: col,
        space_type: spaceType || null
    });
    
    if (data) {
        if (data.success) {
            highlightSpace(data.space.id);
            showMessage(data.message, 'success');
        } else {
            clearHighlight();
            showMessage(data.message, 'error');
        }
    }
}

// Reserve space
async function reserveSpace() {
    const spaceId = document.getElementById('reserveSpaceId').value.trim();
    const reservedBy = document.getElementById('reservedBy').value.trim();
    
    if (!spaceId) {
        showMessage('Please enter a space ID', 'error');
        return;
    }
    
    const data = await apiCall('/reserve-space', 'POST', {
        space_id: spaceId,
        reserved_by: reservedBy || 'User'
    });
    
    if (data) {
        showMessage(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            await refreshData();
        }
    }
}

// Release reservation
async function releaseReservation() {
    const spaceId = document.getElementById('reserveSpaceId').value.trim();
    
    if (!spaceId) {
        showMessage('Please enter a space ID', 'error');
        return;
    }
    
    const data = await apiCall('/release-reservation', 'POST', {
        space_id: spaceId
    });
    
    if (data) {
        showMessage(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            await refreshData();
        }
    }
}

// Toggle occupancy
async function toggleOccupancy(isOccupied) {
    const spaceId = document.getElementById('occupancySpaceId').value.trim();
    
    if (!spaceId) {
        showMessage('Please enter a space ID', 'error');
        return;
    }
    
    const data = await apiCall('/update-occupancy', 'POST', {
        space_id: spaceId,
        is_occupied: isOccupied
    });
    
    if (data) {
        showMessage(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            await refreshData();
        }
    }
}

// Highlight a space
function highlightSpace(spaceId) {
    clearHighlight();
    const spaceElement = document.getElementById(`space-${spaceId}`);
    if (spaceElement) {
        spaceElement.classList.add('highlighted');
        highlightedSpaceId = spaceId;
    }
}

// Clear highlight
function clearHighlight() {
    if (highlightedSpaceId) {
        const spaceElement = document.getElementById(`space-${highlightedSpaceId}`);
        if (spaceElement) {
            spaceElement.classList.remove('highlighted');
        }
        highlightedSpaceId = null;
    }
}

// Update analytics display
function updateAnalyticsDisplay(analytics) {
    document.getElementById('totalSpaces').textContent = analytics.totalSpaces;
    document.getElementById('occupiedSpaces').textContent = analytics.occupiedSpaces;
    document.getElementById('reservedSpaces').textContent = analytics.reservedSpaces;
    document.getElementById('availableSpaces').textContent = analytics.availableSpaces;
    document.getElementById('occupancyRate').textContent = `${analytics.occupancyRate}%`;
}

// Update recommendations
function updateRecommendations(recommendations) {
    const list = document.getElementById('recommendationsList');
    list.innerHTML = '';
    
    recommendations.forEach(recommendation => {
        const li = document.createElement('li');
        li.textContent = recommendation;
        list.appendChild(li);
    });
}

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    container.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Refresh all data
async function refreshData() {
    await Promise.all([
        loadParkingLot(),
        loadAnalytics(),
        loadRecommendations()
    ]);
}

// Auto refresh every 30 seconds
setInterval(refreshData, 30000);