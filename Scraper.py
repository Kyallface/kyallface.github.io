import requests
import json
import csv

# API endpoint and parameters
url = "https://www.britishkendoassociation.com/wp-admin/admin-ajax.php"
params = {
    "action": "eventorganiser-fullcal",
    "start": "2025-06-30",
    "end": "2050-08-04",
    "timeformat": "g:i a"
}

# Keywords that suggest the event includes grading
grading_keywords = ["grading", "shinsa", "dan examination"]

# Output file names
csv_file = "bka_grading_events.csv"
raw_json_file = "bka_raw_events.json"

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
        url = event.get("url", "")
        categories = event.get("category", [])

        if "kendo" in categories:
            if any(keyword in description or keyword in title.lower() for keyword in grading_keywords):
                grading_events.append({
                    "Event Name": title,
                    "Date": start_date[:10],
                    "Grading Level": "godan",  # THIS IS NOT PROVIDED IN THE CALENDAR FILE!
                    "URL": url
                })

    # Save to CSV
    with open(csv_file, "w", newline="", encoding="utf-8") as csv_out:
        fieldnames = ["Event Name", "Date", "Grading Level", "URL"]
        writer = csv.DictWriter(csv_out, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(grading_events)

    print(f"✅ {len(grading_events)} grading events saved to {csv_file}")

except requests.RequestException as e:
    print("❌ Error fetching data:", e)
