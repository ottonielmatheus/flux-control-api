const sql = require('./database');

class Vehicle {
    
    constructor (vehicle) {

        this.id = vehicle.id;
        this.number = vehicle.number;
        this.license_plate = vehicle.license_plate;
        this.company_id = vehicle.company_id;
        this.created_at = vehicle.created_at;
        this.inactive = vehicle.inactive;
    }

    get (result) {

        sql.query(`SELECT * FROM vehicles WHERE id = ?`,
        [this.id],
        
        (error, results, field) => {
    
            if (error) throw error;
            
            return result(new Vehicle(results[0]));
        });
    }

    search (result) {

        sql.query(`SELECT * FROM vehicles`,
        (error, results, field) => {
    
            if (error) throw error;
            
            result(results);
        });
    }

    add (result) {

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
    
            result({
                id: results.insertId,
                number: this.number,
                license_plate: this.license_plate,
                company_id: this.company_id,
                created_at: this.created_at
            });
        });
    }

    garage (result) {

        sql.query(`SELECT vehicles.* FROM vehicles
                    INNER JOIN flow_records
                    ON flow_records.vehicle_id = vehicles.id
                    WHERE flow_records.arrival_id IS NOT NULL
                    AND flow_records.departure_id IS NULL`,
        
        (error, results, field) => {
    
            if (error) throw error;
    
            result(results.map(vehicle => new Vehicle(vehicle)));
        });
    }

    arrival (userId, result) {

        this.garage((garage) => {

            const inGarage = garage.some(vehicle => vehicle.id == this.id);

            if (inGarage) return result(false);

            sql.query(`INSERT INTO records (moment, user_id)
                        VALUES (?, ?)`,
            [new Date(), userId],
            
            (error, results, field) => {
        
                if (error) throw error;

                sql.query(`INSERT INTO flow_records (arrival_id, vehicle_id)
                            VALUES (?, ?)`,
                [results.insertId, this.id],
                
                (error, results, field) => {

                    if (error) throw error;

                    result(results.affectedRows > 0);
                });
            });
        });
    }

    departure (userId, result) {

        this.garage((garage) => {
            
            const inGarage = garage.some(vehicle => vehicle.id == this.id);
        
            if (!inGarage) return result(false);
    
            sql.query(`INSERT INTO records (moment, user_id)
                        VALUES (?, ?)`,
            [new Date(), userId],
            
            (error, results, field) => {
        
                if (error) throw error;
        
                sql.query(`UPDATE flow_records 
                            SET departure_id = ?
                            WHERE vehicle_id = ?
                            AND departure_id IS NULL`,
                [results.insertId, this.id],
                
                (error, results, field) => {

                    if (error) throw error;

                    result(results.changedRows > 0);
                });
            });
        });
    }

    change (result) {

        sql.query(`UPDATE vehicles
                    SET number = ?, license_plate = ?
                    WHERE id = ?`,
        [this.number, this.license_plate, this.id],
        
        (error, results, field) => {
    
            if (error) throw error;
    
            result(results.changedRows > 0);
        });
    }

    remove (result) {

        if (error) throw error;
    
        sql.query(`UPDATE FROM vehicles
                    SET inactive = 1 
                    WHERE id = ?`,
        [this.id],
    
        (error, results, field) => {
    
            if (error) throw error;
    
            result(results.changedRows > 0);
        });
    }
}

module.exports = Vehicle;