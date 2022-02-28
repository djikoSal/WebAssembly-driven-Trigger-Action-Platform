from wasmtime import Store, Module, Instance, Func, FuncType, Val, ValType
import os

store = Store() #? How do we set env vars? Do we have to use WASI?
fpth = 'wasmtime_example.wasm' if os.path.exists('wasmtime_example.wasm') else 'wasmtime/wasmtime_example.wasm'
module = Module.from_file(store.engine, fpth)

def sendSMS(x):
    for i in range(int(x)):
        print("Hello from Python!")

hello = Func(store, FuncType([ValType.f64()], []), sendSMS)

instance = Instance(store, module, [hello])
run = instance.exports(store)["run"]
run(store)