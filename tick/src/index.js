const BACKEND_HTTPBIN = "httpbin";
const BACKEND_TOCK = "tock";
const BACKEND_POLL = "httpbin";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

function randPepper(){
  return parseInt(Math.random()*10000);
}

async function handleRequest(event) {
  // Get the client request.
  let req = event.request;

  // Filter requests that have unexpected methods.
  if (!["HEAD", "GET"].includes(req.method)) {
    return new Response("This method is not allowed", {
      status: 405,
    });
  }

  let url = new URL(req.url);

  // If request is to the `/` path...
  if (url.pathname == "/") {
    let resp_str = "";
    // wait
    const timeoutms= parseInt(url.searchParams.get('timeoutms')) || 15500; // default to 15500 seconds

    resp_str += "delaying start: " + (new Date());
    let dt = (new Date());
    while((new Date()) - dt < timeoutms); // wait 15500
    resp_str += "end: " + (new Date()) + "<br/>";

    // poll
    /* add polling logic here*/
    //fetch('get/404', { backend: BACKEND_POLL });

    // tock
    resp_str += "tock start: " + (new Date());
    // this will timeout at 15 seconds
    const tockresp = await fetch(`/?timeoutms=${timeoutms}&pepper=${randPepper()}`, { backend: BACKEND_TOCK });
    resp_str += "end: " + tockresp.headers.get('date') + " with response code " + tockresp.status;

    return new Response(`Tick finished <br/> status: ${resp_str}`, {
      status: 200,
      headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}


    /** Attempt 1 of delaying - failed because bad method
    let timewaited = 0;
    let waitresp;
    while(timewaited < timeoutseconds){
      const remainingtime = timeoutseconds - timewaited;
      waitresp = await fetch(`delay/${ remainingtime > 10 ? 10 : remainingtime }?pepper=${randPepper()}`, { backend: BACKEND_HTTPBIN}); // wait!
      timewaited += 1; //
    }
    resp_str += "end: " + (waitresp.headers.get('date')) + "<br/>"; */

    /** Attempt 2 of delaying - failed because
    waitresp = await fetch(`/${randPepper()}`, { backend: `unknown${randPepper()}`}); // wait one time with time out 15 sec
    const startDate = Date.parse(waitresp.headers.get('date'));
    while(timewaited < timeoutseconds){
      waitresp = await fetch(`/${randPepper()}`, { backend: `unknown${randPepper()}`}); // wait one time with time out 15 sec
      //timewaited = (Date.parse(waitresp.headers.get('date')) - startDate).getSeconds();
      timewaited += 1;
    }
    let respDate;
    try{
      respDate = Date.parse(waitresp.headers.get('date')) - startDate;
      resp_str += " (date parsed successfully " + respDate + ") ";
    } catch(e){
      resp_str += ` (date failed to parse ${e.message}) `;
    } */