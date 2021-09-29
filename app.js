require('dotenv').config();

const express = require('express');

require('./config/db');

const invalidUrlError = require('./middlewares/invalidUrlError');
const handleError = require('./middlewares/handleError');
const indexRouter = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.use(invalidUrlError);
app.use(handleError);

module.exports = app;
