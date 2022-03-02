// Insert some imports here that the filter code needs
sendSMS = require("../services/API").sendSMS
skipAction = require("../services/API").skipAction
currentHour = require("../services/API").currentHour
function filterCode() {
    var y = currentHour();
    var x = 13;
    if (y == x) {
        sendSMS();
    }
    else {
        skipAction();
    }
}

exports.filterCode = filterCode
