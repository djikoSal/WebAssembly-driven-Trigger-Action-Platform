# Wasm sandbox
Waits for request, extracts `?decimal=x` from search params if not provided then `x = 250`, makes call to node B and gets the binary number `y`, returns the sum `z = x + y`

Is configured with node B as a backend for this service.