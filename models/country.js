const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true
    },   
      habitat: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitat',
  }]
});

const Country = mongoose.model('Country', countrySchema)
module.exports = Country;