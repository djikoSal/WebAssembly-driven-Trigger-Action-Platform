const fs = require('fs');
const serviceAPIs = require('./services/API');
const AsBind = require("as-bind/dist/as-bind.cjs.js");
const vm = require('vm');

function run_wasm(filterCodeId, services) {
    fs.readFile(`filtercode/wasm/${filterCodeId}.wasm`, function (err, data) {
        if (err) {
            console.log('Something went wrong when reading .wasm file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            // import object :: { "module name" : { fname1: f1, fname2: f2... }}
            let importObject = {}; //{ env: { abort: () => undefined } }; //? need to include abort
            importObject[filterCodeId] = services;
            const instance = AsBind.instantiateSync(code, importObject);
            instance.exports.filterCode(); // make the call
        })(data)
    });
}


function run_js(filterCodeId, services) {
    /** vm
     * https://nodejs.org/api/vm.html
    */
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            const script = new vm.Script(code);
            const context = services;
            vm.createContext(context);
            script.runInContext(context);
            //script.runInNewContext(context); // doesn't matter much for us
        })(jsBody)
    });
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