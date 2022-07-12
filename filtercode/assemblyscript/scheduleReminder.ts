//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function consoleLog(x: string): void;
declare function callWebHookIFTTT(eventName: string, value1: string, value2: string, value3: string): void;
export function filterCode(): void {
var phrase = getIngredient("phrase");

consoleLog(phrase);
var words = phrase.split(" ");
var lastIdx = words.lastIndexOf("scheduled");

var date = "";
var title = phrase;

if(lastIdx > 0){
	title = (words.slice(0, lastIdx)).join(" ");
	date = (words.slice(lastIdx)).join(" ");
}


callWebHookIFTTT("create_reminder", title, "My special list", date);
}