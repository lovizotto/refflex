import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/Rf.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});