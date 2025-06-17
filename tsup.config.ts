import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/examples/index.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
