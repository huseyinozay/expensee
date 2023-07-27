module.exports = {
  apps: [
    {
      name: "expensee",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p " + 3000,
      watch: false,
      autorestart: true,
    },
  ],
};
