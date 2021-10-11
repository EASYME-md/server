require('dotenv').config();

const express = require('express');
const cors = require('cors');

require('./config/db');

const invalidUrlError = require('./middlewares/invalidUrlError');
const handleError = require('./middlewares/handleError');
const contents = require('./routes/contents');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  credentials: true,
}));

app.use('/d', contents);

app.use(invalidUrlError);
app.use(handleError);

module.exports = app;
