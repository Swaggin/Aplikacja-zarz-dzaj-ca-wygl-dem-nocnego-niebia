const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');
const dotenv = require('dotenv');
const starsModule = require('./modules/stars')
dotenv.config();

const hostname = '127.0.0.1';
const port = 3001;

// Połączenie z bazą danych

const db = require('mysql2');

const connection = db.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ', err);
  } else {
    console.log('Connected to MySQL database!');
  }
});

// Parsowanie danych wejściowych

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

// Endpointy

// Endpoint do dodawania gwiazd
app.post('/stars', async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;

    console.log(req.body);

    const star = await addStar(name, description, imageUrl);
    res.status(201).json(star);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do usuwania gwiazd
app.delete('/stars/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await starsModule.deleteStar(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do edycji danych gwiazd
app.put('/stars/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, imageUrl } = req.body;
    const star = await starsModule.editStar(id, name, description, imageUrl);
    res.status(200).json(star);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do wyświetlania szczegółów gwiazd
app.get('/stars/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const star = await getStarById(id);
    res.status(200).json(star);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function addStar(name, description, imageUrl) {
  try {
    const query = `INSERT INTO stars (name, description, image_url) VALUES (?, ?, ?)`;
    const result = await connection.execute(query, [name, description, imageUrl]);
    console.log(result);
    return {
      id: uuid.v4(),
      name,
      description,
      imageUrl,
      constellations: []
    };
  } catch (error) {
    console.error(`Error occurred while adding a new star: ${error}`);
    throw error;
  }
}

async function getStarById(id) {
  try {
    const query = `SELECT * FROM stars WHERE id = ?`;
    const [rows] = await connection.promise().execute(query, [id]);
    if (rows.length === 0) {
      throw new Error(`Star with id ${id} not found`);
    }
    const star = rows[0];
    //star.constellations = await getConstellationsByStarId(id);
    return star;
  } catch (error) {
    console.error(`Error occurred while getting a star by id: ${error}`);
    throw error;
  }
}

async function getConstellationsByStarId(id) {
  try {
    const query = `SELECT constellations.id, constellations.name, constellations.description, constellations.image_url 
                   FROM constellations 
                   INNER JOIN stars_constellations ON constellations.id = stars_constellations.constellation_id 
                   WHERE stars_constellations.star_id = ?`;
    const [rows, fields] = await connection.execute(query, [id]);
    return rows;
  } catch (error) {
    console.error(`Error occurred while getting constellations for star with id ${id}: ${error}`);
    throw error;
  }
}

async function findConstellationById(id) {
  try {
    const query = `
      SELECT *
      FROM constellations
      WHERE id = ?
    `;
    const [rows] = await connection.execute(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    const constellation = rows[0];
    constellation.stars = await getStarsByConstellationId(constellation.id);
    return constellation;
  } catch (error) {
    console.error(`Error occurred while finding constellation by id: ${error}`);
    throw error;
  }
}

async function getStarsByConstellationId(constellationId) {
  try {
    const query = `SELECT stars.id, stars.name, stars.description, stars.image_url
                   FROM stars
                   INNER JOIN stars_constellations
                   ON stars.id = stars_constellations.star_id
                   WHERE stars_constellations.constellation_id = ?`;
    const [rows] = await connection.execute(query, [constellationId]);
    const stars = rows.map(row => {
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.imageUrl,
      };
    });
    return stars;
  } catch (error) {
    console.error(`Error occurred while fetching stars for constellation ${constellationId}: ${error}`);
    throw error;
  }
}

//----------------------------------------------------------------------------------------------------------------------

// Endpoint do dodawania konstelacji
app.post('/constellations', async (req, res) => {
  try {
    const { name, description, imageUrl, stars } = req.body;
    const constellation = await addConstellation(name, description, imageUrl, stars);
    res.status(201).json(constellation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do usuwania konstelacji
app.delete('/constellations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await deleteConstellation(id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do edycji danych konstelacji
app.put('/constellations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, imageUrl, stars } = req.body;
    const constellation = await editConstellation(id, name, description, imageUrl, stars);
    res.status(200).json(constellation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Endpoint do wyświetlania szczegółów konstelacji
app.get('/constellations/:id', (req, res) => {
  const id = req.params.id;
  const constellation = findConstellationById(id);
  if (!constellation) {
    return res.status(404).json({ error: 'Constellation not found' });
  }
  return res.json(constellation);
});

// Endpoint do tworzenia konstelacji
app.post('/constellations', (req, res) => {
  const { name, description, imageUrl, stars } = req.body;
  if (!name || !description || !imageUrl || !stars) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  const newConstellation = createConstellation(name, description, imageUrl, stars);
  return res.status(201).json(newConstellation);
});

// Endpoint do usuwania konstelacji
app.delete('/constellations/:id', (req, res) => {
  const id = req.params.id;
  const deletedConstellation = deleteConstellationById(id);
  if (!deletedConstellation) {
    return res.status(404).json({ error: 'Constellation not found' });
  }
  return res.json(deletedConstellation);
});

// Endpoint do edycji konstelacji
app.put('/constellations/:id', (req, res) => {
  const id = req.params.id;
  const { name, description, imageUrl, stars } = req.body;
  if (!name || !description || !imageUrl || !stars) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  const updatedConstellation = updateConstellationById(id, name, description, imageUrl, stars);
  if (!updatedConstellation) {
    return res.status(404).json({ error: 'Constellation not found' });
  }
  return res.json(updatedConstellation);
});

//----------------------------------------------------------------------------------------------------------------------

// Endpoint do dodawania gwiazdy do konstelacji
app.post('/constellations/:id/stars', (req, res) => {
  const constellationId = req.params.id;
  const { name, description, imageUrl } = req.body;
  if (!name || !description || !imageUrl) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  const newStar = createStar(name, description, imageUrl);
  const constellation = findConstellationById(constellationId);
  if (!constellation) {
    return res.status(404).json({ error: 'Constellation not found' });
  }
  constellation.stars.push(newStar);
  return res.json(constellation);
});

// Endpoint do usuwania gwiazdy z konstelacji
app.delete('/constellations/:constellationId/stars/:starId', (req, res) => {
  const constellationId = req.params.constellationId;
  const starId = req.params.starId;
  const constellation = findConstellationById(constellationId);
  if (!constellation) {
    return res.status(404).json({ error: 'Constellation not found' });
  }
  const starIndex = constellation.stars.findIndex(star => star.id === starId);
  if (starIndex === -1) {
    return res.status(404).json({ error: 'Star not found in constellation' });
  }
  constellation.stars.splice(starIndex, 1);
  return res.json(constellation);
});

// Endpoint do edycji gwiazdy w konstelacji
app.put('/constellations/:constellationId/stars/:starId', (req, res) => {
  const { constellationId, starId } = req.params;
  const { name, description, imageUrl } = req.body;

// znajdź konstelację i gwiazdę o podanym ID
  const constellation = constellations.find(c => c.id === Number(constellationId));
  const star = constellation.stars.find(s => s.id === Number(starId));

// zaktualizuj dane gwiazdy
  star.name = name;
  star.description = description;
  star.imageUrl = imageUrl;

  res.json(star);
});


//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});






