const express = require('express');
const path = require('node:path');
const { query, init, driver } = require('./db');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const wrap = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error(e);
  res.status(500).json({ error: 'خطأ في الخادم' });
});

const api = express.Router();

api.get('/health', (req, res) => res.json({ ok: true, driver, time: new Date().toISOString() }));

api.get('/projects', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM projects ORDER BY id DESC');
  res.json(rows);
}));

api.post('/projects', wrap(async (req, res) => {
  const { title, description, tech = '', url = '' } = req.body || {};
  if (!title || !description) return res.status(400).json({ error: 'العنوان والوصف مطلوبان' });
  const { rows } = await query(
    'INSERT INTO projects (title, description, tech, url) VALUES ($1,$2,$3,$4) RETURNING *',
    [title, description, tech, url]
  );
  res.status(201).json(rows[0] || {});
}));

api.delete('/projects/:id', wrap(async (req, res) => {
  await query('DELETE FROM projects WHERE id = $1', [Number(req.params.id)]);
  res.json({ ok: true });
}));

api.get('/skills', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM skills ORDER BY level DESC');
  res.json(rows);
}));

api.post('/skills', wrap(async (req, res) => {
  const { name, level = 50, category = 'general' } = req.body || {};
  if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });
  const { rows } = await query(
    'INSERT INTO skills (name, level, category) VALUES ($1,$2,$3) RETURNING *',
    [name, Number(level), category]
  );
  res.status(201).json(rows[0] || {});
}));

api.get('/messages', wrap(async (req, res) => {
  const { rows } = await query('SELECT * FROM messages ORDER BY id DESC');
  res.json(rows);
}));

api.post('/messages', wrap(async (req, res) => {
  const { name, email, body } = req.body || {};
  if (!name || !email || !body) return res.status(400).json({ error: 'كل الحقول مطلوبة' });
  const { rows } = await query(
    'INSERT INTO messages (name, email, body) VALUES ($1,$2,$3) RETURNING *',
    [name, email, body]
  );
  res.status(201).json(rows[0] || {});
}));

api.get('/stats', wrap(async (req, res) => {
  const [p, s, m] = await Promise.all([
    query('SELECT COUNT(*) AS c FROM projects'),
    query('SELECT COUNT(*) AS c FROM skills'),
    query('SELECT COUNT(*) AS c FROM messages')
  ]);
  res.json({
    projects: Number(p.rows[0].c),
    skills: Number(s.rows[0].c),
    messages: Number(m.rows[0].c)
  });
}));

app.use('/api', api);

const PORT = process.env.PORT || 3000;
init()
  .then(() => app.listen(PORT, '0.0.0.0', () =>
    console.log(`Server running on http://0.0.0.0:${PORT} (db: ${driver})`)))
  .catch((e) => { console.error('DB init failed:', e); process.exit(1); });
