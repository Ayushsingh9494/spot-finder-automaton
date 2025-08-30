
#!/usr/bin/env python3
"""
Smart Parking Management System Server
Run this file to start the parking management system
"""

import os
import sys
from app import app

if __name__ == '__main__':
    try:
        print("=" * 60)
        print("🚗 SMART PARKING MANAGEMENT SYSTEM 🚗")
        print("=" * 60)
        print(f"✅ Server starting...")
        print(f"✅ Flask app initialized successfully")
        print(f"✅ Parking manager ready (8x12 grid)")
        print("-" * 60)
        print(f"🌐 Open your browser and go to:")
        print(f"   http://localhost:5000")
        print(f"   http://127.0.0.1:5000")
        print("-" * 60)
        print(f"🔧 Health check available at: http://localhost:5000/health")
        print(f"📊 API endpoints ready")
        print("=" * 60)
        print("Press Ctrl+C to stop the server")
        print("=" * 60)
        
        app.run(debug=True, port=5000, host='0.0.0.0')
        
    except ImportError as e:
        print(f"❌ Error: Missing required module - {e}")
        print("💡 Please run: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)
