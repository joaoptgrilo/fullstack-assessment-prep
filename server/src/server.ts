import express, { Express, Request, Response } from "express";
import cors from "cors";
import { initializeDatabase } from "./database";
import db from "./database";

const PORT = 3001;

// --- Type Definitions ---
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

/**
 * Initializes services and starts the Express server.
 */
async function startServer() {
  try {
    await initializeDatabase();
    console.log("Database initialization complete.");

    const app: Express = express();

    // --- Middleware ---
    app.use(cors());
    app.use(express.json());

    // --- API Routes ---

    // Health check endpoint
    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "Server is running successfully." });
    });

    // GET /api/v1/polls - Retrieve all polls
    app.get("/api/v1/polls", (req: Request, res: Response) => {
      const sql = "SELECT id, question FROM polls";
      db.all(sql, [], (err: Error | null, rows: Poll[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
      });
    });

    // GET /api/v1/polls/:id - Retrieve a single poll with its options
    app.get("/api/v1/polls/:id", (req: Request, res: Response) => {
      const pollSql = "SELECT id, question FROM polls WHERE id = ?";
      const optionsSql =
        "SELECT id, option_text, votes FROM options WHERE poll_id = ?";

      db.get(pollSql, [req.params.id], (err: Error | null, poll: Poll) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!poll) return res.status(404).json({ error: "Poll not found." });

        db.all(
          optionsSql,
          [req.params.id],
          (err: Error | null, options: Option[]) => {
            if (err) return res.status(500).json({ error: err.message });
            res
              .status(200)
              .json({ id: poll.id, question: poll.question, options });
          }
        );
      });
    });

    // POST /api/v1/polls/:pollId/vote - Register a vote for an option
    app.post("/api/v1/polls/:pollId/vote", (req: Request, res: Response) => {
      const { optionId } = req.body;
      const { pollId } = req.params;

      if (!optionId) {
        return res.status(400).json({ error: "optionId is required." });
      }

      const sql = `UPDATE options SET votes = votes + 1 WHERE id = ? AND poll_id = ?`;

      db.run(sql, [optionId, pollId], function (err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) {
          return res
            .status(404)
            .json({ error: "Option not found for this poll." });
        }
        res.status(200).json({ message: "Vote registered successfully." });
      });
    });

    // --- Server Activation ---
    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
