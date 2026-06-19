const express = require('express');
const zlib = require('zlib');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const LOGIN = 'lisakorolkova'; 

// Маршрут /login
app.get('/login', (req, res) => {
    res.type('text/plain');
    res.send(LOGIN);
});

// Маршрут /zipper - форма
app.get('/zipper', (req, res) => {
    res.type('text/html');
    res.send(`
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
});

// Маршрут /zipper - обработка POST
app.post('/zipper', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).type('text/plain').send('No file uploaded');
        return;
    }
    
    zlib.gzip(req.file.buffer, (err, compressed) => {
        if (err) {
            res.status(500).type('text/plain').send('Error compressing file');
            return;
        }
        
        res.set({
            'Content-Type': 'application/gzip',
            'Content-Disposition': 'attachment; filename=result.gz'
        });
        res.send(compressed);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
