import sqlite3 from 'sqlite3'; // Use ES6 import syntax

// The verbose stack traces are useful for debugging
const sqlite = sqlite3.verbose();

const DB_SOURCE = 'polls.db';

// Connect to the database. The file is created if it doesn't exist.
const db = new sqlite.Database(DB_SOURCE, (err: Error | null) => { // <-- Add type for the error object
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        db.serialize(() => {
            const createPollsTableSql = `
                CREATE TABLE IF NOT EXISTS polls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL
                );
            `;

            const createOptionsTableSql = `
                CREATE TABLE IF NOT EXISTS options (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    option_text TEXT NOT NULL,
                    votes INTEGER DEFAULT 0 NOT NULL,
                    poll_id INTEGER,
                    FOREIGN KEY (poll_id) REFERENCES polls(id)
                );
            `;

            db.run(createPollsTableSql, (err: Error | null) => { // <-- Add type for the error object
                if (err) {
                    return console.error('Error creating polls table:', err.message);
                }
                console.log('Polls table created or already exists.');
            });

            db.run(createOptionsTableSql, (err: Error | null) => { // <-- Add type for the error object
                if (err) {
                    return console.error('Error creating options table:', err.message);
                }
                console.log('Options table created or already exists.');
            });
        });
    }
});

export default db; // Use ES6 export syntax