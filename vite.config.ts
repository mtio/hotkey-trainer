import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import yaml from "@rollup/plugin-yaml";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), yaml(), tailwindcss(), Icons()],
});
