const uuid = require("uuid");
const db = require("mysql2");
const connection = require("../index.js:connection")
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
    const [rows, fields] = await connection.execute(query, [id]);
    if (rows.length === 0) {
      throw new Error(`Star with id ${id} not found`);
    }
    const star = rows[0];
    star.constellations = await getConstellationsByStarId(id);
    return star;
  } catch (error) {
    console.error(`Error occurred while getting a star by id: ${error}`);
    throw error;
  }
}



async function deleteStar(id) {
  try {
    const query = `DELETE FROM stars WHERE id = ?`;
    const result = await connection.execute(query, [id]);
    console.log(result);
  } catch (error) {
    console.error(`Error occurred while deleting star: ${error}`);
    throw error;
  }
}

async function editStar(id, name, description, imageUrl) {
  try {
    const query = `UPDATE stars SET name = ?, description = ?, image_url = ? WHERE id = ?`;
    const result = await connection.execute(query, [name, description, imageUrl, id]);
    console.log(result);
    return {
      id,
      name,
      description,
      imageUrl,
    };
  } catch (error) {
    console.error(`Error occurred while editing the star: ${error}`);
    throw error;
  }
}

module.exports = {
  addStar,
  getStarById,
  deleteStar,
  editStar
};
