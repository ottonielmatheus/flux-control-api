const FlowRecord = require('../models/flow-record.model');

exports.get = (req, res, next) => {

    try {

        const model = new FlowRecord(req.params);

        model.get((result) => {

            if (result.id)
                return res.status(200).send({ flowRecord: result });
            
            res.status(404).send({ message: "record_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.search = (req, res, next) => {

    try {

        const model = new FlowRecord({});

        model.search((result) => {

            if (result)
                return res.status(200).send({ items: result });
            
            res.status(404).send({ message: "no_records_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.remove = (req, res, next) => {
    
    try {

        const model = new FlowRecord(req.params);

        model.remove((result) => {

            if (result)
                return res.status(202).send({ message: "record_deleted" });
            
            res.status(304).send({ message: "record_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};