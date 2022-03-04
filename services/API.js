// These functions is the default API available for usage in filter code

exports.currentHour = function () {
    return (new Date()).getHours();
}

exports.skipAction = function () {
    //! string in assemblyscript not yet working
    console.log("Action skipped!");
}

// service providers API's
exports.sendSMS = function () {
    console.log('Sending a sms');
}

exports.sendEmail = function () {
    console.log('Sending an email');
}

exports.randomNumber = function () {
    return Math.random
};