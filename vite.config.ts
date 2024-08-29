import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import nodeResolve from '@rollup/plugin-node-resolve'


// https://docs.ton.org/develop/dapps/telegram-apps/app-examples

export default defineConfig({
  plugins: [
    react(), 
    basicSsl(),
    nodeResolve({
      browser: true,
      preferBuiltins: false
    })
  ],
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: `@import "./src/styles/globals.scss";`
      }
    }
  },
    build: {
      outDir: './docs'
    },
    server: {
      // Exposes your dev server and makes it accessible for the devices in the same network.
      host: true,
    },
//  base: './'
base: '/tg_miini_app_all_my_data/',
});