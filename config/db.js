const mongoose = require('mongoose');

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS;

mongoose.connect(MONGODB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log.bind(console, 'Connected to database....'));

module.exports = db;
