//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function consoleLog(x: string): void;
declare function callWebHookIFTTT(eventName: string, value1: string, value2: string, value3: string): void;
export function filterCode(): void {
var tomorrowData = getIngredient("TomorrowsCondition");
consoleLog(tomorrowData);
var words = tomorrowData.split(" "); 
for(var i = 0; i < words.length; i++){
	if(words[i] == 'Rain'){
		callWebHookIFTTT("send_email", "Prepare for rain tomorrow!" , "I've checked tomorrows forecast and it seems that it will rain, prepare your rain coat!", "");

	} else if (words[i] == 'Showers'){
		callWebHookIFTTT("send_email", "There will be showers tomorrow!" , "I've checked tomorrows forecast and it seems that it will showers, you might want to prepare for that", "");
	}
}


}