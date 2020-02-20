const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const app = express();

const companies = require('./routes/companies.route');
const vehicles = require('./routes/vehicles.route');
const users = require('./routes/users.route');
const flowRecords = require('./routes/flows-records.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/companies', companies);
app.use('/api/vehicles', vehicles);
app.use('/api/users', users);
app.use('/api/flow/records', flowRecords);

app.use((req, res, next) => {

    const error = {
        status: 404,
        message: 'not_found'
    };

    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).send({ error: error.message });
});

module.exports = app;