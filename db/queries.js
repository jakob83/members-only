require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function insertUser(name, email, password) {
  try {
    await pool.query(
      `INSERT INTO users(username, email, password) VALUES($1, $2, $3)`,
      [name, email, password]
    );
  } catch (error) {
    if (error.code === '23505') {
      throw new Error('Username already exists');
    }
    throw new Error('Ooops something went wrong...');
  }
}

async function getUserByName(name) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [
    name,
  ]);
  return rows[0];
}
async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function insertPost(title, content, userId) {
  const now = new Date();
  const timeStamp = now.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  try {
    await pool.query(
      'INSERT INTO posts (title, content, user_id, time_stamp) VALUES($1, $2, $3, $4)',
      [title, content, userId, timeStamp]
    );
  } catch (err) {
    throw new Error('Ooops something went wrong...');
  }
}

async function getPosts() {
  const { rows } = await pool.query(
    'SELECT * FROM posts JOIN users ON posts.user_id = users.id;'
  );
  return rows;
}
module.exports = {
  getPosts,
  insertUser,
  getUserByName,
  getUserById,
  insertPost,
};
