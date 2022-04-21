const fs = require('fs');
const functionLibrary = require('./services/API');
const AsBind = require("as-bind/dist/as-bind.cjs.js");
const vm = require('vm');
const ivm = require('isolated-vm');
const { VM } = require('vm2');

function _Map2ObjStr(m) {
    let o = "{";
    m.forEach((v, k) => { o += `"${k}":"${v}",` });
    return (o.substring(0, o.length - 1) + "}"); // replace last comma to closing bracket
}

function _addNodeREDfills(context) {
    const nodeREDfills = require('./services/node-RED-API.fills');
    const myREDNode = {
        send: () => {
            let resStr = 'Node RED sent msg: {\n';
            context.ingredients.forEach((v, k) => { resStr += `${k}: ${v}\n` });
            console.log(resStr + '}');
        },
        error: (errMsg) => { console.log('Node RED err: ' + errMsg); },
        msgProperties: context.ingredients
    };
    for (let REDname of Object.keys(nodeREDfills)) {
        const REDobj = nodeREDfills[REDname];
        const REDfunc = REDobj.fn ? REDobj.fn : REDobj.getFn(myREDNode);
        context.externalFunctions[REDname] = REDfunc; // add host call
    }
}

function run_wasm(filterCodeId, services, onFinish) {
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
        onFinish();
    });
}

function run_js_eval(filterCodeId, services, onFinish) {
    // No isolation, no nothing - just do eval
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', async function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            with (services) eval(`function myInnerFilterCode(){ ${code} } myInnerFilterCode();`);
            //with (services) eval(`${code}`); //// Very bad perf
        })(jsBody)
        onFinish();
    });
}

function run_js_function(filterCodeId, services, onFinish) {
    // Using js Function object
    // https://stackoverflow.com/questions/4599857/are-eval-and-new-function-the-same-thing
    // https://stackoverflow.com/questions/24354371/why-javascript-eval-is-slower-when-it-shouldnt-be
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', async function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            (new Function(Object.keys(services).map(k => `${k} = this.${k}`), `${code}`)).bind(services)();
        })(jsBody)
        onFinish();
    });
}

function run_js_vm(filterCodeId, services, onFinish) {
    /** vm
     * https://nodejs.org/api/vm.html
    */
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            const script = new vm.Script(`function myInnerFilterCode(){ ${code} } myInnerFilterCode();`);
            //const script = new vm.Script(code);
            const context = services;
            vm.createContext(context);
            script.runInContext(context);
            //script.runInNewContext(context); // doesn't matter much for us
        })(jsBody)
        onFinish();
    });
}

function run_js_vm2(filterCodeId, services, onFinish) {
    /** vm2 with freezing
     * https://github.com/patriksimek/vm2
    */
    fs.readFile(`./filtercode/javascript/${filterCodeId}.jsbody`, 'utf-8', function (err, jsBody) {
        if (err) {
            console.log('Something went wrong when reading .jsbody file:\n' + err);
            return;
        }
        (function runFilterCode(code) {
            const _vm = new VM({
                //timeout: 1000,
                //allowAsync: false,
                sandbox: {} // things here can't be frozen
            });
            // make objects read-only
            for (const [name, fn] of Object.entries(services)) {
                _vm.freeze(fn, name); // https://github.com/patriksimek/vm2#read-only-objects-experimental
            }
            _vm.run(`${code}`);
        })(jsBody)
        onFinish();
    });
}


function run_js_ivm(filterCodeId, services, onFinish) {
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
        onFinish();
    });
}

function run(filterCodeId, runtimeFlag, inputIngredients = {}, responseObj = undefined) {
    // Get the external function dependencies our filter code has
    const functionDependencies = require('./services/filterCodeId2Services.json')[filterCodeId]["services"];

    //* This is our import object aka runtime context
    const context = {
        externalFunctions: {}, // ( fname, fn ), this is our table of host call functions
        ingredients: new Map(), // < string, string >, similar to msg properties in node-RED
    };
    // add addIngredient & getIngredient default functions
    context.externalFunctions["addIngredient"] = (kStr, vStr) => {
        if (!context.ingredients.has(kStr.toString())) {
            context.ingredients.set(kStr.toString(), vStr.toString());
        } else { throw Error(`You can't override ingredients, ingredient "${kStr}" already exists`) }
    }
    context.externalFunctions["getIngredient"] = (kStr) => (context.ingredients.get(kStr) || "");
    context.externalFunctions["skipAction"] = () => {
        if (responseObj && !responseObj.finished) {
            responseObj.status(204).end(); // no content
        } else { console.log('Action Skipped!'); }
    };
    // Populate context ingredients with inputted ingredients
    Object.keys(inputIngredients).forEach(k => context.ingredients.set(k, inputIngredients[k]));

    // Add the external functions into externalFunctions
    for (let i = 0; i < functionDependencies.length; i++) {
        const name = functionDependencies[i];
        if (name == 'node-RED') { // node-RED? then add all RED-API fills as host calls
            _addNodeREDfills(context);
        } else {
            const func = functionLibrary[name].fn;
            context.externalFunctions[name] = func;
        }
    }

    /**
     * onFinish is always called when filter code is done running
     * If skipAction was not called explicitly then we will still
     * respond with the ingredients/msg
     */
    const onFinish = () => {
        if (responseObj && !responseObj.finished) {
            responseObj.send(_Map2ObjStr(context.ingredients));
        }
    };

    if (runtimeFlag == '--js-vm') {
        run_js_vm(filterCodeId, context.externalFunctions, onFinish);
    }
    else if (runtimeFlag == '--js-vm2') {
        run_js_vm2(filterCodeId, context.externalFunctions, onFinish);
    }
    else if (runtimeFlag == '--js-ivm') {
        run_js_ivm(filterCodeId, context.externalFunctions, onFinish);
    }
    else if (runtimeFlag == '--js-eval') {
        run_js_eval(filterCodeId, context.externalFunctions, onFinish);
    }
    else if (runtimeFlag == '--js-function') {
        run_js_function(filterCodeId, context.externalFunctions, onFinish);
    }
    else if (runtimeFlag == '--wasm') {
        run_wasm(filterCodeId, context.externalFunctions, onFinish);
    } else {
        throw Error('Invalid runtime flag "' + runtimeFlag + '"');
    }
}

if (require.main == module) {
    //(filterCodeId, runtime)
    const inputIngredients = {};
    let inputIngredientFlags = process.argv.slice(4);
    if (inputIngredientFlags.length > 0) {
        inputIngredientFlags.forEach(k => {
            const [ingredientName, ingredientValue] = k.substring(2).split("=");
            inputIngredients[ingredientName] = ingredientValue;
        });
    }

    run(process.argv[2], process.argv[3], inputIngredients);
}

exports.run = run