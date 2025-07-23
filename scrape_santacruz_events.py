import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd
from datetime import datetime
import json
import sys

# Load environment variables
load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")  # This should be the SERVICE_ROLE_KEY, not ANON_KEY
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in the environment or .env file.")

# Create Supabase client with service role key to bypass RLS
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test database connection
try:
    test_response = supabase.table("Events").select("title").limit(1).execute()
    print("Database connection successful")
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup, Tag
import time

BASE_URL = "https://www.cityofsantacruz.com"
EVENTS_URL = BASE_URL + "/community/special-events"

def scrape_santacruz_events():
    events = []

    # Set up Selenium
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    driver.get(EVENTS_URL)

    time.sleep(3)

    # Debug: Save page source to file for inspection
    with open('page_source.html', 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
    print("Page source saved to page_source.html for inspection")

    soup = BeautifulSoup(driver.page_source, "html.parser")

    table = soup.find("table", class_="front_end_widget")
    if isinstance(table, Tag):
        tbody = table.find("tbody") if isinstance(table, Tag) else None
        if isinstance(tbody, Tag):
            rows = tbody.find_all("tr")
        else:
            rows = []
    else:
        rows = []

    if table:
        for row in rows:
            if not isinstance(row, Tag):
                continue
            tds = row.find_all("td") if isinstance(row, Tag) else []
            if len(tds) < 3:
                continue
            # Title (first column)
            title_cell = tds[0] if len(tds) > 0 else None
            if not isinstance(title_cell, Tag):
                continue
            title_link = title_cell.find("a")
            if isinstance(title_link, Tag):
                title_span = title_link.find("span", attrs={"itemprop": "summary"})
                title = title_span.get_text(strip=True) if isinstance(title_span, Tag) else ""
                event_url = title_link.get("href")
                if event_url and isinstance(event_url, str) and not event_url.startswith("http"):
                    event_url = BASE_URL + str(event_url)
                elif not isinstance(event_url, str):
                    event_url = None
            else:
                title = title_cell.get_text(strip=True)
                event_url = None
            # Date/Time (second column) - extract datetime attributes
            datetime_cell = tds[1] if len(tds) > 1 else None
            start_time, end_time = None, None
            if isinstance(datetime_cell, Tag):
                time_tags = datetime_cell.find_all("time")
                for time_tag in time_tags:
                    if isinstance(time_tag, Tag):
                        datetime_attr = time_tag.get('datetime')
                        itemprop = time_tag.get('itemprop')
                        if itemprop == 'startDate' and datetime_attr:
                            start_time = datetime_attr
                        elif itemprop == 'endDate' and datetime_attr:
                            end_time = datetime_attr
            # Default values
            location = ""
            description = ""
            date_display = ""  # Human-readable date/time
            # If event_url exists, visit the detail page and extract location/description
            if event_url and isinstance(event_url, str):
                try:
                    driver.get(event_url)
                    time.sleep(1.5)  # Be polite to the server
                    detail_soup = BeautifulSoup(driver.page_source, "html.parser")
                    # Date/Time display text
                    date_display = ""
                    list_items = detail_soup.find_all("li")
                    for item in list_items:
                        if isinstance(item, Tag):
                            label = item.find("span", class_="detail-list-label")
                            if isinstance(label, Tag) and "Date:" in label.get_text():
                                value = item.find("span", class_="detail-list-value")
                                if isinstance(value, Tag):
                                    full_date_text = value.get_text(strip=True)
                                    # Extract only the date portion (MM/DD/YYYY)
                                    import re
                                    date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', full_date_text)
                                    if date_match:
                                        date_display = date_match.group(1)
                                        
                                        # Parse start and end times from the full text
                                        # Look for time patterns like "1:00 PM - 5:00 PM"
                                        time_range_match = re.search(r'(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)', full_date_text)
                                        if time_range_match:
                                            start_time_str = time_range_match.group(1)
                                            end_time_str = time_range_match.group(2)
                                            
                                            # Convert to ISO datetime format
                                            from datetime import datetime
                                            try:
                                                # Parse the date
                                                date_obj = datetime.strptime(date_display, "%m/%d/%Y")
                                                
                                                # Parse start time
                                                start_time_obj = datetime.strptime(f"{date_display} {start_time_str}", "%m/%d/%Y %I:%M %p")
                                                start_time = start_time_obj.strftime("%Y-%m-%dT%H:%M:%S+00:00")
                                                
                                                # Parse end time
                                                end_time_obj = datetime.strptime(f"{date_display} {end_time_str}", "%m/%d/%Y %I:%M %p")
                                                end_time = end_time_obj.strftime("%Y-%m-%dT%H:%M:%S+00:00")
                                                
                                                # Override the start_time and end_time from the main table
                                                # since we now have more accurate times from the detail page
                                            except Exception as e:
                                                print(f"Failed to parse time for {title}: {e}")
                                                # Keep the original start_time and end_time if parsing fails
                                        else:
                                            date_display = full_date_text  # Fallback to full text if no date pattern found
                                    break
                    # Location
                    location_span = detail_soup.find("span", attrs={"itemprop": "location"})
                    if isinstance(location_span, Tag):
                        name = location_span.find("span", attrs={"itemprop": "name"}) if isinstance(location_span, Tag) else None
                        address = location_span.find("span", attrs={"itemprop": "address"}) if isinstance(location_span, Tag) else None
                        name_text = name.get_text(strip=True) if isinstance(name, Tag) else ''
                        if isinstance(address, Tag):
                            locality = address.find("span", attrs={"itemprop": "locality"})
                            region = address.find("span", attrs={"itemprop": "region"})
                            postal = address.get_text(strip=True) if isinstance(address, Tag) else ''
                            locality_text = (locality.get_text(strip=True) + ", ") if isinstance(locality, Tag) else ''
                            region_text = (region.get_text(strip=True) + " ") if isinstance(region, Tag) else ''
                            postal_text = postal.replace(locality_text, '').replace(region_text, '') if postal else ''
                            address_text = f"{locality_text}{region_text}{postal_text}".strip()
                        else:
                            address_text = ''
                        location = f"{name_text}, {address_text}".strip(', ')
                    # Description
                    desc_span = detail_soup.find("span", attrs={"itemprop": "description"})
                    if isinstance(desc_span, Tag):
                        description = desc_span.get_text(separator=" ", strip=True)
                except Exception as e:
                    print(f"Failed to scrape detail page for {title}: {e}")
                    location = ""
                    description = ""
                    date_display = ""
            events.append({
                "Title": title,
                "Date": date_display,  # Now populated with human-readable date/time
                "Location": location,
                "Description": description,
                "start_time": start_time,
                "end_time": end_time,
            })
    else:
        print("Could not find events table.")

    driver.quit()
    return events

def save_to_csv(events, filename='santacruz_events.csv'):
    """Save events to CSV file"""
    if events:
        df = pd.DataFrame(events)
        df.to_csv(filename, index=False)
        print(f"Saved {len(events)} events to {filename}")
        return True
    else:
        print("No events found. Adjust selectors in the script as needed.")
        return False

def insert_to_database(events):
    """Insert events into Supabase database"""
    print("\nInserting events into Supabase database...")
    inserted_count = 0
    failed_count = 0
    
    for event in events:
        event_data = {
            "title": event.get("Title"),
            "description": event.get("Description"),
            "location": event.get("Location"),
            "start_time": event.get("start_time"),
            "end_time": event.get("end_time"),
            "event_type": "campus",
            "host_id": None
        }
        
        # Debug: Check for null values
        null_fields = [k for k, v in event_data.items() if v is None or v == ""]
        if null_fields:
            print(f"Warning: Null/empty fields for {event_data['title']}: {null_fields}")
        
        try:
            response = supabase.table("Events").insert(event_data).execute()
            print(f"✓ Inserted event: {event_data['title']}")
            inserted_count += 1
        except Exception as e:
            print(f"✗ Failed to insert event '{event_data['title']}': {e}")
            failed_count += 1
            # Check if it's an RLS policy violation
            if "row-level security policy" in str(e):
                print("  → RLS Policy Violation: Check that you're using the SERVICE_ROLE_KEY")
            # Print more details for debugging
            print(f"  → Event data: {event_data}")
    
    return {
        "inserted": inserted_count,
        "failed": failed_count,
        "total": len(events)
    }

def main():
    """Main function to run the scraper"""
    print("🚀 Starting Santa Cruz Events Scraper...")
    
    # Step 1: Scrape events
    events = scrape_santacruz_events()
    
    if not events:
        print("No events found. Exiting.")
        return {"success": False, "message": "No events found", "data": []}
    
    # Step 2: Save to CSV for validation
    csv_saved = save_to_csv(events)
    
    # Step 3: Insert into database
    db_result = insert_to_database(events)
    
    result = {
        "success": True,
        "message": f"Scraped {len(events)} events, inserted {db_result['inserted']}, failed {db_result['failed']}",
        "data": {
            "events_count": len(events),
            "inserted": db_result['inserted'],
            "failed": db_result['failed'],
            "events": events
        }
    }
    
    print(f"\n✅ Scraping complete: {result['message']}")
    return result

if __name__ == "__main__":
    # Check if running as a service (called from React)
    if len(sys.argv) > 1 and sys.argv[1] == "--service":
        # Return JSON output for service calls
        result = main()
        print(json.dumps(result))
    else:
        # Run normally with console output
        main() 