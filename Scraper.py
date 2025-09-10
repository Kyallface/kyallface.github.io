import requests
import json
import csv
import re
from bs4 import BeautifulSoup
from time import sleep

# API endpoint and parameters
url = "https://www.britishkendoassociation.com/wp-admin/admin-ajax.php"
params = {
    "action": "eventorganiser-fullcal",
    "start": "2025-10-01",
    "end": "2050-08-04",
    "timeformat": "g:i a"
}

# Keywords that suggest the event includes grading
grading_keywords = ["grading", "shinsa", "dan examination"]

# Output file names
csv_file = "bka_grading_events.csv"
raw_json_file = "bka_raw_events.json"


def get_max_exam_level(event_url: str) -> str:
    """
    Visits the event page and extracts the highest exam level.
    Looks for text like: "Exam: Ikkyu – Godan"
    Returns the second value, defaulting to "godan" if not found.
    """
    try:
        res = requests.get(event_url, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        # Search for "Exam: Something – Something"
        text = soup.get_text(separator=" ", strip=True)
        def extract_max_grade(html_text):
            match = re.search(r"Exam:\s*([A-Za-z0-9]+)\s*[\u2013-]\s*([A-Za-z0-9]+)", html_text, re.IGNORECASE)
            if match:
                max_level = match.group(2).strip()
                return max_level
            return "Unknown / TBC"

        return extract_max_grade(text)
    except Exception as e:
        print(f"⚠️ Could not fetch exam level for {event_url}: {e}")
        return "Unknown / TBD"


try:
    # Get data
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    # Save RAW JSON
    with open(raw_json_file, "w", encoding="utf-8") as raw_out:
        json.dump(data, raw_out, indent=2)
    print(f"📦 Raw JSON saved to {raw_json_file}")

    # Filter grading events
    grading_events = []
    for event in data:
        title = event.get("title", "")
        description = event.get("description", "").lower()
        start_date = event.get("start", "")
        event_url = event.get("url", "")
        categories = event.get("category", [])

        if "kendo" in categories:
            if any(keyword in description or keyword in title.lower() for keyword in grading_keywords):
                print(f"🔍 Fetching exam level for: {title}")
                max_grade = get_max_exam_level(event_url)
                grading_events.append({
                    "Event Name": title,
                    "Date": start_date[:10],
                    "Grading Level": max_grade,
                    "URL": event_url
                })
                sleep(1)  # Be polite to the server

    # Save to CSV
    with open(csv_file, "w", newline="", encoding="utf-8") as csv_out:
        fieldnames = ["Event Name", "Date", "Grading Level", "URL"]
        writer = csv.DictWriter(csv_out, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(grading_events)

    print(f"✅ {len(grading_events)} grading events saved to {csv_file}")

except requests.RequestException as e:
    print("❌ Error fetching data:", e)
