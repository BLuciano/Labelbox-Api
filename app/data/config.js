const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Labelbox',
};

// Create a MySQL pool
const pool = mysql.createPool(config);
module.exports = pool;
