// Hosted as a google apps script to pull the hangout link from
// the next scheduled standup for the recurring meeting with 
// the event ID defined. 
// 
// Scheduled to run every day at 1 AM
const UPDATE_URL = 'https://gathertown-scheduler.inkr.workers.dev'
const EVENT_ID = '<STANDUP_EVENT_ID_GOES_HERE>'
const API_KEY = '<SCHEDULER_API_KEY GOES HERE>'
function getStandup(){
  var pageToken;
  do {
    meetingLink = Calendar.Events.get("primary", EVENT_ID).conferenceData.entryPoints[0].uri.split('/').pop()
    UrlFetchApp.fetch(UPDATE_URL, {method: "post", payload: meetingLink, headers: {'content-type': 'text/plain', 'x-schedule-key' : API_KEY}})
  } while (pageToken);
}