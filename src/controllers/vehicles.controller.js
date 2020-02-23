const Vehicle = require('../models/vehicle.model');

exports.search = (req, res, next) => {

    try {

        let filterCompanies;

        if (req.query.company)
            filterCompanies = [...req.query.company];
        
        const model = new Vehicle({});

        model.search(req.query.query, filterCompanies, (result) => {

            if (result.length)
                return res.status(200).send({ items: result });

            res.status(404).send({ message: "vehicle_not_found" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.get = (req, res, next) => {
    
    try {

        const model = new Vehicle(req.params);

        model.get((result) => {

            if (result)
                return res.status(200).send({ vehicle: result });

            res.status(404).send({ message: "vehicle_not_found" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.load = (req, res, next) => {

    try {

        const model = new Vehicle({});

        model.load((result) => {
            
            if (result.length)
                return res.status(200).send({ items: result });

            res.status(404).send({ message: "no_vehicle_registered" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.add = (req, res, next) => {

    try {

        const model = new Vehicle(req.body);

        model.add((result) => {

            if (result)
                return res.status(201).send({ vehicle_added: result });
            
            res.status(406).send({ message: "invalid_vehicle" });

        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.garage = (req, res, next) => {
    
    try {

        const model = new Vehicle({});

        model.garage((result) => {

            if (result)
                return res.status(200).send({ items: result });
            
            res.status(404).send({ message: "empty_garage" });

        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.arrival = (req, res, next) => {

    try {

        const model = new Vehicle(req.params);

        model.arrival(req.context.id, (result) => {

            if (result)
                return res.status(201).send({ message: "arrival_registered" });
            
            res.status(406).send({ message: "arrival_not_registered" });

        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.departure = (req, res, next) => {
    
    try {

        const model = new Vehicle(req.params);

        model.departure(req.context.id, (result) => {

            if (result) 
                return res.status(201).send({ message: "departure_registered" });
            
            res.status(406).send({ message: "departure_not_registered" });

        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.change = (req, res, next) => {

    try {

        const model = new Vehicle(req.body);

        model.change((result) => {

            if (result)
                return res.status(202).send({ message: "vehicle_changed" });
            
            res.status(304).send({ message: "vehicle_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.remove = (req, res, next) => {

    try {

        const model = new Vehicle(req.params);

        model.remove((result) => {

            if (result)
                return res.status(202).send({ message: "vehicle_deleted" });
            
            res.status(304).send({ message: "vehicle_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};