const sql = require('../../db/database');
const Vehicle = require('../vehicles/vehicle.model');

class Company {

    constructor (company) {

        this.id = company.id;
        this.name = company.name;
        this.thumbnail = company.thumbnail;
        this.color = company.color ? company.color.toUpperCase() : null;
        this.created_at = company.created_at;
        this.inactive = company.inactive;
    }

    fleet (result) {

        try {

            sql.query(`SELECT v.*,
                        MAX(fr.arrival_moment) arrival_moment,
                        IF(MAX(fr.departure_moment) > MAX(fr.arrival_moment), MAX(fr.departure_moment), NULL) departure_moment
                        FROM vehicles v
                        LEFT JOIN (
                            SELECT *
                            FROM flow_records
                        ) fr ON fr.vehicle_id = v.id
                        WHERE v.company_id = ?
                        AND v.inactive = 0
                        GROUP BY v.id`,
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