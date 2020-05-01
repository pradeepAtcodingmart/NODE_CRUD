const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    text: String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Event', schema);
