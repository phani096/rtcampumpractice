const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    res.json(data);
});

app.post('/save', (req, res) => {
    const data = req.body.data;
    const query = 'INSERT INTO mytable (name, age) VALUES ("Alice",30)';
    const values = data.map(row => [row[0], row[1]]);

    connection.query(query, [values], (err, results) => {
        if (err) {
            console.error('Error saving data to the database:', err.stack);
            res.status(500).send('Error saving data');
            return;
        }
        res.send('Data saved successfully');
    });
});

app.get('/retrieve', (req, res) => {
    const query = 'SELECT * FROM mytable';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err.stack);
            res.status(500).send('Error retrieving data');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
