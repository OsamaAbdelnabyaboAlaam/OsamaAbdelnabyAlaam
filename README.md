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

## قاعدة البيانات

طبقة مزدوجة في `server/db.js`:
- **PostgreSQL** إذا كان متغير البيئة `DATABASE_URL` موجوداً (الإنتاج على Render — تخزين دائم فعلي).
- **SQLite** تلقائياً بدونه (التطوير المحلي، بلا أي إعداد).

نفس الكود ونفس الاستعلامات تعمل على الاثنين؛ الاستعلامات تُكتب بصيغة Postgres (`$1`, `SERIAL`, `RETURNING *`) وتُترجم تلقائياً لـ SQLite.
`GET /api/health` يُظهر المحرك المستخدم حالياً.

## النشر على Render (لينك دائم + قاعدة بيانات مجانية)

1. افتح https://dashboard.render.com وسجّل الدخول بحساب GitHub.
2. **New +** → **Blueprint**.
3. اختر ريبو `OsamaAbdelnabyaboAlaam/OsamaAbdelnabyAlaam` والفرع `arena/01a07db7-osamaabdelnabyalaam`.
4. Render يقرأ `render.yaml` → ينشئ **قاعدة بيانات Postgres مجانية** + خدمة الويب،
   ويربط `DATABASE_URL` بينهما تلقائياً → اضغط **Apply**.
5. بعد ~2-3 دقائق يعطيك لينك دائم مثل `https://osama-portfolio.onrender.com`.

### ملاحظات
- الجداول تُنشأ والبيانات الأولية تُزرع تلقائياً عند أول تشغيل.
- بياناتك (مشاريع/مهارات/رسائل) **تبقى محفوظة** بعد إعادة النشر.
- الخطة المجانية تُنيم الخدمة عند الخمول؛ أول زيارة ~30 ثانية.
- Postgres المجاني على Render صالح 30 يوماً ثم يحتاج تجديد/ترقية.
