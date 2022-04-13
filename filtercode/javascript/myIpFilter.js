// Insert some imports here that the filter code needs
const printNumber = require("../services/API").printNumber
const ipAdresses = require("../services/API").ipAdresses
function filterCode() {
    // how many 2xx.x.x.x are there?
    var inputStr = ipAdresses();
    var inputArr = inputStr.split(" ");
    var hitCount = inputArr.reduce(function (hitCount, ip) {
        var firstByteStr = ip.split(".")[0];
        if (parseInt(firstByteStr) >= 200) {
            return hitCount + 1;
        }
        else {
            return hitCount;
        }
    }, 0);
    printNumber(hitCount);
}

exports.filterCode = filterCode
