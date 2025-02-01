const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./formDB.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to SQLite:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create the Contacts table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS Contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Contacts table is ready.');
            }
        });
    }
});

// API route to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO Contacts (name, email, message) VALUES (?, ?, ?)`;
    db.run(query, [name, email, message], function (err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).json({ error: 'Failed to submit form' });
        }
        res.status(201).json({ message: 'Form submitted successfully', id: this.lastID });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
// End of form-to-mongodb/server.js


app.get('/get-contacts', (req, res) => {
    const query = `SELECT * FROM Contacts`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }
        res.status(200).json(rows);
    });
});