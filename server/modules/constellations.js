const uuid = require("uuid");
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


async function addConstellation(name, description, imageUrl, stars) {
  try {
    const id = uuid.v4();
    const query = `INSERT INTO constellations (id, name, description, image_url) VALUES (?, ?, ?, ?)`;
    const result = await connection.execute(query, [id, name, description, imageUrl]);
    console.log(result);
    const constellation = {
      id,
      name,
      description,
      imageUrl,
      stars: []
    };

    // Add stars to constellation
    for (const star of stars) {
      await addStarToConstellation(id, star);
      constellation.stars.push(star);
    }

    return constellation;
  } catch (error) {
    console.error(`Error occurred while adding a new constellation: ${error}`);
    throw error;
  }
}

async function addStarToConstellation(constellationId, starId) {
  try {
    const query = `INSERT INTO constellation_star (constellation_id, star_id) VALUES (?, ?)`;
    const result = await connection.execute(query, [constellationId, starId]);
    console.log(result);
  } catch (error) {
    console.error(`Error occurred while adding a new star to constellation: ${error}`);
    throw error;
  }
}

async function deleteConstellation(id) {
  try {
    // Delete stars from constellation_star table
    const deleteStarsQuery = `DELETE FROM constellation_star WHERE constellation_id = ?`;
    await connection.execute(deleteStarsQuery, [id]);

    // Delete constellation from constellations table
    const deleteQuery = `DELETE FROM constellations WHERE id = ?`;
    const result = await connection.execute(deleteQuery, [id]);
    console.log(result);

    return `Constellation with id ${id} deleted successfully`;
  } catch (error) {
    console.error(`Error occurred while deleting constellation: ${error}`);
    throw error;
  }
}

async function editConstellation(id, name, description, imageUrl, stars) {
  try {
    // Update constellation in constellations table
    const updateQuery = `UPDATE constellations SET name = ?, description = ?, image_url = ? WHERE id = ?`;
    const updateResult = await connection.execute(updateQuery, [name, description, imageUrl, id]);
    console.log(updateResult);

    // Delete stars from constellation_star table
    const deleteStarsQuery = `DELETE FROM constellation_star WHERE constellation_id = ?`;
    await connection.execute(deleteStarsQuery, [id]);

    // Add stars to constellation
    for (const star of stars) {
      await addStarToConstellation(id, star);
    }

    return {
      id,
      name,
      description,
      imageUrl,
      stars
    };
  } catch (error) {
    console.error(`Error occurred while updating constellation: ${error}`);
    throw error;
  }
}



async function createConstellation(name, description, imageUrl, stars) {
  try {
    // generate a new UUID for the constellation
    const id = uuid.v4();

    // insert the new constellation into the database
    const query = `INSERT INTO constellations (id, name, description, image_url) VALUES (?, ?, ?, ?)`;
    await connection.execute(query, [id, name, description, imageUrl]);

    // add the stars to the constellation_star join table
    const insertQuery = `INSERT INTO constellation_star (constellation_id, star_id) VALUES (?, ?)`;
    for (const starId of stars) {
      await connection.execute(insertQuery, [id, starId]);
    }

    // return the newly created constellation object
    return {
      id,
      name,
      description,
      imageUrl,
      stars: stars.map(starId => ({ id: starId })),
    };
  } catch (error) {
    console.error(`Error occurred while creating a new constellation: ${error}`);
    throw error;
  }
}

async function deleteConstellationById(id) {
  try {
    // Delete all stars from constellation
    const starsQuery = `DELETE FROM constellation_stars WHERE constellation_id = ?`;
    await connection.execute(starsQuery, [id]);

    // Delete constellation
    const query = `DELETE FROM constellations WHERE id = ?`;
    const result = await connection.execute(query, [id]);

    console.log(result);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error occurred while deleting constellation: ${error}`);
    throw error;
  }
}

async function updateConstellationById(id, name, description, imageUrl, stars) {
  try {
    // Update constellation
    const query = `UPDATE constellations SET name = ?, description = ?, image_url = ? WHERE id = ?`;
    const result = await connection.execute(query, [name, description, imageUrl, id]);

    console.log(result);

    // Delete all existing stars for constellation
    const starsQuery = `DELETE FROM constellation_stars WHERE constellation_id = ?`;
    await connection.execute(starsQuery, [id]);

    // Insert all stars for constellation
    if (stars && stars.length) {
      const values = stars.map(starId => [id, starId]);
      const starsQuery = `INSERT INTO constellation_stars (constellation_id, star_id) VALUES ?`;
      await connection.execute(starsQuery, [values]);
    }

    return {
      id,
      name,
      description,
      imageUrl,
      stars
    };
  } catch (error) {
    console.error(`Error occurred while updating constellation: ${error}`);
    throw error;
  }
}

const { v4: uuidv4 } = require('uuid');
const db = require("mysql2");

async function createStar(name, description, imageUrl) {
  try {
    const id = uuidv4();
    const query = `INSERT INTO stars (id, name, description, image_url) VALUES (?, ?, ?, ?)`;
    const result = await connection.execute(query, [id, name, description, imageUrl]);
    console.log(result);
    return {
      id,
      name,
      description,
      imageUrl,
      constellations: []
    };
  } catch (error) {
    console.error(`Error occurred while creating a new star: ${error}`);
    throw error;
  }
}
