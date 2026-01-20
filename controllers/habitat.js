const express = require('express');
const router = express.Router();

const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    const getHabitats = await Habitat.find();
    console.log('all habitats', getHabitats);
    res.render('habitat/index.ejs', {
        habitats: getHabitats,
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    }   
});

module.exports = router