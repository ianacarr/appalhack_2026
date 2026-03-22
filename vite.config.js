import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  resolve: {
    alias: {
      webtorrent: fileURLToPath(
        new URL("./docs/webtorrent.min.js", import.meta.url),
      ),
    },
  },
});
