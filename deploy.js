//* Compile and deploy
const fs = require('fs');
const servicesLibrary = require('./services/API');

function _createTsFile(filterCodeRaw, filterCodeId, services) {
    var tsSourceCode = "";
    // tsSourceCode += 'import "wasi";\n'; //! Should not be wasi
    tsSourceCode += "//add assemblyscript imports (defaults)\n";
    tsSourceCode += "declare function addIngredient(k: string, v: string): void;\n"
    tsSourceCode += "declare function getIngredient(k: string): string;\n"
    tsSourceCode += "declare function skipAction(): void;\n"
    tsSourceCode += "//add assemblyscript imports (external)\n";
    services.forEach((serviceName) => {
        if (serviceName == 'node-RED') {
            const nodeREDfills = require('./services/node-RED-API.fills');
            for (const REDname of Object.keys(nodeREDfills)) {
                const REDobj = nodeREDfills[REDname];
                tsSourceCode += `${REDobj.asc_import}\n`; // add node-RED declaration
            }
        } else {
            console.log(serviceName);
            const declaration = servicesLibrary[serviceName].asc_import;
            if (!declaration)
                throw Error(`The declaration/import statement for "${serviceName}" is missing`);
            tsSourceCode += `${declaration}\n`;
        }
    });
    tsSourceCode += "export function filterCode(): void {\n";
    tsSourceCode += `${filterCodeRaw}\n`;
    tsSourceCode += "}";
    fs.writeFileSync(`filtercode/assemblyscript/${filterCodeId}.ts`, tsSourceCode);
}

async function _compileToWasm(pathToSourceFile, filterCodeId) {
    //TODO: Make sure .wasm.map is not generated as well
    console.log('Starting Wasm compilation.');
    const asc = require('assemblyscript/cli/asc');
    const tmpPromise = new Promise(async (resolve, reject) => {
        await asc.ready; // wait for it to be ready
        asc.main(
            [
                pathToSourceFile,
                "--exportRuntime", "--transform", "as-bind", // https://github.com/torch2424/as-bind#quick-start
                "-b", `filtercode/wasm/${filterCodeId}.wasm`,
                "-t", `filtercode/wasm/${filterCodeId}.wat` // textFile
            ],
            { stdout: process.stdout, stderr: process.stderr },
            function (err) {
                if (err) {
                    reject(err);
                }
                resolve(0);
            });
    });

    await tmpPromise
        .then((_) => console.log('Sucessfully compiled to wasm!'))
        .catch(err => { console.log("Wasm compilation failed."); });
    console.log('Exiting Wasm compiler.');
}

function _transpileTS2JS(filterCodeId) {
    console.log('Starting simple transpile TS 2 JS');
    const ts = require('typescript');
    const source = fs.readFileSync(`filtercode/assemblyscript/${filterCodeId}.ts`, 'utf-8');
    let compilerOptions = {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        outDir: `filtercode/javascript`,
    };
    let result = ts.transpileModule(source, { compilerOptions });
    //console.log(JSON.stringify(result));
    fs.writeFileSync(`filtercode/javascript/${filterCodeId}.js`, result.outputText);
    console.log(`Transpiling from TS 2 JS done.`);
}

function _oldTranspileTS2JS(filterCodeId) {
    console.log('Starting transpiling TS 2 JS');
    const ts = require('typescript');
    let compilerOpts = {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
        outDir: `filtercode/javascript`,
    };
    let program = ts.createProgram([`filtercode/assemblyscript/${filterCodeId}.ts`], compilerOpts);
    let emitResult = program.emit();

    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    allDiagnostics.forEach((diagnostic) => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    console.log(`Transpiling from TS 2 JS exiting with code '${exitCode}'.`);
}

function _postTranspile(jsPth) {
    const transpiledCode = fs.readFileSync(jsPth, 'utf-8');
    const startOfFunction = transpiledCode.indexOf('function filterCode');
    const endOfFunction = transpiledCode.lastIndexOf('exports.filterCode');
    const functionCode = transpiledCode.substring(startOfFunction, endOfFunction);
    /*
    ! Our imports have to be created dynamically because the runtimes are not
    ! context-free anymore. This means that we can't create a static js file
    var filterCodeJS = "";
    filterCodeJS += `// Insert some imports here that the filter code needs\n`;
    const serviceAPIs = require('./services/API');
    services.forEach((serviceName) => {
        if (!(serviceName in serviceAPIs))
            throw Error(`The service ${serviceName} could not be found`);
        filterCodeJS += `const ${serviceName} = require("../services/API").${serviceName}\n`
    })
    filterCodeJS += `${functionCode}\n`;
    filterCodeJS += 'exports.filterCode = filterCode\n';
    fs.writeFileSync(jsPth, filterCodeJS);
    */
    // save js body alone as well
    fs.writeFileSync(jsPth + 'body', functionCode.split('\n').slice(1, -2).join('\n'));
    fs.unlinkSync(jsPth); //! delete javascript file and only keep .jsbody
}

function _addFilterCodeId2ServicesBinding(filterCodeId, services) {
    let data = JSON.parse(fs.readFileSync('./services/filterCodeId2Services.json', 'utf-8'));
    if (data[filterCodeId]) {
        data[filterCodeId]['services'] = services;
    } else {
        data[filterCodeId] = { 'services': services };
    }
    fs.writeFileSync('./services/filterCodeId2Services.json', JSON.stringify(data));
}

function deploy(filterCodeRaw, filterCodeId, services) {
    _createTsFile(filterCodeRaw, filterCodeId, services);
    _compileToWasm(`filtercode/assemblyscript/${filterCodeId}.ts`, filterCodeId);
    _transpileTS2JS(filterCodeId);
    _postTranspile(`filtercode/javascript/${filterCodeId}.js`, services);
    _addFilterCodeId2ServicesBinding(filterCodeId, services);
}

if (require.main == module) { // if this is running standalone
    let filterCodePth = process.argv[2];
    let filterCodeId = process.argv[3];
    let services = process.argv.slice(4);
    const filterCodeRaw = fs.readFileSync(filterCodePth, 'utf-8');
    deploy(filterCodeRaw, filterCodeId, services);
}

exports = deploy