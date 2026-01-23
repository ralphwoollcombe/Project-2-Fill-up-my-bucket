const express = require('express');
const router = express.Router();

const Habitat = require('./models/habitat.js');
const Country = require('./models/country.js');

const startingCountries = [
  {name:'United Kingdom', habitat: ['Grassland', 'Wetland', 'Coast', 'Woodland', 'Urban', 'Mountain']},
  {name:'Fiji', habitat: ['Coast', 'Mangrove', 'Tropical Forest', 'Wetland']},
  {name: 'Botswana', habitat: ['Desert', 'Floodplains', 'Savanna', 'Woodland']},
]

//Functions
const populateCountries = async () => {
  const allCountries = await Country.find({});
    const allHabitats = await Habitat.find({});
    if (allCountries.length === 0 && allHabitats.length === 0)
      {try {
    for (const country of startingCountries) {
      const newCountries = new Country({name: country.name});
          for (const hab of country.habitat) {
          let habitat = await Habitat.findOne({name: hab});
          if (!habitat) 
            {habitat = new Habitat({ name: hab })};
          if (!habitat.country.includes(newCountries._id)) 
            {habitat.country.push(newCountries._id)};          
          if (!newCountries.habitat.includes(habitat._id)) 
          {newCountries.habitat.push(habitat._id)};
          await habitat.save();
          }
    await newCountries.save();
    }
  } catch (error) {
    console.log(error)
  }
}}

module.exports = populateCountries;