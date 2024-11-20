import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["./src/drizzle/*.sql"],
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    TanStackRouterVite({}),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm,data,webmanifest}"],
        maximumFileSizeToCacheInBytes: 15_000_000,
      },
      manifest: {
        name: "Local Calories Tracker",
        short_name: "LocalCalTrack",
        description: "Keep track of your diet, locally on your device",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
});
