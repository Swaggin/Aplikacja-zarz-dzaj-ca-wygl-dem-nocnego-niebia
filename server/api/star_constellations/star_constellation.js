/* Imports */
const express = require('express');
const router  = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);

router.use(express.json());

/* Main */
router
.get('/v1/stars/:id/constellation', (req, res) => {
  const { id } = req.params;

  connection.execute(
    'SELECT * FROM star_constellation WHERE star_id=?',
    [id],
    (err, rows
    ) => {
      rows?.length > 0 ?
        res.status(200).send(rows) :
        res.status(404);
    });
})

router
.get('/v1/constellations/:id/stars', (req, res) => {
  const { id } = req.params;

  connection.execute(
    'SELECT * FROM star_constellation WHERE constellation_id=?',
    [id],
    (err, rows
    ) => {
      rows.length > 0 ?
        res.status(200).send(rows) :
        res.status(404);
    });
})

module.exports = router;
