module.exports = {
    apps: [
      {
        name: "ds-consulting",
        script: "npm",
        args: "run dev -- --host",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };
  