/* Imports */
const express              = require('express');
const dotenv               = require('dotenv').config();
const skyRouter            = require('./api/sky/sky');
const starRouter           = require('./api/stars/stars');
const constellationsRouter = require('./api/constellations/constellations');
const bodyParser           = require('body-parser');
const multer               = require('multer');
const upload               = multer();
const cors                 = require('cors');

/* Config */
const app = express();

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static('public'));

app.use(skyRouter);
app.use(starRouter);
app.use(constellationsRouter);

/* Main */
app.listen(process.env.APP_PORT);
