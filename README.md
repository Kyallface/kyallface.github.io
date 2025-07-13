# Kendo Grading Clock
I don't like that the BKA website has mentions of a grading clock that doesn't exist, so I did it myself. 
Currently only does Kendo and needs to be manually updated (Although I can scrape the calendar (Not included in the Gitrepo))

I am not affiliated or in any way linked to the British Kendo Association. This is a hobby project done 'for fun' 

# Roadmap / Issues
Webscraping to be deployed as a GitHub action to update at a regular interval 
Webscraping to be improved to get the Exam levels (Grading Levels of events) 
Past Events to be filtered out of event list

# Release Notes; 

## Version 0.1.1
Web scraping deployed (Local solution for the moment) All Kendo Events for the next 30 years loaded - Or at least the ones that have been added to the calendar

## Version 0.1.0
Beta release, core logic is working, events need to be manually added to the 'grading-events.csv'. These are taken from the BKA Website.
This will be updated to web-scape (if possible) in the future or load from an 'ical' file if they offer it - I genuinely don't know