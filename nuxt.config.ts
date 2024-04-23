
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  app: {
    head: {
      title: "Order Book",
      titleTemplate: "%s | Order Book",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0, user-scalable=0" },
        { charset: "utf-8" },
      ],
    },
  },

  nitro: {
    compressPublicAssets: true,
  },
  devtools: {
    enabled: false,
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    (_, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});

