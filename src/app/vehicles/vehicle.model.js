const sql = require('../../db/database');

class Vehicle {

    constructor (vehicle) {

        this.id = vehicle.id;
        this.number = vehicle.number;
        this.license_plate = vehicle.license_plate ? vehicle.license_plate.toUpperCase() : null;

        if (vehicle.arrival_moment || vehicle.departure_moment) {

            this.last_record = {
                moment: vehicle.departure_moment || vehicle.arrival_moment,
                onGarage: !vehicle.departure_moment
            };
        }

        else
            this.last_record = null;

        this.company_id = vehicle.company_id;
        this.created_at = vehicle.created_at;
        this.inactive = vehicle.inactive;
    }

    search (query, result) {

        try {

            sql.query(`SELECT v.*,
                        MAX(fr.arrival_moment) arrival_moment,
                        IF(MAX(fr.departure_moment) > MAX(fr.arrival_moment), MAX(fr.departure_moment), NULL) departure_moment
                        FROM vehicles v
                        LEFT JOIN (
                            SELECT *
                            FROM flow_records
                        ) fr ON fr.vehicle_id = v.id
                        WHERE (v.license_plate LIKE ? OR v.number LIKE ?)
                        AND v.inactive = 0
                        GROUP BY v.id`,
            [`%${query}%`, `%${query}%`],

            (error, results, field) => {

                if (error) throw error;

                return result(results.map(vehicle => new Vehicle(vehicle)));
            });
        }

        catch (ex) {
            result(null, err);
        }
    }

    get (result) {

        try {

            sql.query(`SELECT v.*,
                        MAX(fr.arrival_moment) arrival_moment,
                        IF(MAX(fr.departure_moment) > MAX(fr.arrival_moment), MAX(fr.departure_moment), NULL) departure_moment
                        FROM vehicles v
                        LEFT JOIN (
                            SELECT *
                            FROM flow_records
                        ) fr ON fr.vehicle_id = v.id
                        WHERE v.id = ?
                        GROUP BY v.id`,
            [this.id],

            (error, results, field) => {

                if (error) throw error;

                const vehicle = results[0];

                if (vehicle)
                    return result(new Vehicle(vehicle));

                result(null);
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    load (result) {

        try {

            sql.query(`SELECT v.*,
                        MAX(fr.arrival_moment) arrival_moment,
                        IF(MAX(fr.departure_moment) > MAX(fr.arrival_moment), MAX(fr.departure_moment), NULL) departure_moment
                        FROM vehicles v
                        LEFT JOIN (
                            SELECT *
                            FROM flow_records
                        ) fr ON fr.vehicle_id = v.id
                        WHERE v.inactive = 0
                        GROUP BY v.id`,
            (error, results, field) => {

                if (error) throw error;

                result(results.map(vehicle => new Vehicle(vehicle)));
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

                sql.query(`INSERT INTO vehicles
                            (number, license_plate, company_id, created_at)
                            VALUES (?, ?, ?, ?)`,
                [
                    this.number,
                    this.license_plate,
                    this.company_id,
                    new Date()
                ],

                (error, results, field) => {

                    if (error) throw error;

                    sql.commit();
                    result({
                        id: results.insertId,
                        number: this.number,
                        license_plate: this.license_plate,
                        company_id: this.company_id,
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

    garage (result) {

        try {

            sql.query(`SELECT v.*,
                MAX(fr.arrival_moment) arrival_moment,
                IF(MAX(fr.departure_moment) > MAX(fr.arrival_moment), MAX(fr.departure_moment), NULL) departure_moment
                FROM vehicles v
                LEFT JOIN (
                    SELECT *
                    FROM flow_records
                ) fr ON fr.vehicle_id = v.id
                WHERE fr.arrival_moment IS NOT NULL
                AND fr.departure_moment IS NULL
                AND v.inactive = 0
                GROUP BY v.id`,

            (error, results, field) => {

                if (error) throw error;

                result(results.map(vehicle => new Vehicle(vehicle)));
            });
        }

        catch (ex) {
            result(null, ex);
        }
    }

    arrival (userId, result) {

        try {

            this.garage((garage, error) => {

                if (error) throw error;

                const inGarage = garage.some(vehicle => vehicle.id == this.id);

                if (inGarage) return result(false);

                sql.beginTransaction((error) => {

                    if (error) throw error;

                    const moment = new Date();

                    sql.query(`INSERT INTO flow_records (arrival_moment, arrival_user, vehicle_id)
                                VALUES (?, ?, ?)`,
                    [moment, userId, this.id],

                    (error, results, field) => {

                        if (error) throw error;

                        sql.commit();
                        if (results.affectedRows > 0) result(moment);

                        return null;
                    });

                });
            });
        }

        catch (ex) {
            sql.rollback();
            result(null, ex);
        }
    }

    departure (userId, result) {

        try {

            this.garage((garage, error) => {

                if (error) throw error;

                const inGarage = garage.some(vehicle => vehicle.id == this.id);

                if (!inGarage) return result(false);

                sql.beginTransaction((error) => {

                    if (error) throw error;

                    const moment = new Date();

                    sql.query(`UPDATE flow_records
                                SET departure_moment = ?,
                                departure_user = ?
                                WHERE vehicle_id = ?
                                AND departure_moment IS NULL`,
                    [moment, userId, this.id],

                    (error, results, field) => {

                        if (error) throw error;

                        sql.commit();
                        if (results.changedRows > 0) return result(moment);

                        return null;
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

                sql.query(`UPDATE vehicles
                            SET number = ?, license_plate = ?
                            WHERE id = ?`,
                [this.number, this.license_plate, this.id],

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

            sql.beginTransaction((error) => {

                if (error) throw error;

                sql.query(`UPDATE FROM vehicles
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

module.exports = Vehicle;