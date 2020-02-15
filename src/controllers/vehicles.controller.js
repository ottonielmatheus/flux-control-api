const Vehicle = require('../models/vehicle.model');

exports.get = (req, res, next) => {
    
    try {

        Vehicle.get(req.params.id, (result) => {

            if (result) res.status(200).send({ vehicle: result });

            res.status(404).send({ message: "vehicle_not_found" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.search = (req, res, next) => {

    try {

        Vehicle.search((result) => {
            
            if (result) res.status(200).send({ items: result });

            res.status(404).send({ message: "no_vehicle_registered" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.add = (req, res, next) => {

    try {

        Vehicle.add(new Vehicle(req.body), (result) => {

            if (result) res.status(201).send({ vehicle_added: result });
            
            res.status(406).send({ message: "invalid_vehicle" });

        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.change = (req, res, next) => {

    try {

        Vehicle.change(new Vehicle(req.body), (result) => {

            if (result) res.status(202).send({ message: "vehicle_changed" });
            
            res.status(304).send({ message: "vehicle_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.remove = (req, res, next) => {

    try {

        Vehicle.remove(req.params.id, (result) => {

            if (result) res.status(202).send({ message: "vehicle_deleted" });
            
            res.status(304).send({ message: "vehicle_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};