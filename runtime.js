const { Linker } = require('@deislabs/wasm-linker-js');
const binaryen = require('binaryen');
const fs = require('fs');
const serviceAPIs = require('./services/API');

function run_wasm(filterCodeId, options) {
    fs.readFile(`filter_code_wasm/${filterCodeId}.wasm`, async function (err, data) {
        if (err) {
            console.log('Something went wrong when reading .wasm file:\n' + err);
            return;
        }

        var runTimeLinker = new Linker();
        var myModule = binaryen.readBinary(data).emitBinary(); // what more can we do with modules?

        // Expose API based on access rights
        const dummyAccessConfig = Object.keys(serviceAPIs); //TODO restrict access to service APIs
        for (var i = 0; i < dummyAccessConfig.length; i++) {
            const funcName = dummyAccessConfig[i];
            runTimeLinker.define(`${filterCodeId}`, funcName, serviceAPIs[funcName]);
        }

        // instantiate our module
        var runtime = await runTimeLinker.instantiate(myModule);
        console.log(runtime.instance.exports.filterCode()); // make the call
    });
}

function run_ts(filterCodeId, options) {
    require(`./filter_code_javascript/${filterCodeId}.js`).filterCode(); // make the call
}

if (require.main == module) {
    let filterCodeId = process.argv[2];
    if (process.argv[3] == '--js')
        run_ts(filterCodeId, {});
    else
        run_wasm(filterCodeId, {});
}

exports = run_wasm