import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */

export default defineConfig({
  base: "/prg-8/",

  build: {
    outDir: 'docs',
    emptyOutDir: true, // empty the build dir before new build
  }
});