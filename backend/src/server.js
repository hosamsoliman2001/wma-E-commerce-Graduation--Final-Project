// server.js
const http = require("http");

require("./config/env");
const { AppDataSource } = require("./config/data-source");
const app = require("./app");

const PORT = parseInt(process.env.PORT || "3000", 10);

async function startServer() {
  try {
    await AppDataSource.initialize();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Server listening on port ${PORT}.

for the frontend

http://localhost:${PORT}/

for Backend

http://localhost:${PORT}/docs`
      );
      if (process.env.NODE_ENV !== "production") {
        openSwaggerUI(PORT);
      }
    });

    const shutdown = async () => {
      // eslint-disable-next-line no-console
      console.log("Shutting down...");
      server.close(async () => {
        await AppDataSource.destroy().catch(() => {});
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

async function openSwaggerUI(port) {
  const url = `http://localhost:${port}/docs`;
  try {
    const { default: open } = await import("open");
    await open(url);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to open Swagger UI", error);
  }
}

startServer();
