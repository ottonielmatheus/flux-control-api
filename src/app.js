const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const app = express();

const companies = require('./app/companies/companies.route');
const vehicles = require('./app/vehicles/vehicles.route');
const users = require('./app/users/users.route');
const flowRecords = require('./app/flow-records/flows-records.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    next();
});

app.use('/uploads', express.static('uploads'));
app.use('/api/companies', companies);
app.use('/api/vehicles', vehicles);
app.use('/api/users', users);
app.use('/api/flow-records', flowRecords);

app.use((req, res, next) => {
    res.status(404).send({ message: 'route_not_found' });
});

module.exports = app;