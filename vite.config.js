import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        community: resolve(__dirname, 'community.html'),
        events: resolve(__dirname, 'events.html'),
        resources: resolve(__dirname, 'resources.html'),
        join: resolve(__dirname, 'join.html'),
        contact: resolve(__dirname, 'contact.html'),
        demo: resolve(__dirname, 'demo.html')
      }
    }
  }
})
