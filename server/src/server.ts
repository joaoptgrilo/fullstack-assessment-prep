import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import db from './database'; // <-- ADD THIS IMPORT to get access to the database object

const PORT = 3001;

/**
 * The main startup function for the server.
 */
async function startServer() {
    console.log('Server starting...');
    try {
        await initializeDatabase();
        console.log('Database initialization complete.');

        const app: Express = express();

        // --- Middleware Setup ---
        app.use(cors());
        app.use(express.json());


        // --- API Routes ---
        app.get('/', (req: Request, res: Response) => {
            res.status(200).json({ message: "Server is running successfully." });
        });

        // *** NEW ENDPOINT STARTS HERE ***

        // GET /api/polls - Retrieve all polls
        app.get('/api/v1/polls', (req: Request, res: Response) => {
            const sql = "SELECT id, question FROM polls";

            db.all(sql, [], (err: Error | null, rows: any[]) => {
                if (err) {
                    // If an error occurs, send a 500 Internal Server Error response
                    res.status(500).json({ error: err.message });
                    return;
                }
                // If successful, send a 200 OK response with the polls data
                res.status(200).json(rows);
            });
        });

        // *** NEW ENDPOINT ENDS HERE ***


        // --- Start the Server ---
        app.listen(PORT, () => {
            console.log(`🚀 Server is listening on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Run the server startup function
startServer();