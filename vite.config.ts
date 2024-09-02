import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    build({
      entry: ["./src/index.ts"],
      outputDir: "./dist",
      external: [],
      minify: true,
      emptyOutDir: false,
    }),
    devServer({
      adapter,
      entry: "src/index.ts",
    }),
  ],
});
