import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/users': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    proxy.on('error', (err) => {
                        console.error('Proxy error:', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, res) => {
                        console.log('Proxying request:', req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        console.log('Received response from target:', proxyRes.statusCode);
                    });
                },
            },
        },
    },
});
