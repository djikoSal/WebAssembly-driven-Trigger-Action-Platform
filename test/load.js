//var childProcess = require('child_process');
var chromedriver = require('chromedriver');
const axios = require('axios').default;
const WebSocket = require('ws');
const { spawn } = require('child_process');
const fs = require("fs");
const Profile = require('cpuprofile').Profile;
//const req = require("request"); // deprecated

const WSURL = process.argv[2]
const FILTERCODE = (process.argv[3] || 'checkHour');
const RUNTIME = (process.argv[4] || 'wasm');
const REQUESTCOUNT = (process.argv[5] || 100);
const FUNCTIONNAME = "runFilterCode";

const port = 9229; // debug port
const waitFor = 1000;// milliseconds
const timeout = (60 + waitFor) * 1000; //10 seconds
var binPath = chromedriver.path; // path to chromedriver executable
const chrome = spawn(binPath, [
    '--remote-debugging-port=' + port,
    '--user-data-dir=temp',
    WSURL
]);

chrome.stdout.on('data', function (data) {
    console.log('chrome says: ' + data.toString());
});

let interval = setTimeout(() => {
    console.log('killing chrome');
    chrome.kill()
    clearTimeout(interval)
}, timeout)

let interval2 = setTimeout(async () => {
    const log = fs.openSync("log.txt", 'a')
    const testLog = fs.openSync(`test/results/${FILTERCODE}-${REQUESTCOUNT}-${RUNTIME}.txt`, "a");
    // Accessing chrome publish websocket address
    const response = await axios.get(`http://localhost:${port}/json`);
    const tab = response.data[0];
    console.log("Enabled websockets")
    //console.log(tab)
    const url = tab.webSocketDebuggerUrl;
    console.log(`url for websocket: ${url}`);
    const ws = new WebSocket(url);
    ws.on('open', function open() {
        ws.send(JSON.stringify({ id: 1, method: 'Profiler.enable' })); // start
    });
    ws.on('message', async function incoming(data) {
        const obj = JSON.parse(data);
        if ("id" in obj) {
            fs.writeSync(log, data + "\n")
            const id = obj.id;
            if (id == 1) { // profiler enabled
                console.log('Profiler enabled');
                ws.send(JSON.stringify({ id: 2, method: 'Profiler.start' })); // start
            } else if (id == 2) { // profiler started
                // start the load
                fs.writeSync(log, data + "\n")
                console.log('Profiler started');
                const url = `http://localhost:3000/run/${FILTERCODE}/${RUNTIME}`;
                const abTest = spawn('ab', [
                    '-n', REQUESTCOUNT, // count
                    '-c', 10, // concurrency
                    url
                ]);
                abTest.stdout.on('data', function (data) { fs.writeSync(testLog, data); });
                abTest.on('exit', async () => {
                    console.log('Load done.');
                    await new Promise(resolve => setTimeout(resolve, 500)); // wait
                    ws.send(JSON.stringify({ id: 3, method: 'Profiler.stop' })); // stop profiling
                });
                abTest.on('error', (err) => console.log("err: " + err));
                //const responseArr = await Promise.all(requestArr);
                //const sucessRate = responseArr.filter(res => res.status == 200).length / responseArr.length;
                //console.log(`Load done. Did ${reqCount} requests with success rate of ${sucessRate * 100} %`);
            } else if (id == 3) { // profiler stopped - collect results
                console.log('Profiler stopped');
                fs.writeFileSync(`test/results/${FILTERCODE}-${RUNTIME}-${REQUESTCOUNT}-profile.cpuprofile`, JSON.stringify(obj.result.profile));
                let profile = Profile.createFromObject(obj.result.profile);
                const prettyTargetNode = profile.formattedBottomUpProfile().find(n => n.functionName == FUNCTIONNAME);
                let resultsStr = "";
                resultsStr += 'Profiler summary =>\n';
                resultsStr += `start time: ${profile.startTime}\n`;
                resultsStr += `end time: ${profile.endTime}\n`;
                resultsStr += `node count: ${profile.nodes.length}\n`;
                resultsStr += `sampling interval: ${profile.samplingInterval}\n`;
                //resultsStr += `filter code hit count: ${targetNode[0].hitCount}\n`;
                resultsStr += `filter code self time: ${prettyTargetNode.selfTime}\n`;
                resultsStr += `filter code total time: ${prettyTargetNode.totalTime}\n`;
                console.log(resultsStr);
                fs.writeSync(testLog, resultsStr);
                ws.send(JSON.stringify({ id: 4, method: 'Profiler.disable' })); // stop profiling
            } else if (id == 4) {
                fs.writeSync(log, data + "\n")
                ws.terminate();
            }
        }
    });
    ws.on("close", function () {
        console.log('WebSocket closed. Exiting');
        // https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/front_end/core/sdk/CPUProfileDataModel.ts;drc=f290aeebbcf4f9e5662a184a9c6afc964f4a602a;l=56
        // chromium: const sampleTime = (this.profileEndTime - this.profileStartTime) / this.totalHitCount;
        // chromium: self = (node.hitCount || 0) * sampleTime;
        process.exit(0)
    });
    clearTimeout(interval2)
}, waitFor)