//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function RED_util_getMessageProperty(propName: string): string;
declare function RED_util_setMessageProperty(k: string, v: string): void;
declare function node_send_msg(): void;
declare function node_error(errMsg: string): void;
declare function badWordsRegExpTest(msg: string): number;
export function filterCode(): void {
let text = RED_util_getMessageProperty("payload");
if ( text.length > 0) {
	if(!badWordsRegExpTest(text)){
		node_send_msg();
	} else {
		skipAction();
	}
}
}