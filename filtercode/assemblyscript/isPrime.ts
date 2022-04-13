//add assemblyscript imports
declare function printNumber(x: number): void;
export function filterCode(): void {
let x = 9999991.0 * 9999973.0;

let i = 2.0;
while(i < x){
	let res = x / i;
	if(Math.floor(res) == res){
		printNumber(i);
		printNumber(Math.floor(res));
		break;
	}
	i = i + 1;
	if(i == x){
		printNumber(x);
	}
}
}