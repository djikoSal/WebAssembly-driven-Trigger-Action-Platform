// Insert some imports here that the filter code needs
const emailBody = require("../services/API").emailBody
const consoleLog = require("../services/API").consoleLog
function filterCode() {
    var content = emailBody();
    var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var abc = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < ABC.length; i++) {
        content = content.replaceAll(ABC.charAt(i), abc.charAt(i));
    }
    consoleLog(content);
}

exports.filterCode = filterCode
