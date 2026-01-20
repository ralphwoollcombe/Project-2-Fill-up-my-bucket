const mongoose = require('mongoose')
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const populateCountries = require('./populate.js');
const habitatController = require("./controllers/habitat.js")
const authController = require('./controllers/auth.js');
const listController = require('./controllers/list.js');
const hitListController = require('./controllers/hit-list.js')
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const MongoStore = require('connect-mongo');
const Country = require('./models/country.js');

dotenv.config();

const app = express();

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', async () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
    await populateCountries()
    // await populateHabitats();
})



app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

app.use(passUserToView);

//Routes
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,
  });
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/list', listController);
app.use('/hit-list', hitListController);
app.use('/habitat', habitatController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
