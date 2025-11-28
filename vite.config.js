import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // base: "/test/", // <--- 중요: 슬래시 꼭 포함
  plugins: [react()],
  // base: "./",  //  경로설정 
});
