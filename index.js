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
    /*childProcessResponse({
    end: (s) => console.log("ended w. " + s),
    write: (s) => console.log("writing s: " + s),
    flushHeaders: () => null,
    setHeader: (s) => null,
}, 'ping', ['-c', '100', '127.0.0.1']);*/
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
        res.end('stderr: ' + errData);
    });
}

app.get('/deploy', (req, res) => {
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

app.listen(port, () => {
    console.log(`Protoype server now serving at port ${port}`);
})