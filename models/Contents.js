const mongoose = require('mongoose');

const contentsSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  linkId: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('Contents', contentsSchema);
