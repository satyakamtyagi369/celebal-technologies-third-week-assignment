const path = require('path');
const http = require('http');
const fs = require('fs').promises;
const fsSync = require('fs');
const { format } = require('./utils/formatter.js');
const logger = require('./events/logger');

const port = 3000;

const sendFile = async (res, filePath, contentType) => {
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error Loading Page.');
    }
};


const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        await sendFile(res, path.join(__dirname, 'public', 'index.html'), 'text/html');
    } else if (req.url === '/style.css') {
        await sendFile(res, path.join(__dirname, 'public', 'style.css'), 'text/css');
    } else if (req.url === '/script.js') {
        await sendFile(res, path.join(__dirname, 'public', 'script.js'), 'application/javascript');
    } else if (req.url === '/log' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', async () => {
            try {
                const { message } = JSON.parse(body);
                const logMessage = format(message);
                const logDir = path.join(__dirname, 'logs');
                if (!fsSync.existsSync(logDir)) {
                    fsSync.mkdirSync(logDir);
                }
                const logFilePath = path.join(logDir, 'user_logs.txt');
                try {
                    await fs.writeFile(logFilePath, logMessage + '\n', { flag: 'a' });
                    logger.emit('log', message);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Log saved successfully.');
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error writing log.');
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid status.');
            }
        });
    } else {
        res.writeHead(404);
        res.end('File Not Found.');
    }
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
