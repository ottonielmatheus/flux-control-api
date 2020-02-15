const Company = require('../models/company.model');

exports.get = (req, res, next) => {
    
    try {

        Company.get(req.params.id, (result) => {

            if (result) res.status(200).send({ company: result });
            
            res.status(404).send({ message: "company_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.search = (req, res, next) => {

    try {

        Company.search((result) => {

            if (result) res.status(200).send({ items: result });
            
            res.status(404).send({ message: "no_company_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.add = (req, res, next) => {

    try {

        Company.add(new Company(req.body), (result) => {

            if (result) res.status(201).send({ company_added: result });
            
            res.status(406).send({ message: "invalid_company" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.change = (req, res, next) => {

    try {

        Company.change(new Company(req.body), (result) => {

            if (result) res.status(202).send({ message: "company_changed" });
            
            res.status(304).send({ message: "company_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.remove = (req, res, next) => {

    try {

        Company.remove(req.params.id, (result) => {

            if (result) res.status(202).send({ message: "company_deleted" });
            
            res.status(304).send({ message: "company_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};