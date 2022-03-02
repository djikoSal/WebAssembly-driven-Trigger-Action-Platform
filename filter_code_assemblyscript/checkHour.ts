import "wasi";
//add assemblyscript imports
declare function sendSMS(): number;
declare function skipAction(): void;
declare function currentHour(): number;
export function filterCode(): void {
    var y = currentHour();
    var x = 13;
    if (y == x) {
        sendSMS();
    } else {
        skipAction();
    }
}