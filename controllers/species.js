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
router.get('/:speciesName/new', async (req, res) => {
    const speciesName = req.params.speciesName
    const country = await Country.find();
    const habitat = await Habitat.find();
    const species = await List.findOne({name: speciesName})
    species.displayName = species.name.charAt(0).toUpperCase() + species.name.slice(1);
    console.log('this is the species', species)
    res.render(`species/new.ejs`, {country, habitat, species});
});

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

router.post('/:speciesName', async (req, res) => {
    try {
       const country = await Country.findOne({name: req.body.country})
       const habitat = await Habitat.findOne({name: req.body.habitat})
       const species = await req.body.name
    //    console.log('this is the country', country)
    //    console.log('this is the habitat', habitat)
        req.body.country = [country._id]
        req.body.habitat = [habitat._id];
    //    console.log(req.body)
       const newListItem = new List(req.body);
        newListItem.owner = req.session.user._id;
        // console.log(newListItem);
        newListItem.save();
        res.redirect(`/species/${species}`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})
module.exports = router