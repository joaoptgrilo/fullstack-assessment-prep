import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Define TypeScript interfaces for our data structures
interface SeedPoll {
    question: string;
    options: string[];
}

const sqlite = sqlite3.verbose();
const DB_SOURCE = 'polls.db';

// Create the database connection object.
const db = new sqlite.Database(DB_SOURCE);

/**
 * Initializes the database.
 * This function creates tables if they don't exist and then calls the seeding function.
 * It returns a Promise that resolves when the entire setup is complete.
 */
export function initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log('Database serialization started...');

            // Create the polls table with a UNIQUE constraint on the question
            db.run(`
                CREATE TABLE IF NOT EXISTS polls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL UNIQUE
                );
            `, (err) => {
                if (err) return reject(err);
                console.log('Polls table ready.');
            });

            // Create the options table and chain the seeding logic in its callback
            db.run(`
                CREATE TABLE IF NOT EXISTS options (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    option_text TEXT NOT NULL,
                    votes INTEGER DEFAULT 0 NOT NULL,
                    poll_id INTEGER,
                    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
                );
            `, (err) => {
                if (err) return reject(err);
                console.log('Options table ready.');

                // After tables are confirmed to be ready, start the intelligent seeding process
                seedDatabase()
                    .then(() => {
                        console.log("Database check and seeding complete.");
                        resolve(); // Resolve the main promise once seeding is successful
                    })
                    .catch(err => {
                        console.error("Seeding process failed:", err);
                        reject(err); // Reject the main promise if seeding fails
                    });
            });
        });
    });
}

/**
 * Intelligently seeds the database. For each poll in the seed-data.json file,
 * it checks if a poll with the same question already exists before inserting it.
 */
async function seedDatabase(): Promise<void> {
    try {
        const seedFilePath = path.resolve(__dirname, '..', 'seed-data.json');
        const seedFileContent = fs.readFileSync(seedFilePath, 'utf-8');
        const seedData: SeedPoll[] = JSON.parse(seedFileContent);

        console.log(`Checking ${seedData.length} polls from seed file...`);

        // A Promise-based wrapper for db.get to use with async/await
        const dbGet = (sql: string, params: any[] = []): Promise<any> => {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
        };

        // A Promise-based wrapper for db.run to use with async/await
        const dbRun = (sql: string, params: any[] = []): Promise<{ id: number }> => {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) {
                    if (err) reject(err);
                    resolve({ id: this.lastID });
                });
            });
        };

        const insertOptionSql = `INSERT INTO options (option_text, poll_id) VALUES (?, ?)`;
        const insertPollSql = `INSERT INTO polls (question) VALUES (?)`;

        // Process each poll sequentially
        for (const poll of seedData) {
            const existingPoll = await dbGet(`SELECT id FROM polls WHERE question = ?`, [poll.question]);

            if (existingPoll) {
                console.log(`Poll "${poll.question}" already exists. Skipping.`);
            } else {
                console.log(`Inserting new poll: "${poll.question}"`);
                const { id: newPollId } = await dbRun(insertPollSql, [poll.question]);

                const stmt = db.prepare(insertOptionSql);
                for (const option of poll.options) {
                    stmt.run(option, newPollId);
                }
                stmt.finalize();
                console.log(`Inserted ${poll.options.length} options for new poll ID: ${newPollId}`);
            }
        }
    } catch (error) {
        console.error("Error during intelligent seeding:", error);
        throw error;
    }
}

// Export the db object itself for use in our API endpoints later
export default db;