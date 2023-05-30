/* Imports */
const express  = require('express');
const router   = express.Router();
const mysql    = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);

router.use(express.json());

/* Main */
router
  .get('/v1/stars', (req, res) => {
    connection.query('SELECT * FROM stars', (err, rows) => {
      res.json(rows);
    });
  })
  .post('/v1/stars', (req, res) => {
    const { name, description, imageUrl, visible = 0 } = req.body;

    res.set({ 'content-type': 'application/json; charset=utf-8' });

    connection.execute(
      'INSERT INTO stars(name, description, image_url, visible) VALUES(?, ?, ?, ?)',
      [name, description, imageUrl, visible],
      (err, rows
      ) => {
        if (err) res.status(500).send({ error: err });
        else res.status(200).send(`Star ${name} successfuly added.`);
      });
  }).put('/v1/stars', (req, res) => {
    const { id, name, description, imageUrl, visible } = req.body;

    res.set({ 'content-type': 'application/json; charset=utf-8' });

    connection.execute(
      'UPDATE stars SET name=?, description=?, image_url=?, visible=? WHERE id=?',
      [name, description, imageUrl, visible, id],
      (err, rows
      ) => {
        if (err) res.status(500).send({ error: err });
        else res.status(200).send(`Star id ${id} successfuly edited.`);
      });
  });

router
  .get('/v1/stars/:id', (req, res) => {
    const { id } = req.params;

    connection.execute(
      'SELECT * FROM stars WHERE id=?',
      [id],
      (err, rows
      ) => {
        rows.length > 0 ?
          res.status(200).send(rows) :
          res.status(404).send(`Star of id ${id} not found.`);
    });
  })
  .post('/v1/stars/:id/:constellation', (req, res) => {
    const { id, constellation } = req.params;

    connection.execute(
      'INSERT INTO star_constellation(star_id, constellation_id) VALUES (?, ?)',
      [id, constellation],
      (err, rows
      ) => {
        rows.length > 0 ?
          res.status(200).send(`Star constellation id ${id} successfuly added.`) :
          res.status(404).send({ error: err });
    });
  })
  .put('/v1/stars/:id/:constellation', (req, res) => {
    const { id, constellation } = req.params;

    connection.execute(
      'UPDATE star_constellation SET star_id=?, constellation_id=? WHERE star_id=?',
      [id, constellation, id],
      (err, rows
      ) => {
        if (err) res.status(500).send({ error: err });
        else res.status(200).send(`Star constellation id ${id} successfuly edited.`);
    });
  })
  .delete('/v1/stars/:id', (req, res) => {
    const { id } = req.params;

    connection.execute(
      'DELETE FROM stars WHERE id=?',
      [id],
      (err, rows
      ) => {
        if (err) res.status(500).send({ error: err });
        else res.status(200).send(`Star id ${id} successfuly deleted.`);
      });
  });

module.exports = router;
