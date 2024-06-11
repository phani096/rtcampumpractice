const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydatabase'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Example function to insert data
function insertData(name, age) {
    const query = 'INSERT INTO mytable (name, age) VALUES (?, ?)';
    connection.execute(query, [name, age], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err.stack);
            return;
        }
        console.log('Data inserted, ID:', results.insertId);
    });
}

// Example function to retrieve data
function retrieveData() {
    const query = 'SELECT * FROM mytable';
    connection.execute(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err.stack);
            return;
        }
        console.log('Data retrieved:', results);
    });
}

// Example usage
insertData('Alice', 30);
retrieveData();

// Close the connection
connection.end();
