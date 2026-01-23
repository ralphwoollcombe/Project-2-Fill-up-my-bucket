const express = require('express');
const router = express.Router();

const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');
const List = require('../models/list.js');


router.get('/', async (req, res) => {
    try {
    let habitats = await Habitat.find({});
    habitats.forEach(habitat => {habitat.displayName = habitat.name.charAt(0).toUpperCase() + habitat.name.slice(1)})
    res.render('habitat/index.ejs', {
        habitats: habitats,
        user: req.session.user
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    } 
});

router.post('/', async (req, res) => {
    try {
        const habitatName = req.body.name.toLowerCase();
        const userCountryId = req.session.user.country
        const habitatExists = await Habitat.findOne({name: habitatName})
        if (habitatExists) {
            habitatExists.country.push(userCountryId);
            habitatExists.save();
        } else {
        const newHabitat = await Habitat.create({
            name: req.body.name,
            country: [userCountryId],
        });
        }
        res.redirect('/habitat')
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

router.get('/:habitatId',async (req, res) => {
    const habitat = await Habitat.findById(req.params.habitatId)
    habitat.displayName = habitat.name.charAt(0).toUpperCase() + habitat.name.slice(1)
    const allSpecies = await List.find({
        habitat: req.params.habitatId,
        owner: res.locals.user._id
    })
    .populate('habitat')
    .populate('country')
    .populate('owner');
    const uniqueNames = [];
    allSpecies.forEach(bird => {
        if (!uniqueNames.includes(bird.name)) {
            uniqueNames.push(bird.name);
        };
    });
    const species = uniqueNames.map(bird => ({
        name: bird.trim().split(' ').join('-'),
        displayName: bird.charAt(0).toUpperCase() + bird.slice(1)
    }));
    res.render('habitat/show.ejs', {
        species: species,
        habitat: habitat
    });
})

module.exports = router