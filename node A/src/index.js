const BACKEND_WASM_SANDBOX = 'wasm_sandbox';
addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

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
    let newUrl = new URL("https://uniquely-neutral-kodiak.edgecompute.app/");
    for (const [k, v] of url.searchParams) newUrl.searchParams.set(k, v); // copy search params

    const sandboxResponse = await fetch(new Request(newUrl),
      { backend: BACKEND_WASM_SANDBOX });
    const sandboxResponseText = await sandboxResponse.text();
    return new Response(`wasm_sanbox answered: ${sandboxResponseText}`, {
      status: 200
    }); // simply forward the response from wasm_sandbox
  }

  // Catch all other requests and return a 404.
  return new Response("The page you requested could not be found", {
    status: 404,
  });
}
