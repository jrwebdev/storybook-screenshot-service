module.exports = {
  apps: [
    {
      name: 'storybook-screenshot-service',
      script: './index.js',
      watch: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
