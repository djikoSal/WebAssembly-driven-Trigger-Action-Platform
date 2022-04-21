//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function RED_util_getMessageProperty(propName: string): string;
declare function RED_util_setMessageProperty(k: string, v: string): void;
declare function node_send_msg(): void;
declare function node_error(errMsg: string): void;
declare function sentimentScore(msg: string): number;
export function filterCode(): void {
var value = RED_util_getMessageProperty("payload");
if (value.length > 0) {
	var sentimentResult = sentimentScore(value);
	RED_util_setMessageProperty("sentiment", sentimentResult.toString());
	node_send_msg();
}
else { node_send_msg(); } // If no matching property - just pass it on.
}