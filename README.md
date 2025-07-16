# Kendo Grading Clock
Beta Implementation of what a grading clock for the BKA website could look like. 
Currently only does Kendo

I am not affiliated or in any way linked to the British Kendo Association. This is a hobby project done 'for fun' 

# Roadmap / Issues
Webscraping to be improved to get the Exam levels (Grading Levels of events) 
Past Events to be filtered out of event list

# Release Notes; 

## Version 0.1.3 - 2025-07-16
- Moved Scraping Script into main repo
- Updated Scraping Script to check webpages for events to get the 'Grading Level' for each event (NOTE: This is only working if the format is Exam : GRADE - GRADE). This works for the BKA Summer Seminar as an example (2025-07-31). This needs to be improved as the format is not always consistant across event pages 
- Setup a github action for this to refresh daily 
- Minor formatting changes and title changes; 
  - BKA Grading Requirements Link updated 
  - Consistancy in grade names (using Shodan - format rather than 1st, 2nd ect.) 
  - Capitalisation on Next Grade Eligibility
  - Capitalisation on Grading Level
  - Added an 'Unknown / TBC' option in the Grading Level
  - Updated Version Number

## Version 0.1.2
- Fixed grading offset logic
- Added an easter egg for true Kendo Masters
- Updated Grading Requirements with the link to the BKA Website 


## Version 0.1.1
- Web scraping deployed (Local solution for the moment) All Kendo Events for the next 30 years loaded - Or at least the ones that have been added to the calendar

## Version 0.1.0
 - Beta release, core logic is working, events need to be manually added to the 'grading-events.csv'. These are taken from the BKA Website.
 - This will be updated to web-scape (if possible) in the future or load from an 'ical' file if they offer it - I genuinely don't know
