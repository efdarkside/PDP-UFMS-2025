import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/nome-do-seu-repositorio/', // ADICIONE ISSO: O nome do seu repositório entre barras
})
