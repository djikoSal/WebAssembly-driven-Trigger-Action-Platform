"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterCode = void 0;
function filterCode() {
    var value = RED_util_getMessageProperty("payload");
    if (value.length > 0) {
        var sentimentResult = sentimentScore(value);
        RED_util_setMessageProperty("sentiment", sentimentResult.toString());
        node_send_msg();
    }
    else {
        node_send_msg();
    } // If no matching property - just pass it on.
}
exports.filterCode = filterCode;
