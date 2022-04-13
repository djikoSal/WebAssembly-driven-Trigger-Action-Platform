// Insert some imports here that the filter code needs
const currentHour = require("../services/API").currentHour
const currentDay = require("../services/API").currentDay
const skipAction = require("../services/API").skipAction
const consoleLog = require("../services/API").consoleLog
function filterCode() {
    var hour = currentHour();
    var day = currentDay();
    if (hour <= 11 && hour >= 12) {
        skipAction(); // lunch
    }
    else if (day == 0 || day == 6) {
        skipAction(); // I'm not working
    }
    else {
        consoleLog("Not skipping (for debugging)");
    }
}

exports.filterCode = filterCode
