// Compiled w. assemblyscript compiler
import "wasi";

declare function sendSMS(data: number): void
export function run(): void {
    sendSMS(5);
}
