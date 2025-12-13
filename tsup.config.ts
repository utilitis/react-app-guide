import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles.css"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  outDir: "dist",
  esbuildOptions(options) {
    options.assetNames = "styles";
  },
});
