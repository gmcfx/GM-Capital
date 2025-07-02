import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@components": path.resolve(__dirname, "src/components"),
        "@contexts": path.resolve(__dirname, "src/contexts"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
        "@lib": path.resolve(__dirname, "src/lib"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@appTypes": path.resolve(__dirname, "src/types"),
      }
    },
    server: {
      host: "localhost",
      port: 8080,
      open: true,
      strictPort: true,
    },
    build: {
      outDir: 'build',
      emptyOutDir: true,
      target: "es2020",
      output: {
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/database"],
          react: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react", "sonner", "recharts"],
        }
      }
    },
    optimizeDeps: {
      include: [
        "firebase/app",
        "firebase/auth",
        "firebase/database",
        "react",
        "react-dom"
      ],
      esbuildOptions: {
        target: "es2020",
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    }
  };
});