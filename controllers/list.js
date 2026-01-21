const express = require('express');
const router = express.Router();

const List = require('../models/list.js');
const User = require('../models/user.js');
const Country = require('../models/country.js');
const Habitat = require('../models/habitat.js');

router.get('/', async (req, res) => {
    try {
    const getListItems = await List.find({seen: true}). populate('owner');
    console.log('all spot list items', getListItems);
    res.render('list/index.ejs', {
        listItems: getListItems,
    })} catch (error) {
        console.log(error);
        res.redirect('/')
    }   
});

router.get('/new', async (req, res) => {
    const country = await Country.find();
    const habitat = await Habitat.find();
    res.render('list/new.ejs', {country, habitat});
});

router.post('/', async (req, res) => {
    try {
       const country = await Country.findOne({name: req.body.country})
       const habitat = await Habitat.findOne({name: req.body.habitat})
    //    console.log('this is the country', country)
    //    console.log('this is the habitat', habitat)
        req.body.country = [country._id]
        req.body.habitat = [habitat._id];
    //    console.log(req.body)
       const newListItem = new List(req.body);
        newListItem.owner = req.session.user._id;
        // console.log(newListItem);
        newListItem.save();
        res.redirect('/list');
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/:listId', async (req,res) => {
  const listItem = await List.findById(req.params.listId)
  .populate('country').populate('habitat');
  listItem.displayName = listItem.name.charAt(0).toUpperCase() + listItem.name.slice(1);
    res.render("list/show.ejs", {
      listItem: listItem
    });
})

router.delete('/:listId', async (req, res) => {
    try {
        const listItem = await List.findById(req.params.listId);
        if (listItem.owner.equals(req.session.user._id)) {
            console.log('Permission granted')
            await listItem.deleteOne();
            res.redirect('/list')
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
        console.log('List Item ID', req.params.listId)
        res.render('list/edit.ejs', {
            listItem: listItem,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    };
})

router.put('/:listId', async (req, res) => {
  try {
    const listItem = await List.findById(req.params.listId);
    if (listItem.owner.equals(req.session.user._id)) {
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
// router.post('/', async (req, res) => {
//     try {
//     } catch (error) {
//         console.log(error);
//         redirect('/')
//     }
// })

module.exports = router