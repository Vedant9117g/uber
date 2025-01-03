import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/users': {
                target: 'http://localhost:5001', // Backend server
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
