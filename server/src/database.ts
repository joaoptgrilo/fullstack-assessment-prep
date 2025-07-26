import sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Type definitions for our data structures
interface SeedPoll {
    question: string;
    options: string[];
}

const sqlite = sqlite3.verbose();
const DB_SOURCE = 'polls.db';
const db = new sqlite.Database(DB_SOURCE);

/**
 * Initializes the database by creating tables and seeding them from a JSON file.
 * Returns a Promise that resolves when the entire setup is complete.
 */
export function initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS polls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL UNIQUE
                );
            `, (err) => {
                if (err) return reject(err);
            });

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

                seedDatabase()
                    .then(resolve)
                    .catch(reject);
            });
        });
    });
}

/**
 * Intelligently seeds the database by inserting polls from seed-data.json
 * only if they do not already exist.
 */
async function seedDatabase(): Promise<void> {
    try {
        const seedFilePath = path.resolve(__dirname, '..', 'seed-data.json');
        const seedFileContent = fs.readFileSync(seedFilePath, 'utf-8');
        const seedData: SeedPoll[] = JSON.parse(seedFileContent);

        // Promise-based wrappers to allow for async/await with the sqlite3 library
        const dbGet = (sql: string, params: any[] = []): Promise<any> => {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
            });
        };
        const dbRun = (sql: string, params: any[] = []): Promise<{ id: number }> => {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function (err) { err ? reject(err) : resolve({ id: this.lastID }); });
            });
        };

        const insertOptionSql = `INSERT INTO options (option_text, poll_id) VALUES (?, ?)`;
        const insertPollSql = `INSERT INTO polls (question) VALUES (?)`;

        for (const poll of seedData) {
            const existingPoll = await dbGet(`SELECT id FROM polls WHERE question = ?`, [poll.question]);

            if (!existingPoll) {
                const { id: newPollId } = await dbRun(insertPollSql, [poll.question]);
                const stmt = db.prepare(insertOptionSql);
                for (const option of poll.options) {
                    stmt.run(option, newPollId);
                }
                stmt.finalize();
            }
        }
    } catch (error) {
        console.error("Error during intelligent seeding:", error);
        throw error;
    }
}

export default db;