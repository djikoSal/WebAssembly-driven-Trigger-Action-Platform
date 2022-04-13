//add assemblyscript imports
declare function emailBody(): string;
declare function consoleLog(x: string): void;
export function filterCode(): void {
let content = emailBody();
let ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let abc = "abcdefghijklmnopqrstuvwxyz";

for(let i = 0; i < ABC.length; i++){
	content = content.replaceAll(ABC.charAt(i), abc.charAt(i));
}

consoleLog(content);
}