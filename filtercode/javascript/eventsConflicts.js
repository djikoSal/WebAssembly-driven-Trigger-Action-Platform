// Insert some imports here that the filter code needs
const printNumber = require("../services/API").printNumber
const upcomingClubEvents = require("../services/API").upcomingClubEvents
const upcomingMyEvents = require("../services/API").upcomingMyEvents
function filterCode() {
    var clubEvents = upcomingClubEvents();
    var myEvents = upcomingMyEvents();
    var conflictMs = 0;
    for (var i = 0; i < clubEvents.length; i = i + 2) {
        var clubDtStart = Date.parse(clubEvents[i]);
        var clubDtEnd = Date.parse(clubEvents[i + 1]);
        for (var j = 0; j < myEvents.length; j = j + 2) {
            var dtStart = Date.parse(myEvents[j]);
            var dtEnd = Date.parse(myEvents[j + 1]);
            if (clubDtStart < dtStart && clubDtEnd > dtStart) {
                conflictMs += (dtEnd - dtStart) - (clubDtEnd - dtStart);
            }
            else if (dtStart < clubDtStart && dtEnd > clubDtStart) {
                conflictMs += (clubDtEnd - clubDtStart) - (dtEnd - clubDtStart);
            }
            else if (dtStart < clubDtStart && clubDtEnd < dtEnd) {
                conflictMs += (clubDtEnd - clubDtStart);
            }
            else if (clubDtStart < dtStart && dtEnd < clubDtEnd) {
                conflictMs += (dtEnd - dtStart);
            }
        }
    }
    var conflictHours = conflictMs / (60 * 60 * 1000);
    printNumber(conflictHours);
}

exports.filterCode = filterCode
