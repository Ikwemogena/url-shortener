// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon"],

  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },

  css: [
    '~/assets/scss/main.scss'
  ]
})