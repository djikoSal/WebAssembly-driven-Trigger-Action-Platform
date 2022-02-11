const BACKEND_HTTPBIN = "httpbin";
const BACKEND_TICK = "tick";

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

  if (url.pathname == "/") {
    // wait (OLD)
    const timeoutms = parseInt(url.searchParams.get('timeoutms')) || 15500; // default to 15500 seconds
    /*let timewaited = 0;
    while(timewaited < timeoutseconds){
      const remainingtime = timeoutseconds - timewaited;
      await fetch(`delay/${ remainingtime > 10 ? 10 : remainingtime }?pepper=${randPepper()}`, { backend: BACKEND_HTTPBIN}); // wait!
      timewaited += 10; //
    }*/

    // wait
    let dt = (new Date());
    while((new Date()) - dt < timeoutms); // wait 15500

    // tick
    await fetch(`/?timeoutms=${timeoutms}&pepper=${randPepper()}`, { backend: BACKEND_TICK }); // will timeout at 15

    return new Response(`tock @ ${(new Date())}`, {
      status: 200,
      headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}
