const jwt = require('jsonwebtoken');

module.exports = (...roles) => {
    return (req, res, next) => {

        try {

            const token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_KEY);

            if (!roles.length || roles.includes(decode.role)) {
                req.session = decode;
                next();
            }

            else
                res.status(403).send({ message: "user_not_authorized" });
        }

        catch (ex) {
            res.status(401).send({ message: "user_not_authenticated" });
        }
    }
};