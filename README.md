# Main application
1. Use asc to compile ts file into wasm, store wasm to `filter_code_wasm` folder
2. Store a copy of the filter code in typescript at `filter_code_assemblyscript` folder
# Deploying script & other scripts
For deploying filter code in AssemblyScript. Copies the script to assemblyscript folder and compiled version in wasm older with the same name `appletID`:
<br>`$ npm run deploy --src=example.ts --id=appletID` <br>

For playing around with assemblyscript compiler:
<br>`$ npm run asc -- --help --otherflags` <br>

# Resources in no particular order
## AssemblyScript x wasmtime
[hello world project](https://github.com/bytecodealliance/wasmtime/tree/main/docs/assemblyscript-hello-world) (wasmtime is run through os installation)

## Running Wasm 
[Linker by deislabs](https://deislabs.io/posts/a-simple-wasm-linker-js/)