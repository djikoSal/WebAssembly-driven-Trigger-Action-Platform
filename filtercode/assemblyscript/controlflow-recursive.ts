//add assemblyscript imports (defaults)
declare function addIngredient(k: string, v: string): void;
declare function getIngredient(k: string): string;
declare function skipAction(): void;
//add assemblyscript imports (external)
declare function consoleLog(x: string): void;

function ack(m: number, n: number): number {
    if (m == 0) { return n + 1; }
    if (n == 0) { return ack(m - 1, 1); }
    return ack(m - 1, ack(m, n - 1));
}

function fib(n: number): number {
    if (n < 2) { return 1; }
    return fib(n - 2) + fib(n - 1);
}

function tak(x: number, y: number, z: number): number {
    if (y >= x) return z;
    return tak(tak(x - 1, y, z), tak(y - 1, z, x), tak(z - 1, x, y));
}

export function filterCode(): void {
    var result: number = 0;

    for (var i: number = 3; i <= 5; i++) {
        result += ack(3, i);
        result += fib(17.0 + i);
        result += tak(3 * i + 3, 2 * i + 2, i + 1);
    }

    var expected: number = 57775;
    if (result != expected) {
        consoleLog("ERROR: bad result: expected " + expected.toString() + " but got " + result.toString());
    } else {
        consoleLog("Done.");
    }
}