const User = require('../models/user.model');

exports.get = (req, res, next) => {

    try {

        User.get(req.params.id, (result) => {

            if (result) res.status(200).send({ user: result });
            
            res.status(404).send({ message: "user_not_found" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.search = (req, res, next) => {

    try {

        User.search((result) => {

            if (result) res.status(200).send({ items: result });
            
            res.status(404).send({ message: "no_user_registered" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.add = (req, res, next) => {

    try {

        User.add(new User(req.body), (result) => {

            if (result) res.status(201).send({ user_added: result });
            
            res.status(406).send({ message: "invalid_user" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.change = (req, res, next) => {

    try {

        User.change(new User(req.body), (result) => {

            if (result) res.status(202).send({ message: "user_changed" });
            
            res.status(304).send({ message: "user_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.setPassword = (req, res, next) => {

    try {

        User.setPassword(new User(req.body), (result) => {

            if (result) res.status(202).send({ message: "password_defined" });
            
            res.status(304).send({ message: "password_not_defined" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};

exports.remove = (req, res, next) => {

    try {

        User.remove(req.params.id, (result) => {

            if (result) res.status(202).send({ message: "user_deleted" });
            
            res.status(304).send({ message: "user_not_deleted" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex });
    }
};