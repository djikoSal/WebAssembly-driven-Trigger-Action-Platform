const BACKEND_NODE_B = "node_b";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

async function handleRequest(event) {
  // Get the client request.
  let originalreq = event.request;

  // Filter requests that have unexpected methods.
  if (!["HEAD", "GET"].includes(originalreq.method)) {
    return new Response("This method is not allowed", {
      status: 405,
    });
  }

  let url = new URL(originalreq.url);

  // If request is to the `/` path...
  if (url.pathname == "/") {
    let decimal = url.searchParams.get('decimal');
    decimal = decimal == null ? 250 : parseInt(decimal); // default 250 decimal

    let respNodeB = await fetch(new Request("https://purely-relaxed-tuna.edgecompute.app/"), {
      backend: BACKEND_NODE_B
    }); // do request to our backend
    let respTextNodeB = (await respNodeB.text());
    if (respTextNodeB == null) respTextNodeB = '0';

    const jsonNodeB = { 'node_a': decimal, 'node_b': respTextNodeB, 'sum': (decimal + parseInt(respTextNodeB,2))};
    if(respNodeB.status == 308){
      jsonNodeB.url = respNodeB.url;
    }

    return new Response(JSON.stringify(jsonNodeB), {
      status: 200,
      headers: new Headers({ "Content-Type": "text/html; charset=utf-8" }),
    });
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}
