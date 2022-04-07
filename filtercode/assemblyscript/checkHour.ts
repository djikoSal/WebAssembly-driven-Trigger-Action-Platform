import "wasi";
//add assemblyscript imports
declare function currentHour(): number;
declare function skipAction(): void;
declare function sendSMS(): void;
export function filterCode(): void {
var y = currentHour();var x = 13;if (y == x) {    sendSMS();} else {    skipAction();}
}