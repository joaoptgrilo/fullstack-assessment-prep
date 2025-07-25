import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
// We don't import the 'db' object directly here, as we'll get it from where it's initialized.
// For now, we only need the initialization function.

const PORT = 3001;

/**
 * The main startup function for the server.
 */
async function startServer() {
    console.log('Server starting...');
    try {
        // Wait for the database to be fully initialized and seeded before starting the web server.
        await initializeDatabase();
        console.log('Database initialization complete.');

        // Create the Express application
        const app: Express = express();

        // --- Middleware Setup ---
        // Enable Cross-Origin Resource Sharing for all routes
        app.use(cors());
        // Enable the Express server to parse JSON formatted request bodies
        app.use(express.json());


        // --- API Routes ---
        // Define a simple root route to confirm the server is running
        app.get('/', (req: Request, res: Response) => {
            res.status(200).json({ message: "Server is running successfully." });
        });


        // --- Start the Server ---
        // Make the server listen on the specified port
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