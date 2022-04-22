//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function RED_util_getMessageProperty(propName: string): string;
declare function RED_util_setMessageProperty(k: string, v: string): void;
declare function node_send_msg(): void;
declare function node_error(errMsg: string): void;
declare function dummyjsonParse(template: string, mockdata: string, seed: string): string;
export function filterCode(): void {
var templateStr = RED_util_getMessageProperty("template");
var seedStr = RED_util_getMessageProperty("seed");
var mockdataStr = RED_util_getMessageProperty("mockdata");

var result = dummyjsonParse(templateStr, seedStr, mockdataStr);
RED_util_setMessageProperty("result", result);
node_send_msg();
}