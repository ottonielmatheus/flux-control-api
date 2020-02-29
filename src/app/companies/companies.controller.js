const fs = require('fs');
const cloudinary = require('../../integrations/cloudinary.api');
const Company = require('./company.model');

exports.get = (req, res, next) => {
    
    try {

        const model = new Company(req.params);

        model.get((company, error) => {

            if (error) throw error;

            if (company) 
                return res.status(200).send({ company: company });
            
            res.status(404).send({ message: "company_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.fleet = (req, res, next) => {

    try {

        const model = new Company(req.params);

        model.fleet((fleet, error) => {

            if (error) throw error;

            if (fleet.length)
                return res.status(200).send({ fleet: fleet });
            
            res.status(404).send({ message: "company_doesnt_have_fleet" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.load = (req, res, next) => {

    try {

        const model = new Company({});

        model.load((companies, error) => {

            if (error) throw error;

            if (companies.length) 
                return res.status(200).send({ items: companies });
            
            res.status(404).send({ message: "no_company_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.add = (req, res, next) => {

    try {

        const img = req.file;

        cloudinary.uploader.upload(img.path, (error, result) => {

            if (error) throw error;

            req.body.thumbnail = result.url;
            const model = new Company(req.body);

            model.add((company, error) => {

                if (error) throw error;

                if (company)
                    return res.status(201).send({ company_added: company });
                
                res.status(406).send({ message: "invalid_company" }); 
            });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message || ex });
    }

    finally {
        if (req.file.path) fs.unlinkSync(req.file.path);
    }
};

exports.change = (req, res, next) => {

    try {

        const model = new Company(req.body);

        model.change((done, error) => {

            if (error) throw error;

            if (done)
                return res.status(202).send({ message: "company_changed" });
            
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

        model.remove((done, error) => {

            if (error) throw error;

            if (done)
                return res.status(202).send({ message: "company_deleted" });
            
            res.status(304).send({ message: "company_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};