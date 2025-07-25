import express, { Express, Request, Response } from "express";
import cors from "cors";
import { initializeDatabase } from "./database";
import db from "./database";

const PORT = 3001;

// *** NEW TYPESCRIPT INTERFACES ***
// Define the shape of our data for better type safety
interface Poll {
  id: number;
  question: string;
}
interface Option {
  id: number;
  option_text: string;
  votes: number;
  poll_id: number;
}
// *** END OF NEW INTERFACES ***

async function startServer() {
  console.log("Server starting...");
  try {
    await initializeDatabase();
    console.log("Database initialization complete.");

    const app: Express = express();

    app.use(cors());
    app.use(express.json());

    // --- API Routes ---
    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "Server is running successfully." });
    });

    // GET /api/v1/polls - Retrieve all polls
    app.get("/api/v1/polls", (req: Request, res: Response) => {
      const sql = "SELECT id, question FROM polls";

      db.all(sql, [], (err: Error | null, rows: Poll[]) => {
        // <-- Use our new Poll type
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(200).json(rows);
      });
    });

    // *** NEW ENDPOINT STARTS HERE ***

    // GET /api/v1/polls/:id - Retrieve a single poll with its options
    app.get("/api/v1/polls/:id", async (req: Request, res: Response) => {
      const pollSql = "SELECT id, question FROM polls WHERE id = ?";
      const optionsSql =
        "SELECT id, option_text, votes FROM options WHERE poll_id = ?";

      try {
        // First, get the poll question
        db.get(pollSql, [req.params.id], (err: Error | null, poll: Poll) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          // If no poll is found, it's a 404 Not Found error
          if (!poll) {
            return res.status(404).json({ error: "Poll not found." });
          }

          // If the poll was found, now get its options
          db.all(
            optionsSql,
            [req.params.id],
            (err: Error | null, options: Option[]) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              // Combine the poll and its options into a single response object
              const response = {
                id: poll.id,
                question: poll.question,
                options: options,
              };

              res.status(200).json(response);
            }
          );
        });
      } catch (error) {
        res.status(500).json({ error: (error as Error).message });
      }
    });

    // *** NEW ENDPOINT ENDS HERE ***

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
