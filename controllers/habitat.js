const express = require('express');
const router = express.Router();

const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');
const List = require('../models/list.js');


router.get('/', async (req, res) => {
    try {
    let habitats = await Habitat.find({});
    habitats.forEach(habitat => {habitat.displayName = habitat.name.charAt(0).toUpperCase() + habitat.name.slice(1)})
    // console.log('all habitats', habitats);
    // console.log('session user', req.session.user)
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
        console.log('This is the req.body', habitatName)
        console.log('This habitat exists', habitatExists)
        if (habitatExists) {
            habitatExists.country.push(userCountryId);
            habitatExists.save();
        } else {
        // const newHabitat = new Habitat(req.body);
        // newHabitat.country.push(userCountryId);
        // newHabitat.save();
        const newHabitat = await Habitat.create({
            name: req.body.name,
            country: [userCountryId],
        });
        console.log('This is the new habitat', newHabitat)
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
    console.log('this is the habitat', habitat)
    const species = await List.find({
        habitat: req.params.habitatId,
        owner: res.locals.user._id
    })
    .populate('habitat')
    .populate('country')
    .populate('owner');
    console.log('species', species);
    res.render('habitat/show.ejs', {
        species: species,
        habitat: habitat
    });
})

module.exports = router