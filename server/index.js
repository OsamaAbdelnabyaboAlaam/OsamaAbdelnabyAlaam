const express = require('express');
const path = require('node:path');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const api = express.Router();

api.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

api.get('/projects', (req, res) => {
  res.json(db.prepare('SELECT * FROM projects ORDER BY id DESC').all());
});

api.post('/projects', (req, res) => {
  const { title, description, tech = '', url = '' } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'العنوان والوصف مطلوبان' });
  const info = db.prepare('INSERT INTO projects (title, description, tech, url) VALUES (?,?,?,?)')
    .run(title, description, tech, url);
  res.status(201).json(db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid));
});

api.delete('/projects/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
});

api.get('/skills', (req, res) => {
  res.json(db.prepare('SELECT * FROM skills ORDER BY level DESC').all());
});

api.post('/skills', (req, res) => {
  const { name, level = 50, category = 'general' } = req.body || {};
  if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });
  const info = db.prepare('INSERT INTO skills (name, level, category) VALUES (?,?,?)')
    .run(name, Number(level), category);
  res.status(201).json(db.prepare('SELECT * FROM skills WHERE id = ?').get(info.lastInsertRowid));
});

api.get('/messages', (req, res) => {
  res.json(db.prepare('SELECT * FROM messages ORDER BY id DESC').all());
});

api.post('/messages', (req, res) => {
  const { name, email, body } = req.body || {};
  if (!name || !email || !body) return res.status(400).json({ error: 'كل الحقول مطلوبة' });
  const info = db.prepare('INSERT INTO messages (name, email, body) VALUES (?,?,?)').run(name, email, body);
  res.status(201).json(db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid));
});

api.get('/stats', (req, res) => {
  res.json({
    projects: db.prepare('SELECT COUNT(*) c FROM projects').get().c,
    skills: db.prepare('SELECT COUNT(*) c FROM skills').get().c,
    messages: db.prepare('SELECT COUNT(*) c FROM messages').get().c
  });
});

app.use('/api', api);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
