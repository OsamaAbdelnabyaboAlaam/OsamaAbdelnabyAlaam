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

## النشر على Render (لينك دائم)

الريبو جاهز للنشر — ملف `render.yaml` موجود.

### الخطوات
1. افتح https://dashboard.render.com وسجّل الدخول بحساب GitHub.
2. اضغط **New +** → **Blueprint**.
3. اختر ريبو `OsamaAbdelnabyaboAlaam/OsamaAbdelnabyAlaam` والفرع `arena/01a07db7-osamaabdelnabyalaam`.
4. Render يقرأ `render.yaml` تلقائياً → اضغط **Apply**.
5. بعد ~2 دقيقة يعطيك لينك دائم مثل `https://osama-portfolio.onrender.com`.

### ملاحظات
- `DATA_DIR=/var/data` يوجّه SQLite إلى قرص دائم حتى لا تُفقد البيانات عند إعادة النشر.
- الخطة المجانية تُنيم الخدمة بعد فترة خمول؛ أول زيارة قد تستغرق ~30 ثانية.
- `healthCheckPath: /api/health` يستخدمه Render للتأكد أن الخدمة حية.
