import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

const isProd = process.env.NODE_ENV === "production"

export default defineConfig({
  base: isProd ? "/ecocompost-v2/" : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "logo.png"],
      manifest: {
        name: "EcoCompost AI v2",
        short_name: "EcoCompost",
        description: "Tính toán phân bón hữu cơ thông minh",
        theme_color: "#0A7A52",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          { src: "logo.png", sizes: "192x192", type: "image/png" },
          { src: "logo.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css)$/,
            handler: "NetworkFirst",
            options: { cacheName: "assets", expiration: { maxAgeSeconds: 60 } },
          },
          {
            urlPattern: /\.(?:png|jpg|svg|gif|webp|woff2?)$/,
            handler: "CacheFirst",
            options: { cacheName: "static" },
          },
        ],
      },
    }),
  ],
})
