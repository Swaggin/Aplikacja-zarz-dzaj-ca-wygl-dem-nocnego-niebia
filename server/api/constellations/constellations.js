/* Imports */
const express = require('express');
const dotenv  = require('dotenv').config();
const router  = express.Router();
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);
router.use(express.json());

/* Main */
router
.get('/v1/constellations', (req, res) => {
  connection.query('SELECT * FROM stars', (err, rows) => {
    res.json(rows);
  });
})
.post('/v1/constellations', (req, res) => {
  const { name, description, imageUrl } = req.body;

  res.set({ 'content-type': 'application/json; charset=utf-8' });

  connection.execute(
    'INSERT INTO stars(name, description, image_url) VALUES(?, ?, ?)',
    [name, description, imageUrl],
    (err, rows
    ) => {
      if (err) res.status(500).send({ error: err });
      else res.status(200).send(`Constellation ${name} successfuly added.`);
    });
}).put('/v1/constellations', (req, res) => {
  const { id, name, description, imageUrl } = req.body;

  res.set({ 'content-type': 'application/json; charset=utf-8' });

  connection.execute(
    'UPDATE stars SET name=?, description=?, image_url=? WHERE id=?',
    [name, description, imageUrl, id],
    (err, rows
    ) => {
      if (err) res.status(500).send({ error: err });
      else res.status(200).send(`Constellation id ${id} successfuly edited.`);
    });
});

router
.get('/v1/constellations/:id', (req, res) => {
  const { id } = req.params;

  connection.execute(
    'SELECT * FROM stars WHERE id=?',
    [id],
    (err, rows
    ) => {
      rows.length > 0 ?
        res.status(200).send(rows) :
        res.status(404);
    });
})
.post('/v1/constellations/:id/:star', (req, res) => {
  const { id, constellation } = req.params;

  connection.execute(
    'INSERT INTO star_constellation(star_id, constellation_id) VALUES (?, ?)',
    [id, constellation],
    (err, rows
    ) => {
      rows.length > 0 ?
        res.status(200).send(`Constellation star id ${id} successfuly added.`) :
        res.status(404).send({ error: err });
    });
})
.put('/v1/constellations/:id/:star', (req, res) => {
  const { id, constellation } = req.params;

  connection.execute(
    'UPDATE star_constellation SET star_id=?, constellation_id=? WHERE star_id=?',
    [id, constellation, id],
    (err, rows
    ) => {
      if (err) res.status(500).send({ error: err });
      else res.status(200).send(`Constellation star id ${id} successfuly edited.`);
    });
})
.delete('/v1/constellations/:id', (req, res) => {
  const { id } = req.params;

  connection.execute(
    'DELETE FROM stars WHERE id=?',
    [id],
    (err, rows
    ) => {
      if (err) res.status(500).send({ error: err });
      else res.status(200).send(`Constellation id ${id} successfuly deleted.`);
    });
});

module.exports = router;
