import { initializeDatabase } from './database';

/**
 * The main startup function for the server.
 */
async function startServer() {
    console.log('Server starting...');
    try {
        // Wait for the database to be fully initialized and seeded before continuing.
        await initializeDatabase();

        // --- THIS IS WHERE OUR EXPRESS APP LOGIC WILL GO IN THE NEXT TASK ---

        console.log('Server setup is complete and ready to accept requests.');

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit the process with an error code if initialization fails
    }
}

// Run the server startup function
startServer();