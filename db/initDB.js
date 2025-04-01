require('dotenv').config();
const { Client } = require('pg');
const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 ) UNIQUE,
    email VARCHAR ( 255 ) UNIQUE,
    password VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR ( 255 ),
    content TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, email, password)
VALUES
('tsagga', 'jakobpllo@gmai.com', 'Halo88!siuu');


INSERT INTO posts (title, content, user_id)
VALUES
('First Post', 'Hello, this is the first post on my app, pretty nice huh?', 
(SELECT id FROM users WHERE username = 'tsagga'));
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Connection successful!');

    console.log('populating...');
    await client.query(SQL);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error during the query execution:', err);
  } finally {
    await client.end();
    console.log('done');
  }
}
main();
