const express = require('express');
const router = express.Router();

const List = require('../models/list');
const User = require('../models/user');
const Country = require('../models/country');
const Habitat = require('../models/habitat');

router.get('/', async (req, res) => {
    try {
    const getHitListItems = await List.find({seen: false}). populate('owner');
    console.log('all hit list items', getHitListItems);
    res.render('hit-list/index.ejs', {
        listItems: getHitListItems,
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    }   
});

router.get('/new', async (req, res) => {
    const country = await Country.find();
    const habitat = await Habitat.find();
    res.render('hit-list/new.ejs', {country, habitat});
});

router.post('/', async (req, res) => {
    try {
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
            console.log('Permission granted')
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
        const listItem = await List.findById(req.params.listId);
        console.log('Hit-List Item ID', req.params.listId)
        res.render('hit-list/edit.ejs', {
            listItem: listItem,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
})
router.put('/:listId/edit', async (req, res) => {
  try {
    const listItem = await List.findById(req.params.listId);
    if (listItem.owner.equals(req.session.user._id)) {
      await listItem.updateOne(req.body);
      listItem.seen = true;
      res.redirect('/list');
      console.log('This item is now spotted', listItem)
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router