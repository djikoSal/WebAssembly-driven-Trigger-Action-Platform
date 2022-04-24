//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
export function filterCode(): void {
// get excerpt from text that has the keys, 10 words before and after
let longStr = getIngredient("text");
let keyStr = getIngredient("key");

if(! (longStr.length > 0 && keyStr.length > 0) ){
	addIngredient("ExcerptError", `Null input: Got "text":${longStr}, "key":${keyStr}`);
} else {
	let words = longStr.split(" ");
	for(let i = 0; i < words.length; i++) {
		if(words.includes(keyStr)){
			let start = (i - 10) > 0 ? (i - 10) : 0;
			let end = (i + 10) < words.length ? (i + 10) : words.length;
			let resultWords = words.slice(start, end);
			let resultStr = resultWords.join(" ");
			addIngredient("excerpt", resultStr);
			break;
		}
	}
}



}