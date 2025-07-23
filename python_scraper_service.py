from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import sys
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
SCRAPER_SCRIPT = "scrape_santacruz_events.py"
PYTHON_PATH = sys.executable  # Use the current Python interpreter

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Python Scraper Service"
    })

@app.route('/scrape', methods=['POST'])
def trigger_scraping():
    """Trigger the Santa Cruz events scraping"""
    try:
        logger.info("🚀 Received scraping request")
        
        # Check if scraper script exists
        if not os.path.exists(SCRAPER_SCRIPT):
            return jsonify({
                "success": False,
                "error": f"Scraper script not found: {SCRAPER_SCRIPT}",
                "timestamp": datetime.now().isoformat()
            }), 404
        
        # Run the scraper script
        logger.info("📜 Running scraper script...")
        result = subprocess.run(
            [PYTHON_PATH, SCRAPER_SCRIPT, "--service"],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode != 0:
            logger.error(f"❌ Scraper failed with return code: {result.returncode}")
            logger.error(f"Error output: {result.stderr}")
            return jsonify({
                "success": False,
                "error": f"Scraper failed: {result.stderr}",
                "return_code": result.returncode,
                "timestamp": datetime.now().isoformat()
            }), 500
        
        # Parse the JSON output from the scraper
        try:
            scraper_output = result.stdout.strip()
            # Find the JSON output (it should be the last line)
            lines = scraper_output.split('\n')
            json_line = None
            for line in reversed(lines):
                if line.strip().startswith('{') and line.strip().endswith('}'):
                    json_line = line.strip()
                    break
            
            if json_line:
                scraper_result = json.loads(json_line)
                logger.info(f"✅ Scraping completed: {scraper_result.get('message', 'Unknown')}")
                return jsonify({
                    "success": True,
                    "data": scraper_result,
                    "timestamp": datetime.now().isoformat()
                })
            else:
                # Fallback: return the raw output
                return jsonify({
                    "success": True,
                    "data": {
                        "message": "Scraping completed",
                        "raw_output": scraper_output
                    },
                    "timestamp": datetime.now().isoformat()
                })
                
        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse scraper output: {e}")
            return jsonify({
                "success": False,
                "error": f"Failed to parse scraper output: {e}",
                "raw_output": result.stdout,
                "timestamp": datetime.now().isoformat()
            }), 500
            
    except subprocess.TimeoutExpired:
        logger.error("❌ Scraper timed out")
        return jsonify({
            "success": False,
            "error": "Scraper timed out after 5 minutes",
            "timestamp": datetime.now().isoformat()
        }), 408
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return jsonify({
            "success": False,
            "error": f"Unexpected error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/scrape/status', methods=['GET'])
def get_scraping_status():
    """Get the status of the last scraping operation"""
    try:
        # Check if CSV file exists (indicates recent scraping)
        csv_file = "santacruz_events.csv"
        if os.path.exists(csv_file):
            # Get file modification time
            mtime = os.path.getmtime(csv_file)
            last_scraped = datetime.fromtimestamp(mtime)
            
            # Count events in CSV
            import pandas as pd
            try:
                df = pd.read_csv(csv_file)
                event_count = len(df)
            except:
                event_count = 0
            
            return jsonify({
                "success": True,
                "data": {
                    "last_scraped": last_scraped.isoformat(),
                    "events_count": event_count,
                    "csv_file": csv_file
                },
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "success": True,
                "data": {
                    "last_scraped": None,
                    "events_count": 0,
                    "csv_file": None
                },
                "timestamp": datetime.now().isoformat()
            })
            
    except Exception as e:
        logger.error(f"❌ Error getting scraping status: {e}")
        return jsonify({
            "success": False,
            "error": f"Error getting scraping status: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/scrape/test', methods=['GET'])
def test_scraping_setup():
    """Test if the scraping environment is properly set up"""
    try:
        # Check required files
        required_files = [SCRAPER_SCRIPT]
        missing_files = [f for f in required_files if not os.path.exists(f)]
        
        # Check required environment variables
        required_env_vars = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
        missing_env_vars = [var for var in required_env_vars if not os.environ.get(var)]
        
        # Check Python dependencies
        missing_deps = []
        try:
            import supabase
        except ImportError:
            missing_deps.append("supabase")
        
        try:
            import selenium
        except ImportError:
            missing_deps.append("selenium")
        
        try:
            import pandas
        except ImportError:
            missing_deps.append("pandas")
        
        try:
            import bs4
        except ImportError:
            missing_deps.append("beautifulsoup4")
        
        # Check Chrome/ChromeDriver
        chrome_available = False
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            options = Options()
            options.add_argument("--headless")
            driver = webdriver.Chrome(options=options)
            driver.quit()
            chrome_available = True
        except Exception as e:
            chrome_available = False
            chrome_error = str(e)
        
        return jsonify({
            "success": True,
            "data": {
                "files": {
                    "missing": missing_files,
                    "all_present": len(missing_files) == 0
                },
                "environment": {
                    "missing_vars": missing_env_vars,
                    "all_set": len(missing_env_vars) == 0
                },
                "dependencies": {
                    "missing": missing_deps,
                    "all_installed": len(missing_deps) == 0
                },
                "chrome": {
                    "available": chrome_available,
                    "error": chrome_error if not chrome_available else None
                },
                "ready": len(missing_files) == 0 and len(missing_env_vars) == 0 and len(missing_deps) == 0 and chrome_available
            },
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"❌ Error testing scraping setup: {e}")
        return jsonify({
            "success": False,
            "error": f"Error testing scraping setup: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Get port from environment or default to 5001
    port = int(os.environ.get('PORT', 5001))
    
    logger.info(f"🚀 Starting Python Scraper Service on port {port}")
    logger.info(f"📜 Scraper script: {SCRAPER_SCRIPT}")
    logger.info(f"🐍 Python path: {PYTHON_PATH}")
    
    app.run(host='0.0.0.0', port=port, debug=True) 