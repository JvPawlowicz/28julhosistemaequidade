import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('supabase')) return 'vendor-supabase';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('date-fns')) return 'vendor-datefns';
            return 'vendor';
          }
        },
        chunkSizeWarningLimit: 1024, // aumenta o limite para 1MB
      },
    },
  },
}));

console.log('VITE_SUPABASE_URL (vite.config.ts):', process.env.VITE_SUPABASE_URL);
