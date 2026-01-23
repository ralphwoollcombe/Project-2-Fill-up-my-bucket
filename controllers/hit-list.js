const express = require('express');
const router = express.Router();

const List = require('../models/list.js');
const User = require('../models/user.js');
const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    const getHitListItems = await List.find({
        seen: false,
        owner: res.locals.user._id
    }). populate('owner');
    res.render('hit-list/index.ejs', {
        listItems: getHitListItems,
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    }   
});

router.get('/new', async (req, res) => {
    const countries = await Country.find();
    const habitats = await Habitat.find();
    res.render('hit-list/new.ejs', {
        countries, 
        habitats,
        user: req.session.user
    });
});

router.post('/', async (req, res) => {
    try {
        const country = await Country.findOne({name: req.body.country})
        req.body.country = [country._id]
        req.body.location = 'No located yet'
        req.body.date = new Date();
        const newListItem = new List(req.body);
        newListItem.owner = req.session.user._id;
        newListItem.seen = false;
        console.log(newListItem);
        newListItem.save();
        res.redirect('/hit-list');
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.delete('/:listId', async (req, res) => {
    try {
        const listItem = await List.findById(req.params.listId);
        if (listItem.owner.equals(req.session.user._id)) {
            await listItem.deleteOne();
            res.redirect('/hit-list')
        } else {
            res.send('You do not have the permission to delete this Species')
        }
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
});

router.get('/:listId/edit', async (req, res) => {
    try {
        const countries = await Country.find();
        const habitats = await Habitat.find();
        const listItem = await List.findById(req.params.listId);
        console.log('Hit-List Item ID', req.params.listId)
        res.render('hit-list/edit.ejs', {
            listItem: listItem,
            countries,
            habitats,
            user: req.session.user
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
})

router.put('/:listId', async (req, res) => {
  try {
        const country = await Country.findOne({name: req.body.country})
        const habitat = await Habitat.findOne({name: req.body.habitat})
        const listItem = await List.findById(req.params.listId);
    if (listItem.owner.equals(req.session.user._id)) {
    req.body.seen = true;
    req.body.country = [country._id]
    req.body.habitat = [habitat._id];
    await listItem.updateOne(req.body);
      res.redirect('/list');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router