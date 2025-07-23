#!/usr/bin/env python3
"""
Setup script for Python Scraper Service
This script helps set up the Python environment for the Santa Cruz events scraper
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing Python dependencies...")
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found")
        return False
    
    # Install dependencies
    success = run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing dependencies from requirements.txt"
    )
    
    if not success:
        print("❌ Failed to install dependencies")
        return False
    
    return True

def check_chrome_installation():
    """Check if Chrome/Chromium is installed"""
    print("\n🌐 Checking Chrome installation...")
    
    # Common Chrome paths
    chrome_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
        "/usr/bin/google-chrome",  # Linux
        "/usr/bin/chromium-browser",  # Linux Chromium
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",  # Windows
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",  # Windows
    ]
    
    chrome_found = False
    for path in chrome_paths:
        if os.path.exists(path):
            print(f"✅ Chrome found at: {path}")
            chrome_found = True
            break
    
    if not chrome_found:
        print("⚠️  Chrome not found in common locations")
        print("   Please install Google Chrome or Chromium")
        print("   Download from: https://www.google.com/chrome/")
        return False
    
    return True

def check_environment_variables():
    """Check if required environment variables are set"""
    print("\n🔑 Checking environment variables...")
    
    required_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
        else:
            print(f"✅ {var} is set")
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("\n📝 Please set these variables in your .env file:")
        print("   SUPABASE_URL=your_supabase_url")
        print("   SUPABASE_SERVICE_KEY=your_service_role_key")
        return False
    
    return True

def test_scraper_script():
    """Test if the scraper script can be imported"""
    print("\n🧪 Testing scraper script...")
    
    if not os.path.exists("scrape_santacruz_events.py"):
        print("❌ scrape_santacruz_events.py not found")
        return False
    
    try:
        # Try to import the scraper module
        import importlib.util
        spec = importlib.util.spec_from_file_location("scraper", "scrape_santacruz_events.py")
        scraper_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(scraper_module)
        print("✅ Scraper script can be imported successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to import scraper script: {e}")
        return False

def create_env_template():
    """Create a template .env file if it doesn't exist"""
    env_file = Path(".env")
    if not env_file.exists():
        print("\n📝 Creating .env template...")
        env_content = """# Supabase Configuration
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Python Scraper Service Configuration
PORT=5001
"""
        with open(env_file, "w") as f:
            f.write(env_content)
        print("✅ Created .env template")
        print("   Please edit .env and add your Supabase credentials")
    else:
        print("✅ .env file already exists")

def main():
    """Main setup function"""
    print("🚀 Python Scraper Service Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Create .env template
    create_env_template()
    
    # Install dependencies
    if not install_dependencies():
        return False
    
    # Check Chrome installation
    if not check_chrome_installation():
        print("⚠️  Chrome installation check failed, but setup can continue")
    
    # Check environment variables
    if not check_environment_variables():
        print("⚠️  Environment variables not set, but setup can continue")
    
    # Test scraper script
    if not test_scraper_script():
        return False
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your Supabase credentials")
    print("2. Start the Python scraper service:")
    print("   python python_scraper_service.py")
    print("3. The service will be available at http://localhost:5001")
    print("4. Test the service: http://localhost:5001/health")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 