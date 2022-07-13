# Introduction & Abstract
This project is part of the thesis `Securing Trigger-Action Platforms With WebAssembly`
<details>
<summary>Thesis Abstract</summary>
The number of internet-connected devices and online services is increasing in the everyday lives of people. These devices and services solve independent tasks when used separately, however, they can solve complex tasks when used together.
<br><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Trigger-action platforms (TAPs) allow users to create applications that connect their devices and services. The applications wait for a condition to be true in a device or service (trigger), and perform an operation in another device or service (action). JavaScript-driven TAPs allow users to add JavaScript code that is executed before the action. Currently, JavaScript-driven TAPs execute the code in the same JavaScript runtime for different applications. The problem is that they use unsafe isolation techniques that fail to secure code across applications. Thus, malicious applications can compromise other applications to leak their private data or control their behavior.
<br><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Motivated to secure TAPs, we investigate isolation techniques on TAPs. The goal of this work is to propose isolation with WebAssembly, a recent language that is praised for its safe isolation. In line with the proposal, we prototype a WebAssembly-driven TAP. We also evaluate WebAssembly in terms of security, usability, and performance. For security, we perform a qualitative analysis of the security of current isolation techniques and WebAssembly. For usability, we implement and evaluate a set of applications on our novel platform. For performance, we conduct benchmarks on different isolation techniques including WebAssembly.
<br><br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
The findings show that WebAssembly provides better isolation of code across applications than current isolation techniques. Our evaluation of usability and performance indicates that WebAssembly is also a practical and efficient solution. Furthermore, the performance results demonstrate that current JavaScript isolation techniques have significant performance issues that WebAssembly does not have. We conclude that WebAssembly can protect code across applications with isolation and it can be used in combination with other security measures to secure TAPs.
</details>

# Pages
<br>`/submitPage` - page for deploying your filter code and specifying the services needed<br>
<br>`/` - nothing yet<br>
<br>`/services/all` - returns name of all availabe services<br>
<br>`/run/:filterCodeId/:runtime` - run filter code with the specified id, in the runtime specified (wasm or js)<br>

# Output files from deploying
1. Raw source code is stored in `filtercode/raw`
2. Assemblyscript version of the raw code is generated with the needed declarations, it is then stored in dir `filtercode/assemblyscript`
3. Using asc we compile the  TS/assmblyscript file into wasm, store wasm to `filtercode/wasm` folder together with a text format of the wasm (`.wat`)
4. Using package `typescript` we transpile the TS file into a JS file and do some cleaning and create the imports needed. The JS file is then stored in `filtercode/javascript`

# Usage
For deploying filter code in AssemblyScript:
<br>`$ node deploy.js *filter code src file* *Filter code ID of your choice* *used-service-1* ... *used-service-n*`<br>

For playing around with assemblyscript compiler:
<br>`$ npm run asc -- --help --otherflags` <br>

For running filter code in wasm runtime:
<br>`$ node runtime.js *Filter code ID*` <br>

For running filter code in JS runtime:
<br>`$ node runtime.js *Filter code ID* --js`<br>

For running a load test:
<br>`$ npm run load *WebSocket url* *Filter code ID* *wasm || js* *number of requests*`<br>
