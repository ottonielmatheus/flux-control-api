const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config({ 
    path: {
        dev: '.env.development',
        prod: '.env'
    }[process.env.NODE_ENV] 
});

let pool = mysql.createPool({
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT
});

exports.pool = pool;