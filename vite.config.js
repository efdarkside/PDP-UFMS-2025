import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PDP-UFMS-2025/', // ADICIONE ISSO: O nome do seu repositório entre barras
})
