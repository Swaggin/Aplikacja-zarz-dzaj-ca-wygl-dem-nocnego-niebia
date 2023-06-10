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
  .get('/v1/sky', (req, res, next) => {
    connection.query('SELECT * FROM sky', (err, rows) => {
      res.json(rows);
    });
  })
  .put('/v1/sky', (req, res, next) => {
    const { cloudinessLevel, fogLevel, moonPhase, precipitationType } = req.body;

    connection.execute(
      'UPDATE sky SET cloudiness_level=?, fog_level=?, moon_phase=?, precipitation_type=?',
      [parseInt(cloudinessLevel), parseInt(fogLevel), parseInt(moonPhase), precipitationType],
      (err, rows
      ) => {
        if (err) res.status(500).send({ error: err });
        else res.status(200).send(
          'Sky successfuly edited.'
        );
      });
  });

module.exports = router;
