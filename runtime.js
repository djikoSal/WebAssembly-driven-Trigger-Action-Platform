const fs = require('fs');
const serviceAPIs = require('./services/API');

function run_wasm(filterCodeId, services) {
    fs.readFile(`filtercode/wasm/${filterCodeId}.wasm`, async function (err, data) {
        if (err) {
            console.log('Something went wrong when reading .wasm file:\n' + err);
            return;
        }
        // import object :: { "module name" : { fname1: f1, fname2: f2... }}
        let importObject = { env: { abort: () => undefined } }; // need to include abort
        importObject[filterCodeId] = services;
        WebAssembly.instantiate(data, importObject).then(wasmModule => {
            wasmModule.instance.exports.filterCode(); // make the call
        });
    });
}

function run_js(filterCodeId, services) {
    /** Uses eval
     * Our js files are bascially standalone modules that we can run without eval,
     * however we want to do eval on only the fn body here because we want to show that
     * it is performance-wise better than the most secure method that is based on eval*/
    //const jsBody = fs.readFileSync(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8');
    //with (services) eval(jsBody);
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', async function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        with (services) eval(jsBody);
    });
    /*
    var result = function (code) {
        with (this) { return eval(code) }
    }.call(services, jsBody); // .call(context, code)
    */
}

function run(filterCodeId, runtimeFlag) {
    // Create the context - Expose list of services used regardless of runtime
    const usedServicesList = require('./services/filterCodeId2Services.json')[filterCodeId]["services"];
    const usedServices = {}; //k: name, v: function
    for (let i = 0; i < usedServicesList.length; i++) {
        const name = usedServicesList[i];
        const func = serviceAPIs[name];
        usedServices[name] = func;
    }

    // run
    if (runtimeFlag == '--js' || runtimeFlag == '-js' || runtimeFlag == '--javascript') {
        run_js(filterCodeId, usedServices);
    } else {
        run_wasm(filterCodeId, usedServices);
    }
}

if (require.main == module) {
    //(filterCodeId, runtime)
    run(process.argv[2], process.argv[3]);
}

exports.run = run