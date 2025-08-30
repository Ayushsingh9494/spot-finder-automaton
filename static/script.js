// Global variables
let currentParkingLot = null;
let selectedSpace = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadParkingLot();
    loadAnalytics();
});

// Tab navigation
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked nav tab
    event.target.classList.add('active');
    
    // Load content based on selected tab
    if (tabName === 'analytics') {
        loadAnalytics();
    }
}

// Load parking lot data
async function loadParkingLot() {
    try {
        const response = await fetch('/api/parking-lot');
        const data = await response.json();
        currentParkingLot = data;
        renderParkingGrid(data);
    } catch (error) {
        showMessage('Error loading parking lot data', 'error');
        console.error('Error:', error);
    }
}

// Render parking grid
function renderParkingGrid(lotData) {
    const grid = document.getElementById('parkingGrid');
    grid.innerHTML = '';
    
    // Set grid columns based on lot data
    grid.style.gridTemplateColumns = `repeat(${lotData.cols}, 1fr)`;
    
    // Create parking spaces
    for (let row = 0; row < lotData.rows; row++) {
        for (let col = 0; col < lotData.cols; col++) {
            const spaceId = `${row}-${col}`;
            const spaceData = lotData.spaces[spaceId];
            
            if (spaceData) {
                const spaceElement = createSpaceElement(spaceData, lotData.highlighted_space);
                grid.appendChild(spaceElement);
            }
        }
    }
}

// Create a parking space element
function createSpaceElement(spaceData, highlightedSpace) {
    const space = document.createElement('div');
    space.className = 'parking-space';
    space.id = `space-${spaceData.id}`;
    space.textContent = getSpaceIcon(spaceData.space_type);
    
    // Add status classes
    if (spaceData.id === highlightedSpace) {
        space.classList.add('highlighted');
    } else if (spaceData.is_occupied) {
        space.classList.add('occupied');
    } else if (spaceData.is_reserved) {
        space.classList.add('reserved');
    } else {
        space.classList.add('available');
    }
    
    // Add click handler
    space.addEventListener('click', () => selectSpace(spaceData));
    
    // Add tooltip
    const status = spaceData.is_occupied ? 'Occupied' : 
                  spaceData.is_reserved ? 'Reserved' : 'Available';
    space.title = `Space ${spaceData.id} - ${spaceData.space_type} (${status})`;
    
    return space;
}

// Get icon for space type
function getSpaceIcon(spaceType) {
    switch (spaceType) {
        case 'electric': return '⚡';
        case 'disabled': return '♿';
        case 'compact': return 'C';
        default: return '🚗';
    }
}

// Select a parking space
function selectSpace(spaceData) {
    selectedSpace = spaceData;
    
    // Clear previous selection
    document.querySelectorAll('.parking-space.selected').forEach(space => {
        space.classList.remove('selected');
    });
    
    // Highlight selected space
    const spaceElement = document.getElementById(`space-${spaceData.id}`);
    if (spaceElement) {
        spaceElement.classList.add('selected');
    }
    
    // Update space info panel
    updateSpaceInfoPanel(spaceData);
}

// Update space info panel
function updateSpaceInfoPanel(spaceData) {
    const infoPanel = document.getElementById('selectedSpaceInfo');
    const controlsPanel = document.getElementById('selectedSpaceControls');
    
    const status = spaceData.is_occupied ? 'Occupied' : 
                  spaceData.is_reserved ? 'Reserved' : 'Available';
    
    const statusClass = spaceData.is_occupied ? 'status-occupied' : 
                       spaceData.is_reserved ? 'status-reserved' : 'status-available';
    
    infoPanel.innerHTML = `
        <div class="space-details">
            <div class="detail-item">
                <span class="detail-label">Space ID</span>
                <span class="detail-value">${spaceData.id}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Position</span>
                <span class="detail-value">Row ${spaceData.row}, Col ${spaceData.col}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">${spaceData.space_type}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="detail-value status-badge ${statusClass}">${status}</span>
            </div>
        </div>
        ${spaceData.is_reserved && spaceData.reserved_by ? 
            `<p><strong>Reserved by:</strong> ${spaceData.reserved_by}</p>` : ''}
    `;
    
    // Show/hide controls based on space status
    if (spaceData.is_occupied) {
        controlsPanel.style.display = 'block';
        controlsPanel.innerHTML = `
            <button onclick="markAsAvailable()" class="btn btn-primary">Mark as Available</button>
        `;
    } else if (spaceData.is_reserved) {
        controlsPanel.style.display = 'block';
        controlsPanel.innerHTML = `
            <button onclick="releaseReservation()" class="btn btn-secondary">Release Reservation</button>
            <button onclick="markAsOccupied()" class="btn btn-dark">Mark as Occupied</button>
        `;
    } else {
        controlsPanel.style.display = 'block';
        controlsPanel.innerHTML = `
            <input type="text" id="reservationName" placeholder="Enter your name" class="control-input">
            <button onclick="markAsOccupied()" class="btn btn-dark">Mark as Occupied</button>
            <button onclick="reserveSelectedSpace()" class="btn btn-secondary">Reserve Space</button>
        `;
    }
}

// Reserve selected space
async function reserveSelectedSpace() {
    if (!selectedSpace) {
        showMessage('Please select a space first', 'error');
        return;
    }
    
    const name = document.getElementById('reservationName').value.trim();
    if (!name) {
        showMessage('Please enter your name', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/reserve-space', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                space_id: selectedSpace.id,
                reserved_by: name
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            currentParkingLot = result.lot_data;
            renderParkingGrid(currentParkingLot);
            selectSpace(currentParkingLot.spaces[selectedSpace.id]);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error reserving space', 'error');
        console.error('Error:', error);
    }
}

// Release reservation
async function releaseReservation() {
    if (!selectedSpace) return;
    
    try {
        const response = await fetch('/api/release-reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                space_id: selectedSpace.id
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            currentParkingLot = result.lot_data;
            renderParkingGrid(currentParkingLot);
            selectSpace(currentParkingLot.spaces[selectedSpace.id]);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error releasing reservation', 'error');
        console.error('Error:', error);
    }
}

// Mark space as occupied
async function markAsOccupied() {
    if (!selectedSpace) return;
    
    await toggleOccupancy(true);
}

// Mark space as available
async function markAsAvailable() {
    if (!selectedSpace) return;
    
    await toggleOccupancy(false);
}

// Toggle occupancy status
async function toggleOccupancy(isOccupied) {
    if (!selectedSpace) return;
    
    try {
        const response = await fetch('/api/toggle-occupancy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                space_id: selectedSpace.id,
                is_occupied: isOccupied
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            currentParkingLot = result.lot_data;
            renderParkingGrid(currentParkingLot);
            selectSpace(currentParkingLot.spaces[selectedSpace.id]);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error updating space status', 'error');
        console.error('Error:', error);
    }
}

// Find nearest available space
async function findNearestAvailableSpace() {
    const startRow = parseInt(document.getElementById('startRow').value) || 0;
    const startCol = parseInt(document.getElementById('startCol').value) || 0;
    const spaceType = document.getElementById('preferredType').value;
    
    try {
        const response = await fetch('/api/find-nearest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_row: startRow,
                start_col: startCol,
                space_type: spaceType
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            currentParkingLot = result.lot_data;
            renderParkingGrid(currentParkingLot);
            selectSpace(result.space);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error finding nearest space', 'error');
        console.error('Error:', error);
    }
}

// Load analytics data
async function loadAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const analytics = await response.json();
        renderAnalytics(analytics);
    } catch (error) {
        showMessage('Error loading analytics', 'error');
        console.error('Error:', error);
    }
}

// Render analytics dashboard
function renderAnalytics(analytics) {
    const grid = document.getElementById('analyticsGrid');
    
    grid.innerHTML = `
        <div class="stat-card">
            <h4>Total Spaces</h4>
            <div class="stat-value">${analytics.total_spaces}</div>
        </div>
        <div class="stat-card">
            <h4>Available</h4>
            <div class="stat-value">${analytics.available_spaces}</div>
        </div>
        <div class="stat-card">
            <h4>Occupied</h4>
            <div class="stat-value">${analytics.occupied_spaces}</div>
        </div>
        <div class="stat-card">
            <h4>Reserved</h4>
            <div class="stat-value">${analytics.reserved_spaces}</div>
        </div>
        <div class="stat-card">
            <h4>Occupancy Rate</h4>
            <div class="stat-value">${analytics.occupancy_rate}%</div>
        </div>
    `;
}

// Get optimization recommendations
async function getOptimizationRecommendations() {
    try {
        const response = await fetch('/api/recommendations');
        const result = await response.json();
        
        const recommendationsList = document.getElementById('recommendationsList');
        
        if (result.recommendations && result.recommendations.length > 0) {
            recommendationsList.innerHTML = result.recommendations
                .map(rec => `<div class="recommendation-item">${rec}</div>`)
                .join('');
            
            showMessage(`Found ${result.recommendations.length} optimization recommendations`, 'success');
        } else {
            recommendationsList.innerHTML = '<div class="recommendation-item">No recommendations available at this time.</div>';
        }
    } catch (error) {
        showMessage('Error getting recommendations', 'error');
        console.error('Error:', error);
    }
}

// Show message notification
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    container.appendChild(messageElement);
    
    // Auto-remove message after 4 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 4000);
}

// Utility function to refresh the parking lot
function refreshParkingLot() {
    loadParkingLot();
    loadAnalytics();
}

// Auto-refresh every 30 seconds
setInterval(refreshParkingLot, 30000);