const http = require('http');
const zlib = require('zlib');

const LOGIN = 'lisakorolkova';

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // Маршрут /login
    if (url.pathname === '/login') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(LOGIN);
        return;
    }
    
    // Маршрут /zipper
    if (url.pathname === '/zipper') {
        if (req.method === 'POST') {
            let body = [];
            req.on('data', chunk => {
                body.push(chunk);
            });
            req.on('end', () => {
                const buffer = Buffer.concat(body);
                
                zlib.gzip(buffer, (err, compressed) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error compressing file');
                        return;
                    }
                    
                    res.writeHead(200, {
                        'Content-Type': 'application/gzip',
                        'Content-Disposition': 'attachment; filename=result.gz'
                    });
                    res.end(compressed);
                });
            });
        } else {
            // Форма для загрузки файла
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Gzip Zipper</title>
                    <meta charset="UTF-8">
                </head>
                <body>
                    <h2>Загрузите файл для сжатия в gzip</h2>
                    <form action="/zipper" method="post" enctype="multipart/form-data">
                        <input type="file" name="file" required>
                        <br><br>
                        <input type="submit" value="Сжать">
                    </form>
                </body>
                </html>
            `);
        }
        return;
    }
    
    res.writeHead(404);
    res.end('Not Found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
