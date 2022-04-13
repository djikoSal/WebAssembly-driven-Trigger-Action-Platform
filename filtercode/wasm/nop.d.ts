declare namespace __AdaptedExports {
  /**
   * filtercode/assemblyscript/nop/filterCode
   */
  export function filterCode(): void;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
  env: unknown,
  nop: unknown,
}): Promise<typeof __AdaptedExports>;
