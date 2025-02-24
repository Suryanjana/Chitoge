module.exports = {
    apps : [{
      script: 'src/server.js',
      name: "API",
      node_args: "--env-file .env",
    }],
  };