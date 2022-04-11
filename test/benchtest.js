/** README
 * This is for doing a larger benchtest.
 * Do not start the platform, the benchtest does that for you.
 * Saves results in results dir.
 */

const filterCodeIds = ['myIpFilter'];
const runtimes = ['js-eval', 'js-vm', 'js-ivm', 'wasm'];
const requestCounts = [5000]//[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000];
let loadParams = [];
filterCodeIds
    .forEach(filterCodeId =>
        runtimes.forEach(runtime =>
            requestCounts.forEach(requestCount => {
                loadParams.push({ filterCodeId, runtime, requestCount });
            })
        )
    );

benchHelper(loadParams);

async function benchHelper(loadParams) {
    if (loadParams.length == 0) return (Promise.resolve("Benchtest complete."));
    const { filterCodeId, runtime, requestCount } = loadParams.pop();
    process.stdout.write(filterCodeId + " " + runtime + " " + requestCount + "\t");
    return bench(filterCodeId, runtime, requestCount).then((val) => {
        process.stdout.write(val + '\n');
        return benchHelper(loadParams);
    });
}

async function bench(filterCodeId, runtime, requestCount) {
    // start server
    const { spawn } = require('child_process');
    const server = spawn('node', ['--inspect', './index.js']);
    //server.on('spawn', () => console.log('server started.'));
    ////server.stdout.on('data', (data) => { console.log(`stdout: ${data}`); });

    const serverClosedPromise = new Promise((resolve, reject) => {
        server.on('close', (code, sig) => { resolve(`server closed (code:${code} sig:${sig})`); });
    });

    const websocketUrlPromise = new Promise((resolve, reject) => {
        let chunks = "";
        server.stderr.on('data', (data) => { // "Debugger listening on ws://xxx" is delieverd in chunks
            chunks += data.toString();
        });
        server.stdout.once('data', (_) => { // websocketurl can be extracted now from chunks
            resolve(chunks.split(/( |\r|\n)/).find(s => s.substring(0, 5) == "ws://"));
        });
    });

    websocketUrlPromise.then(websocketUrl => {
        //console.log(`websocketUrl: ${websocketUrl}`);
        // start load process
        const loader = spawn('node', ['./test/load.js', websocketUrl, filterCodeId, runtime, requestCount]);
        //loader.stdout.on('data', (d) => console.log('loader: ' + d.toString()));
        //loader.stderr.on('data', (d) => console.log('loader: ' + d.toString()));
        loader.on('close', (code, sig) => {
            // load done
            process.stdout.write(`loader closed (code:${code} sig:${sig})\t`);
            server.kill(); // kill server
        });
    });
    //

    return serverClosedPromise;
}