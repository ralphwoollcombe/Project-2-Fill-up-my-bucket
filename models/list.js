const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    class: {
        type: String,
        required: true,
    },
    description: {
        type: String,

    },
     behaviour: {
        type: String,
    },
    location: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    habitat:  [{
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habitat',
        required: true,
    }],
    country: [{
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true,
    }],
    numberSeen: {
        type: Number,
        min: 1,
        max: 50
    }, 
    seen: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const List = mongoose.model('List', listSchema)
module.exports = List;