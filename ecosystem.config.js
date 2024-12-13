module.exports = {
    apps: [
      {
        name: "Sewatopup",
        script: "src/server.js",
        watch: true,
        ignore_watch: ["node_modules", "logs", "public"],
        watch_options: {
          followSymlinks: false,
          usePolling: true,
          interval: 100,
        },
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  