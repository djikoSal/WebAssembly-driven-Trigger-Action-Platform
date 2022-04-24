//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
export function filterCode(): void {
let content = getIngredient("input");
let ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let abc = "abcdefghijklmnopqrstuvwxyz";

for(let i = 0; i < ABC.length; i++){
	content = content.replaceAll(ABC.charAt(i), abc.charAt(i));
}

addIngredient("inputLowercase", content);
}