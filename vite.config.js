import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "./src/index.tsx"),
            name: "react-select",
            fileName: "react-select",
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
    },
    plugins: [react(), tailwindcss(), dts({ rollupTypes: true })],
});
