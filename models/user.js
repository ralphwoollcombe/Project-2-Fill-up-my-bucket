const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  residentCountry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;