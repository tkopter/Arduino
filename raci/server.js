const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 3306,
};

let pool;
let cachedProject = null;

async function ensureDatabase() {
  const root = await mysql.createConnection(dbConfig);
  await root.query('CREATE DATABASE IF NOT EXISTS raci_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  await root.end();
  pool = await mysql.createPool({ ...dbConfig, database: 'raci_db' });
  await pool.query(`CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    data JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM projects');
  if (rows[0].cnt === 0) {
    await pool.query('INSERT INTO projects (name, data) VALUES (?, ?)', ['Varsayılan', JSON.stringify({})]);
  }
}

app.get('/api/project', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM projects WHERE id = 1');
  cachedProject = rows[0]?.data || {};
  res.json(rows[0]);
});

app.post('/api/save', async (req, res) => {
  const { projectId = 1, data } = req.body;
  await pool.query('UPDATE projects SET data = ? WHERE id = ?', [JSON.stringify(data || {}), projectId]);
  cachedProject = data;
  io.emit('project:sync', data);
  res.json({ message: 'Kaydedildi' });
});

io.on('connection', (socket) => {
  if (cachedProject) {
    socket.emit('project:sync', cachedProject);
  }
  socket.on('project:update', (data) => {
    cachedProject = data;
    socket.broadcast.emit('project:sync', data);
  });
});

const PORT = process.env.PORT || 3000;
ensureDatabase().then(() => {
  server.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Veritabanı hatası', err);
  process.exit(1);
});
