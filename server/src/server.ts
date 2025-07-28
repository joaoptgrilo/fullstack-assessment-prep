import app from "./app";
import { initializeDatabase } from "./database";

const PORT = 3001;

async function startServer() {
  try {
    await initializeDatabase();
    console.log("Database initialization complete.");

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
