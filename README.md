# Pages
<br>`/submitPage` - page for deploying your filter code and specifying the services needed<br>
<br>`/` - nothing yet<br>
<br>`/services/all` - returns name of all availabe services<br>
<br>`/run/:filterCodeId/:runtime` - run filter code with the specified id, in the runtime specified (wasm or js)<br>
# Output files from deploying
1. Raw source code is stored in `filtercode/raw`
2. Assemblyscript version of the raw code is generated with the needed declarations, it is then stored in dir `filtercode/assemblyscript`
3. Using asc we compile the  TS/assmblyscript file into wasm, store wasm to `filtercode/wasm` folder together with a text format of the wasm (`.wat`)
4. Using package `typescript` we transpile the TS file into a JS file and do some cleaning and create the imports needed. The JS file is then stored in `filtercode/javascript`
# Usage
For deploying filter code in AssemblyScript:
<br>`$ node deploy.js *filter code src file* *Filter code ID of your choice* *used-service-1* ... *used-service-n*`<br>

For playing around with assemblyscript compiler:
<br>`$ npm run asc -- --help --otherflags` <br>

For running filter code in wasm runtime:
<br>`$ node runtime.js *Filter code ID*` <br>

For running filter code in JS runtime:
<br>`$ node runtime.js *Filter code ID* --js`<br>

For running a load test:
<br>`$ npm run load *WebSocket url* *Filter code ID* *wasm || js* *number of requests*`<br>

# Resources in no particular order
## AssemblyScript x wasmtime
[hello world project](https://github.com/bytecodealliance/wasmtime/tree/main/docs/assemblyscript-hello-world) (wasmtime is run through os installation)

## Running Wasm as JS embedding
[Linker by deislabs](https://deislabs.io/posts/a-simple-wasm-linker-js/)
