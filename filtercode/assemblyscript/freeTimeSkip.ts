//add assemblyscript imports
declare function currentHour(): number;
declare function currentDay(): number;
declare function skipAction(): void;
declare function consoleLog(x: string): void;
export function filterCode(): void {
let hour = currentHour();
let day = currentDay();

if(hour <= 11 && hour >= 12){
	skipAction(); // lunch
}
else if(day == 0 || day == 6){
	skipAction(); // I'm not working
}
else {
	consoleLog("Not skipping (for debugging)");
}
}