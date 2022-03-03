// Insert some imports here that the filter code needs
const currentHour = require("../services/API").currentHour
const skipAction = require("../services/API").skipAction
const sendSMS = require("../services/API").sendSMS
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
