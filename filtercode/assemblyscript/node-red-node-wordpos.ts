//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function RED_util_getMessageProperty(propName: string): string;
declare function RED_util_setMessageProperty(k: string, v: string): void;
declare function node_send_msg(): void;
declare function node_error(errMsg: string): void;
declare function wordposGetPOS(msg: string): string;
export function filterCode(): void {
var text = RED_util_getMessageProperty("payload");
var result = wordposGetPOS(text);

var fields = result.split("\n");
for(var i = 0; i < fields.length; i++){
	if(fields[i].length < 1){
		continue;
	}
	var tmp = fields[i].split(":");
	var fieldName = tmp[0];
	var words_csv = (tmp[1]).substring(1, tmp[1].length - 1); // might be ""
	RED_util_setMessageProperty(fieldName, words_csv);
}

node_send_msg();
}