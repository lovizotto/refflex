import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/Rf.tsx"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
