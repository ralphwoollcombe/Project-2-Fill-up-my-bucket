const express = require('express');
const router = express.Router();

const List = require('../models/list.js');
const User = require('../models/user.js');
const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    const allSpecies = await List.distinct('name');
    console.log(allSpecies);
    res.render('species/index.ejs', {species: allSpecies});
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/:speciesName', async (req, res) => {
    try {
    const species = await List.find({name: req.params.speciesName});
    species.forEach(bird => {bird.displayName = bird.name.charAt(0).toUpperCase() + bird.name.slice(1)});
    console.log(species);
    res.render('species/show.ejs', {species: species});
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})
module.exports = router