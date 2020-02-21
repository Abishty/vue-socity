module.exports = {
  apps: [
    {
      name: 'app',
      script: './server/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
