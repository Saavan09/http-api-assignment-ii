const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const jsonResponses = require('./jsonResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (req, res, callback) => {
    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        if (body.length > 0) {
            try {
                const parsed = JSON.parse(body);
                callback(parsed);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'Invalid JSON', id: 'invalidJSON' }));
                res.end();
            }
        } else {
            callback({});
        }
    });
};

const onRequest = (req, res) => {
    console.log(req.method, req.url);

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // serve frontend index.js
    if (pathname === '/index.js') {
        fs.readFile(path.join(__dirname, 'index.js'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.write(data);
                res.end();
            }
        });
        return;
    }

    if (pathname === '/' || pathname === '/client.html') {
        fs.readFile(path.join(__dirname, '../client/client.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
        return;
    }

    if (pathname === '/style.css') {
        fs.readFile(path.join(__dirname, '../client/style.css'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write('Internal Server Error');
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(data);
                res.end();
            }
        });
        return;
    }

    req.query = query;

    switch (pathname) {
        case '/getUsers':
            if (req.method === 'GET') {
                jsonResponses.getUsers(req, res);
            } else if (req.method === 'HEAD') {
                jsonResponses.getUsersMeta(req, res);
            }
            break;

        case '/addUser':
            if (req.method === 'POST') {
                parseBody(req, res, (body) => {
                    jsonResponses.addUser(req, res, body);
                });
            }
            break;

        case '/notReal':
            if (req.method === 'GET') {
                jsonResponses.notReal(req, res);
            } else if (req.method === 'HEAD') {
                jsonResponses.notRealMeta(req, res);
            }
            break;

        default:
            if (req.method === 'HEAD') {
                jsonResponses.notFoundMeta(req, res);
            } else {
                jsonResponses.notFound(req, res);
            }
            break;
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});