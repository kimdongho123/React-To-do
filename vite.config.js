import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // base: "/test/", // <--- 중요: 슬래시 꼭 포함
  plugins: [react()],
  base: '/React-To-do/',  // repo 이름 정확히
  build: {
    outDir: 'docs', // dist 대신 docs 폴더로 빌드
  }
});
