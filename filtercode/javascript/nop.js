// Insert some imports here that the filter code needs
const printNumber = require("../services/API").printNumber
function filterCode() {
    var x = 2 + 5;
    printNumber(x);
}

exports.filterCode = filterCode
