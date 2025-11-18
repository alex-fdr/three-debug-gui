import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        outDir: './dist',
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'three-debug-gui',
            formats: ['es'],
        },
        rollupOptions: {
            external: ['three']
        },
        reportCompressedSize: false,
    },
    plugins: [
        dts({ rollupTypes: true })
    ]
})