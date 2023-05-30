/* Imports */
const express              = require('express');
const dotenv               = require('dotenv').config();
const skyRouter            = require('./api/sky/sky');
const starRouter           = require('./api/stars/stars');
const constellationsRouter = require('./api/constellations/constellations');

/* Config */
const app = express();

app.use(skyRouter);
app.use(starRouter);
app.use(constellationsRouter);

/* Main */
app.listen(process.env.APP_PORT);
