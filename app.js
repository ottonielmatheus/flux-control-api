const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const companies = require('./routes/companies.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/companies', companies);

module.exports = app;