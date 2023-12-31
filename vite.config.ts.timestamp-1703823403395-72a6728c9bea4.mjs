// vite.config.ts
import path from "path";
import { defineConfig } from "file:///D:/Django/django-vitejs/node_modules/.pnpm/vite@5.0.0_@types+node@20.10.0/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Django/django-vitejs/node_modules/.pnpm/@vitejs+plugin-react@4.2.0_vite@5.0.0/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Django\\django-vitejs";
var cssFilename = "index.min.css";
var vite_config_default = defineConfig({
  plugins: [react()],
  publicDir: "./public",
  build: {
    rollupOptions: {
      output: {
        assetFileNames: () => {
          return `assets/css/${cssFilename}`;
        },
        entryFileNames: () => {
          return `assets/js/[name].min.js`;
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEamFuZ29cXFxcZGphbmdvLXZpdGVqc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGphbmdvXFxcXGRqYW5nby12aXRlanNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0RqYW5nby9kamFuZ28tdml0ZWpzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuY29uc3QgY3NzRmlsZW5hbWUgPSAnaW5kZXgubWluLmNzcydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcHVibGljRGlyOicuL3B1YmxpYycsXG4gIGJ1aWxkOntcbiAgICByb2xsdXBPcHRpb25zOntcbiAgICAgIG91dHB1dDp7XG5cbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6KCk9PntcbiAgICAgICAgICByZXR1cm4gYGFzc2V0cy9jc3MvJHtjc3NGaWxlbmFtZX1gXG4gICAgICAgIH0sXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOigpPT57XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvanMvW25hbWVdLm1pbi5qc2BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsT0FBTyxVQUFVO0FBQzlRLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUl6QyxJQUFNLGNBQWM7QUFHcEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFdBQVU7QUFBQSxFQUNWLE9BQU07QUFBQSxJQUNKLGVBQWM7QUFBQSxNQUNaLFFBQU87QUFBQSxRQUVMLGdCQUFlLE1BQUk7QUFDakIsaUJBQU8sY0FBYyxXQUFXO0FBQUEsUUFDbEM7QUFBQSxRQUNBLGdCQUFlLE1BQUk7QUFDakIsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
