const mysql = require('../mysql').pool;

const get = (req, res, next) => {

	try {
        
        mysql.getConnection((error, conn) => {

            if (error) throw new Error(error);
    
            conn.query('SELECT * FROM companies WHERE id = ?',
            [req.params.id],
            
            (error, results, field) => {
                
                conn.release();                
                if (error) throw new Error(error);
    
                return res.status(200).send({ 
                    company: results[0]
                }); 
            });
        });
    }

    catch (ex) {
        return res.status(500).send({ error: ex });
    }
};

const search = (req, res, next) => {

    try {

        mysql.getConnection((error, conn) => {

            if (error) throw new Error(error);
    
            conn.query(`SELECT * FROM companies`,
            (error, results, field) => {
    
                conn.release();
                if (error) throw new Error(error); 
    
                return res.status(200).send({ 
                    items: results 
                });
            });
        });
    }

    catch (ex) {
        return res.status(500).send({ error: ex });
    }
};

const add = (req, res, next) => {

	try {

        mysql.getConnection((error, conn) => {

            if (error) throw new Error(error);

            conn.query('INSERT INTO companies (name, thumbnail, created_at) VALUES (?, ?, ?)',
            [req.body.name, req.body.thumbnail, new Date()],
            
            (error, results, field) => {
                
                conn.release();
                if (error) throw new Error(error);

                return res.status(201).send({
                    message: "company_created",
                    company_id: results.resultId
                });
            });
        });
    }

    catch (ex) {
        return res.status(500).send({ error: ex });
    }
};

const change = (req, res, next) => {

	try {

        mysql.getConnection((error, conn) => {

            if (error) throw new Error(error);
    
            conn.query(`UPDATE companies
                        SET name = ?, thumbnail = ?
                        WHERE id = ?`,
            [req.body.name, req.body.thumbnail, req.params.id],
            
            (error, results, field) => {
    
                conn.release();
                if (error) throw new Error(error);

                return res.status(202).send({
                    message: "company_updated"
                });
            });
        });
    }

    catch (ex) {
        return res.status(500).send({ error: ex });
    }
};

const remove = (req, res, next) => {

    try {
        
        mysql.getConnection((error, conn) => {

            if (error) throw new Error(error);
    
            conn.query(`DELETE FROM companies WHERE id = ?`,
            [req.params.id],
    
            (error, results, field) => {
    
                conn.release();
                if (error) throw new Error(error);

                return res.status(202).send({
                    message: "company_deleted" 
                });
            });
        });
    }

    catch (ex) {
        return res.status(500).send({ error: ex });
    }
};

exports.get = get;
exports.search = search;
exports.add = add;
exports.change = change;
exports.remove = remove;