// Insert some imports here that the filter code needs
const printNumber = require("../services/API").printNumber
function filterCode() {
    var x = 9999991.0 * 9999973.0;
    var i = 2.0;
    while (i < x) {
        var res = x / i;
        if (Math.floor(res) == res) {
            printNumber(i);
            printNumber(Math.floor(res));
            break;
        }
        i = i + 1;
        if (i == x) {
            printNumber(x);
        }
    }
}

exports.filterCode = filterCode
