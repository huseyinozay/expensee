module.exports = {
  apps: [
    {
      name: "expensee",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p " + 8080,
      watch: false,
      autorestart: true,
    },
  ],
};
