const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'raci_db';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let pool;

async function initDb() {
  const root = await mysql.createConnection({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD });
  await root.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await root.end();
  pool = mysql.createPool({ host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME, waitForConnections: true, connectionLimit: 10 });
  await pool.query(`CREATE TABLE IF NOT EXISTS board_state (id INT PRIMARY KEY, payload JSON)`);
  await pool.query(`INSERT INTO board_state (id, payload) VALUES (1, JSON_OBJECT('tasks', JSON_ARRAY(), 'people', JSON_ARRAY(), 'statuses', JSON_ARRAY(), 'columns', JSON_ARRAY())) ON DUPLICATE KEY UPDATE id = id`);
}

app.get('/api/load', async (_req, res) => {
  const [rows] = await pool.query('SELECT payload FROM board_state WHERE id = 1');
  res.json(rows[0]?.payload || {});
});

app.post('/api/save', async (req, res) => {
  const payload = req.body || {};
  await pool.query('REPLACE INTO board_state (id, payload) VALUES (1, ?)', [JSON.stringify(payload)]);
  io.emit('update', payload);
  res.json({ message: 'Kaydedildi' });
});

io.on('connection', socket => {
  socket.on('update', payload => {
    socket.broadcast.emit('update', payload);
  });
});

initDb().then(() => {
  server.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`));
  console.log('✅ Veritabanı ve tablolar hazır.');
}).catch(err => {
  console.error('Veritabanı başlatılamadı', err);
  process.exit(1);
});
