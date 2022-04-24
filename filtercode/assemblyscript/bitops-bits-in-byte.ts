//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function consoleLog(x: string): void;

function bitsinbyte(b: i32): i32 {
	var m: i32 = 1, c: i32 = 0;
	while (m < 0x100) {
		if (b & m) { c++; }
		m <<= 1;
	}
	return c;
}

function TimeFunc(): i32 {
	var x: i32, y: i32, t: i32;
	var sum: i32 = 0;
	for (x = 0; x < 350; x++)
		for (y = 0; y < 256; y++) sum += bitsinbyte(y);
	return sum;
}

export function filterCode(): void {
	var result: i32 = 0;
	// 1 op = 2 assigns, 16 compare/branches, 8 ANDs, (0-8) ADDs, 8 SHLs
	// O(n)

	result = TimeFunc();

	var expected = 358400;
	if (result != expected) {
		consoleLog("ERROR: bad result: expected " + expected.toString() + " but got " + result.toString());
	} else {
		consoleLog("Done.");
	}
}