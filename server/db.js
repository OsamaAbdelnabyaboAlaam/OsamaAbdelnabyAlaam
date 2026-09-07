/**
 * طبقة قاعدة بيانات مزدوجة:
 *  - إذا وُجد DATABASE_URL  -> PostgreSQL (الإنتاج على Render، تخزين دائم)
 *  - غير ذلك               -> SQLite محلي (التطوير والمعاينة)
 *
 * الواجهة موحّدة وغير متزامنة: query(sql, params) -> { rows }
 * تُكتب الاستعلامات بعلامات $1, $2 ... وتُترجم تلقائياً إلى ? لـ SQLite.
 */
const path = require('node:path');
const fs = require('node:fs');

const USE_PG = !!process.env.DATABASE_URL;

let query; // async (sql, params) => { rows }

if (USE_PG) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'off' ? false : { rejectUnauthorized: false },
    max: 5
  });
  query = async (sql, params = []) => pool.query(sql, params);
} else {
  const { DatabaseSync } = require('node:sqlite');
  const dataDir = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const sdb = new DatabaseSync(path.join(dataDir, 'app.db'));

  // ترجمة صياغة Postgres إلى SQLite
  const translate = (sql) => sql
    .replace(/\$(\d+)/g, '?')
    .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
    .replace(/TIMESTAMPTZ/gi, 'TEXT')
    .replace(/NOW\(\)/gi, "(datetime('now'))")
    .replace(/RETURNING \*/gi, '');

  query = async (sql, params = []) => {
    const s = translate(sql);
    const isSelect = /^\s*(SELECT|WITH)/i.test(s);
    const returning = /RETURNING \*/i.test(sql);
    if (isSelect) return { rows: sdb.prepare(s).all(...params) };
    const info = sdb.prepare(s).run(...params);
    if (returning) {
      const table = (sql.match(/INSERT\s+INTO\s+(\w+)/i) || [])[1];
      if (table) {
        const rows = sdb.prepare(`SELECT * FROM ${table} WHERE id = ?`).all(info.lastInsertRowid);
        return { rows };
      }
    }
    return { rows: [] };
  };
}

async function init() {
  const idType = USE_PG ? 'SERIAL PRIMARY KEY' : 'SERIAL PRIMARY KEY'; // يُترجم لـ SQLite
  await query(`CREATE TABLE IF NOT EXISTS projects (
    id ${idType},
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech TEXT DEFAULT '',
    url TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`);
  await query(`CREATE TABLE IF NOT EXISTS skills (
    id ${idType},
    name TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 50,
    category TEXT DEFAULT 'general'
  )`);
  await query(`CREATE TABLE IF NOT EXISTS messages (
    id ${idType},
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`);

  const { rows } = await query('SELECT COUNT(*) AS c FROM projects');
  if (Number(rows[0].c) > 0) return;

  const projects = [
    ['موقع شخصي', 'موقع بورتفوليو كامل مبني بـ Node.js و Express مع قاعدة بيانات PostgreSQL.', 'Node.js,Express,PostgreSQL', 'https://github.com/OsamaAbdelnabyaboAlaam'],
    ['نظام إدارة المهام', 'تطبيق ويب لإدارة المهام اليومية مع واجهة REST API كاملة.', 'JavaScript,REST API', '#'],
    ['لوحة تحكم تحليلية', 'لوحة تحكم لعرض الإحصائيات والبيانات بشكل تفاعلي.', 'HTML,CSS,Chart', '#']
  ];
  for (const p of projects) {
    await query('INSERT INTO projects (title, description, tech, url) VALUES ($1,$2,$3,$4)', p);
  }
  const skills = [
    ['JavaScript', 88, 'برمجة'], ['Node.js', 82, 'باك اند'], ['HTML & CSS', 92, 'واجهات'],
    ['SQL / قواعد البيانات', 78, 'بيانات'], ['Git & GitHub', 80, 'أدوات']
  ];
  for (const s of skills) {
    await query('INSERT INTO skills (name, level, category) VALUES ($1,$2,$3)', s);
  }
}

module.exports = { query, init, driver: USE_PG ? 'postgres' : 'sqlite' };
