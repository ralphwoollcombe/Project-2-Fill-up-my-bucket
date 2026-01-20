const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    date: {
        type: Date,
    },
    habitat:  {
        type: String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Habitat',
        // required: true,
    },
    country: {
        type: String
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Country',
        // required: true,
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