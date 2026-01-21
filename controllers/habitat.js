const express = require('express');
const router = express.Router();

const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    let habitats = await Habitat.find();
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

// router.put('/', async (req, res) => {
//     try {
//         req.body.name.toLowerCase();
//         const habitatExists = await Habitat.findOne({name: req.body.name})
//         console.log('This is the req.body', req.body.name)
//         console.log('This habitat exists', habitatExists)
//         if (!habitatExists) {
//         //     req.body.country = req.session.user.country
//         // } else {
//         const newHabitat = new Habitat(req.body)
//         req.body.country = req.session.user.country
//         req.body
//         newHabitat.save();
//         console.log('This is the new habitat', newHabitat)
//         }
//     } catch (error) {
//         console.log(error);
//         res.redirect('/');
//     }
// })

module.exports = router