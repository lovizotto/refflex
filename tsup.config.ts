import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/core/Rf.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});