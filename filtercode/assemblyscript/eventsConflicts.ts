//add assemblyscript imports
declare function printNumber(x: number): void;
declare function upcomingClubEvents(): Array<string>;
declare function upcomingMyEvents(): Array<string>;
export function filterCode(): void {
let clubEvents = upcomingClubEvents();
let myEvents = upcomingMyEvents();

let conflictMs: i64 = 0;

for(let i = 0; i < clubEvents.length; i = i + 2){
	let clubDtStart = Date.parse(clubEvents[i]).getTime();
	let clubDtEnd = Date.parse(clubEvents[i+1]).getTime();
	
	for(let j = 0; j < myEvents.length; j = j + 2){
		let dtStart = Date.parse(myEvents[j]).getTime();
		let dtEnd = Date.parse(myEvents[j+1]).getTime();

		if(clubDtStart < dtStart && clubDtEnd > dtStart){
			conflictMs += (dtEnd - dtStart) - (clubDtEnd - dtStart);
		}
		else if(dtStart < clubDtStart && dtEnd > clubDtStart){
			conflictMs += (clubDtEnd - clubDtStart) - (dtEnd - clubDtStart);
		}
		else if(dtStart < clubDtStart && clubDtEnd < dtEnd){
			conflictMs += (clubDtEnd - clubDtStart);
		}
		else if(clubDtStart < dtStart && dtEnd < clubDtEnd){
			conflictMs += (dtEnd - dtStart);
		}
	}	
}

let conflictHours = (<f64> conflictMs) / (60 * 60 * 1000);
printNumber(conflictHours);
}