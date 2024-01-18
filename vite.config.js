// vite.config.js
export default {
    build: {
        "module": "ESNext",
      outDir: 'dist', // Specify the output directory
      assetsDir: 'assets', // Do not use any base path for assets
    },
    base: '', // Do not use any base path for the application
    // Other Vite configuration options can go here
  };