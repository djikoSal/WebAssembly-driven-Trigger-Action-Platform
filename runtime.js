const { Linker } = require('@deislabs/wasm-linker-js');
const binaryen = require('binaryen');
const fs = require('fs');
const serviceAPIs = require('./services/API');

function run_wasm(filterCodeId, services) {
    fs.readFile(`filter_code_wasm/${filterCodeId}.wasm`, async function (err, data) {
        if (err) {
            console.log('Something went wrong when reading .wasm file:\n' + err);
            return;
        }

        var runTimeLinker = new Linker();
        var myModule = binaryen.readBinary(data).emitBinary(); // what more can we do with modules?

        // Expose API based on access rights
        Object.entries(services).map(([name, fn]) =>
            //runTimeLinker.define(`moduleName`, fnName, actualFn)
            runTimeLinker.define(`${filterCodeId}`, name, fn)
        );

        // instantiate our module
        var runtime = await runTimeLinker.instantiate(myModule);
        return runtime.instance.exports.filterCode(); // make the call
    });
}

function run_js(filterCodeId, services) {
    /** Uses eval
     * Our js files are bascially standalone modules that we can run without eval,
     * however we want to do eval on only the fn body here because we want to show that
     * it is performance-wise better than the most secure method that is based on eval*/
    //const jsBody = fs.readFileSync(`./filter_code_javascript/${filterCodeId}.jsbody`, 'utf-8');
    //with (services) eval(jsBody);
    fs.readFile(`./filter_code_javascript/${filterCodeId}.jsbody`, 'utf-8', async function (err, jsBody) {
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
    run(process.argv[2], process.argv[3]);
}

exports.run = run