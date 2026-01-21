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
        required: true
    },
    date: {
        type: Date,
    },
    habitat:  [{
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habitat',
    }],
    country: [{
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
    }],
    numberSeen: {
        type: Number,
        min: 1,
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