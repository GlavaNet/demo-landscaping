import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In GitHub Actions, GITHUB_REPOSITORY is set automatically as 'username/repo-name'.
// We extract just the repo name to use as the base path for GitHub Pages.
// Locally (no GITHUB_REPOSITORY set), base defaults to '/' so npm run dev works normally.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base = repoName ? `/${repoName}/` : '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist'
  }
})
