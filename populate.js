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
  try {
    await Country.deleteMany({});
    await Habitat.deleteMany({});
    for (const country of startingCountries) {
      const newCountries = new Country({name: country.name});
          console.log('my new countries', newCountries);
          for (const hab of country.habitat) {
          let habitat = await Habitat.findOne({name: hab});
          if (!habitat) 
            {habitat = new Habitat({ name: hab })};
          console.log('my new habitats', habitat);
          if (!habitat.country.includes(newCountries._id)) 
            {habitat.country.push(newCountries._id)};          
          if (!newCountries.habitat.includes(habitat._id)) 
          {newCountries.habitat.push(habitat._id)};
          await habitat.save();
          console.log(habitat) 
          }
    await newCountries.save();
    console.log(newCountries);
    }
  } catch (error) {
    console.log(error)
  }
}

// const populateHabitats = async () => {
//     try {
//       await Habitat.deleteMany({});
//       const habitats = await Habitat.find();
//       if (habitats.length === 0) {
//         const populatedHabitats = await Habitat.insertMany(startingHabitats)
//         console.log('habitats added', populatedHabitats);
//       } else {
//         console.log('habitats not added');
//       }
//     } catch (error){
//       console.log(error);
//     }
// }

module.exports = populateCountries;