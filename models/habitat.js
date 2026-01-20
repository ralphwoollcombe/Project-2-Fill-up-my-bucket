const mongoose = require('mongoose');

const habitatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },   
    country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  }
});

const Habitat = mongoose.model('habitat', habitatSchema)
module.exports = Habitat;