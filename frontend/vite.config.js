import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig(({ command, mode }) => {
  return {
    define: {
      // Retorna true se estiver rodando o servidor de desenvolvimento local
      __DEV__: mode === 'development'
    },
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://localhost:8080'
      }
    },
    build: {
      outDir: '../src/main/resources/static',
      emptyOutDir: true
    }
  }
})
