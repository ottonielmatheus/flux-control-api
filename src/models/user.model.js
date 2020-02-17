const crypt = require('bcrypt');
const random = require('../utils/random');
const sql = require('../models/database');

const salt = 7;

// constructor
const User = function (user) {
    
    this.registration = user.registration;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
    this.created_at = user.created_at;
    this.inactive = user.inactive;
    this.token_id = user.token_id;
}

User.get = (registration, result) => {

    sql.query(`SELECT * FROM users WHERE registration = ?`,
    [registration],
    
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
            registration: results.resultId,
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
                WHERE registration = ?`,
    [user.name, user.email, user.role, user.registration],
    
    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

User.setToken = (user, result) => {

    if (!user.registration) throw new Error('user registration cannot be null');

    const now = new Date();
    const token = { id: random.id(), expires: now.addHours(1) };

    sql.query(`INSERT INTO tokens (id, expires) VALUES (?, ?)`,
    [token.id, token.expires],
    
    (error, results, field) => {

        if (error) throw error;

        sql.query(`UPDATE users
                    SET token_id = ?
                    WHERE registration = ?`,
        [token.id, user.registration],
        
        (error, results, field) => {

            if (error) throw error;
        
            result(results.changedRows > 0);
        });
    });
};

User.setPassword = (user, result) => {

    crypt.hash(user.password, salt, (error, hash) => {

        if (error) throw error;
    
        const now = new Date();

        sql.query(`UPDATE users
                    INNER JOIN tokens ON tokens.id = users.token_id 
                    SET users.password = ?, tokens.expires = ?
                    WHERE users.token_id = ?
                    AND tokens.expires > ?`,
        [hash, now, user.token_id, now],
        
        (error, results, field) => {

            if (error) throw error; 

            result(results.changedRows > 0);
        });
    });
};

User.remove = (registration, result) => {

    if (error) throw error;

    sql.query(`UPDATE FROM users
                SET inactive = 1 
                WHERE registration = ?`,
    [registration],

    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

module.exports = User;