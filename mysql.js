const mysql = require('mysql');

let pool = mysql.createPool({
    user: process.env.MYSQL.USER,
    password: process.env.MYSQL.PASSWORD,
    database: process.env.MYSQL.DATABASE,
    host: process.env.MYSQL.HOST,
    port: process.env.MYSQL.PORT
});

exports.pool = pool;