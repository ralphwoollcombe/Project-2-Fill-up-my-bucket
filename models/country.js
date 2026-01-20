const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },   
});

const Country = mongoose.model('country', countrySchema)
module.exports = Country;