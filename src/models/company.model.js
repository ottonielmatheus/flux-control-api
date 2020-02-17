const sql = require('../models/database');

// constructor
const Company = function (company) {
    
    this.id = company.id;
    this.name = company.name;
    this.thumbnail = company.thumbnail;
    this.color = company.color;
    this.created_at = company.created_at;
    this.inactive = company.inactive;
}

Company.get = (id, result) => {

    sql.query(`SELECT * FROM companies WHERE id = ?`,
    [id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results[0]);
        
    });
};

Company.search = (result) => {

    sql.query(`SELECT * FROM companies`,
    (error, results, field) => {

        if (error) throw error;
        
        result(results);
    });
};

Company.add = (company, result) => {

    sql.query(`INSERT INTO companies 
                (name, thumbnail, color, created_at)
                VALUES (?, ?, ?, ?, ?, ?)`,
    [
        company.name,
        company.thumbnail,
        company.color,
        new Date()
    ],
    
    (error, results, field) => {

        if (error) throw error;

        result({
            id: results.insertId,
            name: company.name,
            thumbnail: company.thumbnail,
            color: company.color
        });
    });
};

Company.change = (company, result) => {

    sql.query(`UPDATE companies
                SET name = ?, thumbnail = ?, color = ?
                WHERE id = ?`,
    [company.name, company.thumbnail, company.color, company.id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

Company.remove = (id, result) => {

    if (error) throw error;

    sql.query(`UPDATE FROM companies
                SET inactive = 1 
                WHERE id = ?`,
    [id],

    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

module.exports = Company;