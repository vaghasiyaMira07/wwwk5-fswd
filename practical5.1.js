const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const LOG_FILE = 'visits.log';
let lastLogTime = {};

// Middleware to log user visits with basic duplicate prevention
app.use((req, res, next) => {
    let ip = req.ip === '::1' ? '127.0.0.1' : req.ip; // Convert IPv6 loopback to IPv4
    let currentTime = new Date().toISOString();

    // Avoid logging duplicate entries within 5 seconds for the same IP
    if (!lastLogTime[ip] || new Date() - new Date(lastLogTime[ip]) > 5000) {
        lastLogTime[ip] = currentTime;
        const logEntry = `${ip} - ${currentTime}\n`;
        fs.appendFile(LOG_FILE, logEntry, (err) => {
            if (err) {
                console.error('Error writing to log file', err);
            }
        });
    }

    next();
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to retrieve logs
app.get('/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read log file' });
        }
        const logs = data.split('\n').filter(entry => entry).map(entry => {
            const [ip, time] = entry.split(' - ');
            return { ip, time };
        });
        res.json(logs);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
