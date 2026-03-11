import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/**/*'],
      manifest: {
        name: 'MelechHaMamad',
        short_name: 'Mamad',
        description: 'Safe Room Chaos — manage your mamad!',
        theme_color: '#F5E6C8',
        background_color: '#F5E6C8',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'assets/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
  base: '/cool-android-game/',
});
