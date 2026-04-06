/** PM2: chạy sau khi `npm run build`, file `.env` đặt cùng thư mục backend. */
module.exports = {
  apps: [
    {
      name: 'fouderd-api',
      cwd: __dirname,
      script: 'dist/src/main.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
