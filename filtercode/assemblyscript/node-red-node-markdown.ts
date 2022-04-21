//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function RED_util_getMessageProperty(propName: string): string;
declare function RED_util_setMessageProperty(k: string, v: string): void;
declare function node_send_msg(): void;
declare function node_error(errMsg: string): void;
declare function mdRender(msg: string): string;
export function filterCode(): void {
let payload = RED_util_getMessageProperty("payload");
if(payload.length > 0){
	RED_util_setMessageProperty("payload", mdRender(payload));
}
node_send_msg();
}