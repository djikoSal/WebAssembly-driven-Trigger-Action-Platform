/**
 ** Fix the assemblyscript (finding the papers)
 ** We do 'inspect element'/ profiling (look at machine code?)
 ** Mem in wasm vs. js
 */
const cp = require("child_process");
const fs = require('fs');
const express = require('express');
const { fstat } = require("fs");
const path = require('path');

const app = express();
const port = 3000;

app.get('/submitPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/submitPage.html'));
    //res.send('Hello World!' + ` ${JSON.stringify(req.query)}`);
})

function childProcessResponse(res, command, flags) {
    //* Creates a childprocess for the command and will send data line by line (appropriate as event source)
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    res.write('data: ' + command + " " + flags.join(" ") + "\n\n"); // initial
    var spw = cp.spawn(command, flags);
    spw.stdout.on('data', function (data) {
        //console.log(`logging data: ${data.toString()}`);
        if (!res.writableEnded) {
            (data.toString().split("\n")).forEach((line) => res.write('data: ' + line + "\n\n"));
        }
    });

    spw.on('close', function (code) {
        res.end();
    });

    spw.stderr.on('data', function (errData) {
        if (!res.writableEnded) {
            res.end('stderr: ' + errData);
        }
    });
}

app.get('/msg/deploy', (req, res) => {
    const filterCodeId = req.query.filterCodeId;
    const userName = req.query.userName;
    const filterCode = req.query.filterCode;
    var services = req.query.services;
    try {
        if (services) {
            services = JSON.parse(services);
        }
        else {
            services = [];
        }
    } catch (error) {
        res.status(400).send("Could not parse the used services");
        return;
    }

    if (!(filterCodeId && userName && filterCode)) {
        res.send('expected filterCodeId, userName & filterCode\nGot: ' + JSON.stringify(req.query));
    } else {
        const tmpPth = `filter_code_raw/${filterCodeId}`;
        //console.log('services: ' + services + " typeof: " + typeof (services));
        fs.writeFileSync(tmpPth, filterCode);
        childProcessResponse(res, 'node', ['deploy.js', tmpPth, filterCodeId].concat(services));
    }

})

app.get('/services/all', (req, res) => {
    const listOfServices = Object.keys(require('./services/assemblyscript_declarations.json'));
    res.send(JSON.stringify(listOfServices));
});

app.get('/', (req, res) => {
    res.send(`Homepages: ${JSON.stringify(req.query)}`);
})

app.get('/filterCode/all', (req, res) => {
    const fs = require('fs');
    fs.readdir('filter_code_raw', (err, fileNames) => {
        if (err) {
            res.end();
        } else {
            res.send(fileNames);
        }
    });
});

app.get('/msg/run/:filterCodeId/:runtime', (req, res) => {
    const runtime = req.params.runtime;
    const filterCodeId = req.params.filterCodeId;
    if (runtime != 'wasm' && runtime != 'js') {
        res.send('Url pattern is /run/:filterCodeId/:runtime and :runtime := wasm || js');
        return;
    }
    const runtimeFlag = (runtime == 'js') ? '--js' : '';
    childProcessResponse(res, 'node', ['runtime.js', filterCodeId, runtimeFlag]);
})

app.get('/run', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/runFilterCode.html'));
});

app.get('/run/:filterCodeId/:runtime', (req, res) => {
    const runtime = req.params.runtime;
    const filterCodeId = req.params.filterCodeId;
    if (runtime != 'wasm' && runtime != 'js') {
        res.send('Url pattern is /run/:filterCodeId/:runtime and :runtime := wasm || js');
        return;
    }
    const runtimeFlag = (runtime == 'js') ? '--js' : '';
    const nop = (_ = null) => null;
    const before = new Date();
    const mockRes = {
        end: (msg) => {
            if (!mockRes.finished) {
                res.end(`Time lapsed: ${(new Date()) - before}\ndump:\n${msg}`);
                mockRes.finished = true;
            }
        },
        write: nop, flushHeaders: nop, setHeader: nop
    };
    childProcessResponse(mockRes, 'node', ['runtime.js', filterCodeId, runtimeFlag]);
})

app.listen(port, () => {
    console.log(`Protoype server now serving at port ${port}`);
})