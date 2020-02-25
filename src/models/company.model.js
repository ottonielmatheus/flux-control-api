const sql = require('./database');
const Vehicle = require('./vehicle.model');

class Company {
    
    constructor (company) {

        this.id = company.id;
        this.name = company.name;
        this.thumbnail = company.thumbnail;
        this.color = company.color;
        this.created_at = company.created_at;
        this.inactive = company.inactive;
    }

    fleet (result) {

        try {

            sql.query(`SELECT * FROM vehicles WHERE company_id = ? AND inactive = 0`,
            [this.id],
            
            (error, results, field) => {
        
                if (error) throw error;

                result(results.map(vehicle => new Vehicle(vehicle)));
            });
        }

        catch (ex) {
            result(null, ex);
        }
    };

    get (result) {

        try {

            sql.query(`SELECT * FROM companies WHERE id = ?`,
            [this.id],
            
            (error, results, field) => {
        
                if (error) throw error;
        
                const company = results[0];

                if (company)
                    return result(new Company(company));
                
                result(null);
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    load (result) {

        try {

            sql.query(`SELECT * FROM companies`,
            (error, results, field) => {
        
                if (error) throw error;
                
                result(results.map(company => new Company(company)));
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

                sql.query(`INSERT INTO companies 
                    (name, thumbnail, color, created_at)
                    VALUES (?, ?, ?, ?)`,
                [
                    this.name,
                    this.thumbnail,
                    this.color,
                    new Date()
                ],
                
                (error, results, field) => {
            
                    if (error) throw error;
            
                    sql.commit();
                    result({
                        id: results.insertId,
                        name: this.name,
                        thumbnail: this.thumbnail,
                        color: this.color
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

                sql.query(`UPDATE companies
                    SET name = ?, thumbnail = ?, color = ?
                    WHERE id = ?`,
                [this.name, this.thumbnail, this.color, this.id],
                
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

    remove (result) {

        try {

            if (error) throw error;
    
            sql.query(`UPDATE FROM companies
                        SET inactive = 1 
                        WHERE id = ?`,
            [this.id],
        
            (error, results, field) => {
        
                if (error) throw error;
        
                sql.commit();
                result(results.changedRows > 0);
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }
}

module.exports = Company;