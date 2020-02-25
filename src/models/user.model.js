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

        try {

            sql.query(`SELECT * FROM users WHERE email = ? AND inactive = 0`,
            [this.email],
            
            (error, results, field) => {
        
                if (error) throw error;

                let user = results[0];

                if (user) {

                    user = new User(user);

                    crypt.compare(this.password, user.password, (error, passwordsMatch) => {
        
                        if (error) throw error;
        
                        result((passwordsMatch) ? new User(user) : null);
                    });
                }

                else
                    result(null);
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    get (result) {

        try {

            sql.query(`SELECT * FROM users WHERE id = ?`,
            [this.id],
            
            (error, results, field) => {
        
                if (error) throw error;

                const user = results[0];

                if (user)
                    return result(new User(user, true));

                result(null);
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    load (result) {

        try {

            sql.query(`SELECT * FROM users`,
            (error, results, field) => {
        
                if (error) throw error;
                
                result(results.map(user => new User(user, true)));
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    add (result) {

        try {
            
            sql.beginTransaction((error) => {

                if (error) throw error;

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
            
                    sql.commit();
                    result({
                        id: results.insertId,
                        name: this.name,
                        email: this.email,
                        role: this.role,
                        created_at: this.created_at
                    });
                });
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }

    change (result) {

        try {

            sql.beginTransaction((error) => {

                if (error) throw error;

                sql.query(`UPDATE users
                    SET name = ?, email = ?, role = ?
                    WHERE id = ?`,
                [this.name, this.email, this.role, this.id],
                
                (error, results, field) => {
            
                    if (error) throw error;
                    
                    sql.commit();
                    result(results.changedRows > 0);
                });
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }

    requestPassword (result) {

        try {
            
            sql.beginTransaction((error) => {

                if (error) throw error;
    
                const now = new Date();
                const token = { id: random.id(), expires: now.addHours(process.env.TOKEN_EXPIRES) };
            
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

                        sql.commit();
                        if (results.changedRows > 0)
                            return result(token);

                        result(null);
                    });
                });
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }

    setPassword (result) {

        try {

            sql.beginTransaction((error) => {

                if (error) throw error;

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
            
                        sql.commit();
                        result(results.changedRows > 0);
                    });
                });

            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }

    remove (result) {

        try {

            sql.beginTransaction((error) => {

                if (error) throw error;

                sql.query(`UPDATE FROM users
                            SET inactive = 1 
                            WHERE id = ?`,
                [this.id],
            
                (error, results, field) => {
            
                    if (error) throw error;
            
                    sql.commit();
                    result(results.changedRows > 0);
                });

            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }
}

module.exports = User ;