const mongoose = require('mongoose');

const habitatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    country: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    }]   
});

const Habitat = mongoose.model('Habitat', habitatSchema)

module.exports = Habitat;