const crypt = require('bcrypt');
const random = require('../utils/random');
const sql = require('./database');

const salt = 7;

class User {
    
    constructor (user, sensible = false) {

        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.role = user.role;
        this.created_at = user.created_at;
        this.inactive = user.inactive;

        if (!sensible) {
            
            this.password = user.password;
            this.token_id = user.token_id;
        }
    }

    login (result) {

        sql.query(`SELECT * FROM users WHERE email = ? AND inactive = 0`,
        [this.email],
        
        (error, results, field) => {
    
            if (error) throw error;
    
            const user = new User(results[0]);
    
            crypt.compare(this.password, user.password, (error, passwordsMatch) => {
    
                if (error) throw error;
 
                result((passwordsMatch) ? new User(user) : {});
            });
        });
    }

    get (result) {

        sql.query(`SELECT * FROM users WHERE id = ?`,
        [this.id],
        
        (error, results, field) => {
    
            if (error) throw error;

            result(new User(results[0], true));
        });
    }

    search (result) {

        sql.query(`SELECT * FROM users`,
        (error, results, field) => {
    
            if (error) throw error;
            
            result(results.map(user => new User(user, true)));
        });
    }

    add (result) {

        sql.query(`INSERT INTO users 
                    (id, name, email, password, role, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)`,
        [
            this.id,
            this.name,
            this.email,
            this.password,
            this.role,
            new Date()
        ],
        
        (error, results, field) => {
    
            if (error) throw error;
    
            result({
                id: results.insertId,
                name: this.name,
                email: this.email,
                role: this.role,
                created_at: this.created_at
            });
        });
    }

    change (result) {

        sql.query(`UPDATE users
                    SET name = ?, email = ?, role = ?
                    WHERE id = ?`,
        [this.name, this.email, this.role, this.id],
        
        (error, results, field) => {
    
            if (error) throw error;
    
            result(results.changedRows > 0);
        });
    }

    setToken (result) {

        if (!this.id) throw new Error('user id cannot be null');
    
        const now = new Date();
        const token = { id: random.id(), expires: now.addHours(1) };
    
        sql.query(`INSERT INTO tokens (id, expires) VALUES (?, ?)`,
        [token.id, token.expires],
        
        (error, results, field) => {
    
            if (error) throw error;
    
            sql.query(`UPDATE users
                        SET token_id = ?
                        WHERE id = ?`,
            [token.id, this.id],
            
            (error, results, field) => {
    
                if (error) throw error;
            
                result(results.changedRows > 0);
            });
        });
    }

    setPassword (result) {

        crypt.hash(this.password, salt, (error, hash) => {
    
            if (error) throw error;
        
            const now = new Date();
    
            sql.query(`UPDATE users
                        INNER JOIN tokens ON tokens.id = users.token_id 
                        SET users.password = ?, tokens.expires = ?
                        WHERE users.token_id = ?
                        AND tokens.expires > ?`,
            [hash, now, this.token_id, now],
            
            (error, results, field) => {
    
                if (error) throw error; 
    
                result(results.changedRows > 0);
            });
        });
    }

    remove (result) {

        if (error) throw error;
    
        sql.query(`UPDATE FROM users
                    SET inactive = 1 
                    WHERE id = ?`,
        [this.id],
    
        (error, results, field) => {
    
            if (error) throw error;
    
            result(results.changedRows > 0);
        });
    }
}

module.exports = User ;