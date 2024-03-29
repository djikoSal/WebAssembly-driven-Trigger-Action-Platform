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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/home.html'));
})

app.get('/submitPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/submitPage.html'));
    //res.send('Hello World!' + ` ${JSON.stringify(req.query)}`);
})

app.get('/run', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/runFilterCode.html'));
});

function childProcessResponse(res, command, flags) {
    //* Creates a childprocess for the command and will send data line by line (appropriate as event source)
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    res.write('data: $ ' + command + " " + flags.join(" ") + "\n\n"); // initial
    const writeLineByLine = (data) => {
        if (!res.writableEnded) {
            (data.toString().split("\n")).forEach((line) => res.write('data: ' + line + "\n\n"));
        }
    }
    var spw = cp.spawn(command, flags);
    spw.stdout.on('data', writeLineByLine);
    spw.stderr.on('data', writeLineByLine);
    spw.on('close', function (code) {
        res.end();
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
        const tmpPth = `filtercode/raw/${filterCodeId}`;
        //console.log('services: ' + services + " typeof: " + typeof (services));
        fs.writeFileSync(tmpPth, filterCode);
        childProcessResponse(res, 'node', ['deploy.js', tmpPth, filterCodeId].concat(services));
    }

})

app.get('/services/all', (req, res) => {
    const listOfServices = ['node-RED', ...Object.keys(require('./services/API.js'))];
    res.send(JSON.stringify(listOfServices));
});

app.get('/filterCode/all', (req, res) => {
    const fs = require('fs');
    fs.readdir('filtercode/raw', (err, fileNames) => {
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
    let runtimeFlag = `--${runtime}`;
    //require('./runtime').run(filterCodeId, runtimeFlag);
    let reqQuery = req.query; // expects the form
    let inputIngredientFlags = Object.keys(reqQuery).map(k => `--${k}=${reqQuery[k]}`)
    childProcessResponse(res, 'node', ['runtime.js', filterCodeId, runtimeFlag].concat(inputIngredientFlags));
})

app.get('/run/:filterCodeId/:runtime', (req, res) => {
    const runtime = req.params.runtime;
    const filterCodeId = req.params.filterCodeId;
    let runtimeFlag = `--${runtime}`;
    try {
        let inputIngredients = req.query;
        require('./runtime').run(filterCodeId, runtimeFlag, inputIngredients, res);
        //res.status(200).end();
    } catch (error) {
        res.status(500).end(error.toString());
    }
    //childProcessResponse(mockRes, 'node', ['runtime.js', filterCodeId, runtimeFlag]);
})

app.listen(port, () => {
    console.log(`Protoype server now serving at port ${port}`);
})