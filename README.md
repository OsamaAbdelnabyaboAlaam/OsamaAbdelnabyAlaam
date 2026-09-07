# Osama Alaam — موقع شخصي

موقع بورتفوليو كامل: واجهة أمامية + باك اند Express + قاعدة بيانات SQLite.

## التشغيل
```bash
npm install
npm start   # http://localhost:3000
```

## الصفحات
| الصفحة | الوصف |
|---|---|
| `index.html` | الرئيسية + إحصائيات مباشرة + أحدث المشاريع |
| `projects.html` | كل المشاريع من قاعدة البيانات |
| `skills.html` | المهارات مع مؤشرات المستوى |
| `contact.html` | نموذج تواصل يحفظ الرسائل في DB |
| `admin.html` | لوحة تحكم: إضافة مشاريع/مهارات وعرض الرسائل |

## الـ API
- `GET /api/health`, `GET /api/stats`
- `GET|POST /api/projects`, `DELETE /api/projects/:id`
- `GET|POST /api/skills`
- `GET|POST /api/messages`

## البنية
```
server/index.js   # Express API + static
server/db.js      # SQLite schema + seed
public/           # الصفحات و CSS و JS
data/app.db       # قاعدة البيانات (تُنشأ تلقائياً)
```
