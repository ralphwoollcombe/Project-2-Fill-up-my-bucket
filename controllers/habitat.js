const express = require('express');
const router = express.Router();

const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    let habitats = await Habitat.find();
    console.log('all habitats', habitats);
    console.log('session user', req.session.user)
    res.render('habitat/index.ejs', {
        habitats: habitats,
        user: req.session.user
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    } 
});

module.exports = router