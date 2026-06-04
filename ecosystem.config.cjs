/** PM2 config — StackCV on port 3010 (does not conflict with other apps) */
module.exports = {
  apps: [
    {
      name: "stackcv",
      cwd: "/var/www/fastuser/data/www/stackcv.bakha.me",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3010",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3010",
      },
    },
  ],
};
