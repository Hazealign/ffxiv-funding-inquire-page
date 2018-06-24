module.exports = {
  apps : [
    {
      interpreter : '/usr/local/bin/ts-node',
      name      : 'API Server',
      cwd       : './packages/inquire-page-backend',
      script    : 'server/server.ts',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      interpreter : '/usr/local/bin/ts-node',
      name      : 'Front Server [Main]',
      cwd       : './packages/inquire-page-frontend',
      script    : 'index.ts',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
