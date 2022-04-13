//add assemblyscript imports
declare function printNumber(x: number): void;
declare function ipAdresses(): string;
export function filterCode(): void {
// how many 2xx.x.x.x are there?
let inputStr = ipAdresses();
let inputArr = inputStr.split(" ");

let hitCount = 
	inputArr.reduce((hitCount, ip)=> {
		let firstByteStr = ip.split(".")[0];
		if (parseInt(firstByteStr) >= 200){
			return hitCount + 1;
		} 
		else{
			return hitCount;
		}
	}, 0);

printNumber(hitCount);
}