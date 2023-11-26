import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const cssFilename = 'index.min.css'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir:'./public',
  build:{
    rollupOptions:{
      output:{

        assetFileNames:()=>{
          return `assets/css/${cssFilename}`
        },
        entryFileNames:()=>{
          return `assets/js/[name].min.js`
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
