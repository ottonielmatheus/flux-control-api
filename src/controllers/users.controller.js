const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.login = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.login((result) => {

            if (result) {

                const token = jwt.sign({
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        role: result.role
                    },
                    process.env.JWT_KEY, 
                    { expiresIn: process.env.JWT_EXPIRES }
                );
                
                return res.status(200).send({ token: token, message: "user_authenticated" });
            }

            res.status(401).send({ message: "wrong_credentials" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }

};

exports.get = (req, res, next) => {

    try {

        const model = new User(req.params);

        model.get((result) => {

            if (result)
                return res.status(200).send({ user: result });
            
            res.status(404).send({ message: "user_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.load = (req, res, next) => {

    try {

        const model = new User({});

        model.load((result) => {

            if (result.length) 
                return res.status(200).send({ items: result });
            
            res.status(404).send({ message: "no_user_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.add = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.add((result) => {

            if (result)
                return res.status(201).send({ user_added: result });
            
            res.status(406).send({ message: "invalid_user" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.change = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.change((result) => {

            if (result)
                return res.status(202).send({ message: "user_changed" });
            
            res.status(304).send({ message: "user_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.setToken = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.setToken((result) => {
        
            if (result) 
                return res.status(202).send({ message: "token_generated" });

            res.status(304).send({ message: "token_not_generated" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.setPassword = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.setPassword((result) => {

            if (result) 
                return res.status(202).send({ message: "password_defined" });
            
            res.status(304).send({ message: "password_not_defined" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.remove = (req, res, next) => {

    try {

        const model = new User(req.params);

        model.remove((result) => {

            if (result) 
                return res.status(202).send({ message: "user_deleted" });
            
            res.status(304).send({ message: "user_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};