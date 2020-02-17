const sql = require('../models/database');

// constructor
const Vehicle = function (vehicle) {
    
    this.id = vehicle.id;
    this.number = vehicle.number;
    this.license_plate = vehicle.license_plate;
    this.company_id = vehicle.company_id;
    this.created_at = vehicle.created_at;
    this.inactive = vehicle.inactive;
}

Vehicle.get = (id, result) => {

    sql.query(`SELECT * FROM vehicles WHERE id = ?`,
    [id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results[0]);
        
    });
};

Vehicle.search = (result) => {

    sql.query(`SELECT * FROM vehicles`,
    (error, results, field) => {

        if (error) throw error;
        
        result(results);
    });
};

Vehicle.add = (vehicle, result) => {

    sql.query(`INSERT INTO vehicles 
                (number, license_plate, company_id, created_at)
                VALUES (?, ?, ?, ?)`,
    [
        vehicle.number,
        vehicle.license_plate,
        vehicle.company_id,
        new Date()
    ],
    
    (error, results, field) => {

        if (error) throw error;

        result({
            id: results.insertId,
            number: vehicle.number,
            license_plate: vehicle.license_plate,
            company_id: vehicle.company_id,
            created_at: vehicle.created_at
        });
    });
};

Vehicle.change = (vehicle, result) => {

    sql.query(`UPDATE vehicles
                SET number = ?, license_plate = ?
                WHERE id = ?`,
    [vehicle.number, vehicle.license_plate, vehicle.id],
    
    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

Vehicle.remove = (id, result) => {

    if (error) throw error;

    sql.query(`UPDATE FROM vehicles
                SET inactive = 1 
                WHERE id = ?`,
    [id],

    (error, results, field) => {

        if (error) throw error;

        result(results.changedRows > 0);
    });
};

module.exports = Vehicle;