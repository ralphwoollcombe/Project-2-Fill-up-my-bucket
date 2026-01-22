const express = require('express');
const router = express.Router();

const List = require('../models/list.js');
const User = require('../models/user.js');
const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');



router.get('/', async (req, res) => {
    try {
    const allSpecies = await List.find({
        owner: res.locals.user._id
    })
    const uniqueNames = [...new Set(allSpecies.map(bird => bird.name))];
    console.log(uniqueNames)
    // await List.distinct('name');
    const species = uniqueNames.map(bird => ({
        name: bird.trim().split(' ').join('-'),
        displayName: bird.charAt(0).toUpperCase() + bird.slice(1)
    }));
    res.render('species/index.ejs', {species});
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/:speciesName', async (req, res) => {
    try {
    const speciesName = req.params.speciesName.trim().split('-').join(' ').toLowerCase();
    const species = await List.find({
        name: speciesName,
          owner: res.locals.user._id
    }).populate('habitat');
    species.forEach(bird => {
    const date = bird.date;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    bird.formattedDate = `${day}.${month}.${year}`
    })
    species.forEach(bird => {bird.displayName = bird.name.charAt(0).toUpperCase() + bird.name.slice(1)});
    console.log(species);
    const habitatArray = [];
    species.forEach((sighting, index) => { 
        sighting.habitat.forEach((habitat, index) => {
            if (!habitatArray.includes(habitat)) {
                habitatArray.push(habitat);
        }})
    })
    habitatArray.forEach(hab => {hab.displayName = hab.name.charAt(0).toUpperCase() + hab.name.slice(1)});
    // console.log('habitat array', habitatArray)
    res.render('species/show.ejs', {
        species: species,
        habitatArray
    });
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/:speciesName/new', async (req, res) => {
    const speciesName = req.params.speciesName.trim().split('-').join(' ').toLowerCase();    
    const countries = await Country.find();
    const habitats = await Habitat.find();
    const species = await List.findOne({name: speciesName})
    species.displayName = species.name.charAt(0).toUpperCase() + species.name.slice(1);
    console.log('this is the species', species)
    res.render(`species/new.ejs`, {countries, 
        habitats, 
        species});
});



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
        res.redirect(`/species/${req.params.speciesName}`);
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})
module.exports = router