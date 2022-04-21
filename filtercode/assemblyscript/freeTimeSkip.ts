//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function currentHour(): number;
declare function currentDay(): number;
declare function consoleLog(x: string): void;
export function filterCode(): void {
let hour = currentHour();
let day = currentDay();

if(11 <= hour && hour <= 12){
	skipAction(); // lunch
}
else if(day == 0 || day == 6){
	skipAction(); // I'm not working
}
else {
	consoleLog("Not skipping (for debugging)");
}
}