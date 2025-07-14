#!/usr/bin/env python3
"""
Diagnostic script to test parking_manager import
"""
import sys
import os
import traceback

def test_import():
    print("🔍 PARKING MANAGER IMPORT DIAGNOSTIC")
    print("=" * 50)
    
    # Check file existence
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📄 parking_manager.py exists: {os.path.exists('parking_manager.py')}")
    
    if os.path.exists('parking_manager.py'):
        print(f"📏 File size: {os.path.getsize('parking_manager.py')} bytes")
    
    # Check Python path
    print(f"🐍 Python executable: {sys.executable}")
    print(f"🐍 Python version: {sys.version}")
    
    # Try to read the file
    try:
        with open('parking_manager.py', 'r', encoding='utf-8') as f:
            content = f.read()
            print(f"✅ File readable, {len(content)} characters")
            
            # Check for syntax issues
            try:
                compile(content, 'parking_manager.py', 'exec')
                print("✅ Syntax check passed")
            except SyntaxError as e:
                print(f"❌ Syntax error found: {e}")
                print(f"   Line {e.lineno}: {e.text}")
                return False
                
    except Exception as e:
        print(f"❌ Cannot read file: {e}")
        return False
    
    # Try import
    print("\n🚀 Attempting import...")
    try:
        from parking_manager import ParkingManager
        print("✅ Import successful!")
        
        # Test instantiation
        pm = ParkingManager(rows=2, cols=2)
        print("✅ ParkingManager instantiation successful!")
        return True
        
    except Exception as e:
        print(f"❌ Import failed: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_import()
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests passed! The import should work.")
    else:
        print("❌ Import test failed. Check the errors above.")
    sys.exit(0 if success else 1)