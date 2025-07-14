#!/usr/bin/env python3
"""
Fix the import issue by replacing parking_manager.py with a clean version
"""
import os
import shutil

def fix_import_issue():
    print("🔧 FIXING PARKING MANAGER IMPORT ISSUE")
    print("=" * 50)
    
    # Backup original file
    if os.path.exists('parking_manager.py'):
        shutil.copy('parking_manager.py', 'parking_manager_backup.py')
        print("✅ Backed up original parking_manager.py")
    
    # Replace with clean version
    if os.path.exists('parking_manager_clean.py'):
        shutil.copy('parking_manager_clean.py', 'parking_manager.py')
        print("✅ Replaced with clean parking_manager.py")
    
    # Remove cache
    if os.path.exists('__pycache__'):
        shutil.rmtree('__pycache__')
        print("✅ Cleared Python cache")
    
    # Test import
    try:
        from parking_manager import ParkingManager
        print("✅ Import test successful!")
        
        # Test instantiation
        pm = ParkingManager(rows=2, cols=2)
        print("✅ ParkingManager works correctly!")
        print(f"   Created {pm.rows}x{pm.cols} parking lot")
        print(f"   Total spaces: {len(pm.spaces)}")
        
        return True
    except Exception as e:
        print(f"❌ Import still fails: {e}")
        return False

if __name__ == "__main__":
    success = fix_import_issue()
    print("\n" + "=" * 50)
    if success:
        print("🎉 Import issue fixed! You can now run: python app.py")
    else:
        print("❌ Issue persists. Run test_import.py for more details.")