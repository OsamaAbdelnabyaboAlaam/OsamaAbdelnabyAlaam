const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'app.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT DEFAULT '',
  url TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50,
  category TEXT DEFAULT 'general'
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`);

function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM projects').get().c;
  if (count > 0) return;
  const p = db.prepare('INSERT INTO projects (title, description, tech, url) VALUES (?,?,?,?)');
  p.run('موقع شخصي', 'موقع بورتفوليو كامل مبني بـ Node.js و Express مع قاعدة بيانات SQLite.', 'Node.js,Express,SQLite', 'https://github.com/OsamaAbdelnabyaboAlaam');
  p.run('نظام إدارة المهام', 'تطبيق ويب لإدارة المهام اليومية مع واجهة REST API كاملة.', 'JavaScript,REST API', '#');
  p.run('لوحة تحكم تحليلية', 'لوحة تحكم لعرض الإحصائيات والبيانات بشكل تفاعلي.', 'HTML,CSS,Chart', '#');
  const s = db.prepare('INSERT INTO skills (name, level, category) VALUES (?,?,?)');
  [['JavaScript', 88, 'برمجة'], ['Node.js', 82, 'باك اند'], ['HTML & CSS', 92, 'واجهات'],
   ['SQL / قواعد البيانات', 78, 'بيانات'], ['Git & GitHub', 80, 'أدوات']]
    .forEach(([n, l, c]) => s.run(n, l, c));
}
seed();

module.exports = db;
