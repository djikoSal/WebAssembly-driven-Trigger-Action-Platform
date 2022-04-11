const fs = require('fs');
const serviceAPIs = require('./services/API');
const AsBind = require("as-bind/dist/as-bind.cjs.js");
const vm = require('vm');
const ivm = require('isolated-vm');

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

function run_js_eval(filterCodeId, services) {
    // No isolation, no nothing - just do eval
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', async function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            with (services) eval(code);
        })(jsBody)
    });
}

function run_js_vm(filterCodeId, services) {
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

function run_js_ivm(filterCodeId, services) {
    /** isolated-vm (ivm)
     * https://github.com/laverdet/isolated-vm/
     * https://npmmirror.com/package/isolated-vm/v/1.7.7
    */
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
            const context = isolate.createContextSync();
            const jail = context.global;
            jail.setSync('global', jail.derefInto());
            for (const [name, fn] of Object.entries(services)) {
                jail.setSync(name, fn); // expose services to the filter code
            }
            context.evalSync(`${jsBody}`); // run the filter code
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
    if (runtimeFlag == '--js-vm') {
        run_js_vm(filterCodeId, usedServices);
    }
    else if (runtimeFlag == '--js-ivm') {
        run_js_ivm(filterCodeId, usedServices);
    }
    else if (runtimeFlag == '--js-eval') {
        run_js_eval(filterCodeId, usedServices);
    }
    else if (runtimeFlag == '--wasm') {
        run_wasm(filterCodeId, usedServices);
    } else {
        throw Error('Invalid runtime flag "' + runtimeFlag + '"');
    }
}

if (require.main == module) {
    //(filterCodeId, runtime)
    run(process.argv[2], process.argv[3]);
}

exports.run = run