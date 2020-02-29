const jwt = require('jsonwebtoken');
const mailer = require('../../utils/mailer');
const User = require('./user.model');

exports.login = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.login((user, error) => {

            if (error) throw error;

            if (user) {

                const token = jwt.sign({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
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

        model.get((user, error) => {

            if (error) throw error;

            if (user)
                return res.status(200).send({ user: user });
            
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

        model.load((users, error) => {

            if (error) throw error;

            if (users.length) 
                return res.status(200).send({ items: users });
            
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

        model.add((user, error) => {

            if (error) throw error;

            if (user)
                return res.status(201).send({ user_added: user });
            
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

        model.change((done, error) => {

            if (error) throw error;

            if (done)
                return res.status(202).send({ message: "user_changed" });
            
            res.status(304).send({ message: "user_not_changed" }); 
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.requestPassword = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.requestPassword((token, error) => {
        
            if (error) throw error;

            if (token) {

                mailer.sendMail({
                    from: process.env.SYSTEM_EMAIL,
                    to: model.email,

                    subject: `${ model.name } - Alterar Senha`,
                    text: `Parece que alguém solicitou uma nova senha para você. \n\n` +
                        `Por-favor, acesse ${ process.env.HOSTNAME }/newpassword/${ token.id }` +
                        ` em até ${ process.env.TOKEN_EXPIRES } horas para definir sua nova senha.`
                },
                
                (error, info) => {

                    if (error) throw error;

                    return res.status(202).send({ message: "email_sended" });
                });                
            }

            else
                res.status(304).send({ message: "email_not_sended" });
            
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};

exports.setPassword = (req, res, next) => {

    try {

        const model = new User(req.body);

        model.setPassword((done, error) => {

            if (error) throw error;

            if (done) 
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

        model.remove((result, error) => {

            if (error) throw error;

            if (done) 
                return res.status(202).send({ message: "user_deleted" });
            
            res.status(304).send({ message: "user_not_deleted" });
        });
    }

    catch (ex) {
        res.status(500).send({ error: ex.message });
    }
};