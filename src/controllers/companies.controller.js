const Company = require('../models/company.model');

exports.get = (req, res, next) => {
    
    try {

        const model = new Company(req.params);

        model.get((result) => {

            if (result.id) res.status(200).send({ company: result });
            
            res.status(404).send({ message: "company_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.search = (req, res, next) => {

    try {

        const model = new Company({});

        model.search((result) => {

            if (result) res.status(200).send({ items: result });
            
            res.status(404).send({ message: "no_company_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.add = (req, res, next) => {

    try {

        const model = new Company(req.body);

        model.add((result) => {

            if (result) res.status(201).send({ company_added: result });
            
            res.status(406).send({ message: "invalid_company" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.change = (req, res, next) => {

    try {

        const model = new Company(req.body);

        model.change((result) => {

            if (result) res.status(202).send({ message: "company_changed" });
            
            res.status(304).send({ message: "company_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.remove = (req, res, next) => {

    try {

        const model = new Company(req.params);

        model.remove((result) => {

            if (result) res.status(202).send({ message: "company_deleted" });
            
            res.status(304).send({ message: "company_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};