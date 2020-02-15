const crypt = require('bcrypt');
const sql = require('../models/database');

const salt = 7;

// constructor
const User = function (user) {
    
    this.registration = user.registration;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.created_at = user.created_at;
    this.inactive = user.inactive;
}

User.get = (id, result) => {

    sql.query(`SELECT * FROM users WHERE id = ?`,
    [id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results[0]);
        
    });
};

User.search = (result) => {

    sql.query(`SELECT * FROM users`,
    (error, results, field) => {

        if (error) throw error;
        
        result(results);
    });
};

User.add = (user, result) => {

    sql.query(`INSERT INTO users 
                (registration, name, email, password, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
    [
        user.registration,
        user.name,
        user.email,
        user.password,
        user.role,
        new Date()
    ],
    
    (error, results, field) => {

        if (error) throw error;

        result({
            id: results.resultId,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        });
    });
};

User.change = (user, result) => {

    sql.query(`UPDATE users
                SET name = ?, email = ?, role = ?
                WHERE id = ?`,
    [user.name, user.email, user.role, user.id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results.rowsChanged > 0);
    });
};

User.setPassword = (user, result) => {

    crypt.hash((user.password, salt, (error, hash) => {

        if (error) throw error;
    
        sql.query(`UPDATE users
                    SET password = ?
                    WHERE id = ?`,
        [hash, user.id],
        
        (error, results, field) => {

            if (error) throw error;                

            result(results.rowsChanged > 0);
        });
    }));
};

User.remove = (id, result) => {

    if (error) throw error;

    sql.query(`UPDATE FROM users
                SET inactive = 1 
                WHERE id = ?`,
    [id],

    (error, results, field) => {

        if (error) throw error;

        result(results.rowsChanged > 0);
    });
};

module.exports = User;