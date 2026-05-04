// PM2 Ecosystem Configuration (alternative to Docker)
// Use this if you prefer running Node.js directly on the VPS

module.exports = {
  apps: [
    {
      name: "ganttflow",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/var/www/ganttflow",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      error_file: "/var/log/ganttflow/error.log",
      out_file: "/var/log/ganttflow/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Restart policy
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
