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

الريبو جاهز — ملف `render.yaml` موجود.

### الخطوات
1. افتح https://dashboard.render.com وسجّل الدخول بحساب GitHub.
2. **New +** → **Blueprint**.
3. اختر ريبو `OsamaAbdelnabyaboAlaam/OsamaAbdelnabyAlaam` والفرع `arena/01a07db7-osamaabdelnabyalaam`.
4. Render يقرأ `render.yaml` تلقائياً → **Apply**.
5. بعد ~2 دقيقة يعطيك لينك دائم مثل `https://osama-portfolio.onrender.com`.

### ملاحظات على الخطة المجانية
- **لا تدعم الأقراص الدائمة (disks)**، لذلك `DATA_DIR=/tmp/data`.
  الموقع يعمل بالكامل، لكن ما يُضاف عبر لوحة التحكم (مشاريع/مهارات/رسائل)
  يُفقد عند إعادة النشر أو الاستيقاظ من الخمول، وتعود البيانات الأولية.
- الخدمة تنام بعد فترة خمول؛ أول زيارة تستغرق ~30 ثانية.

### لتخزين دائم للبيانات
ارفع الخطة إلى `starter` وأضف في `render.yaml`:

```yaml
    plan: starter
    disk:
      name: sqlite-data
      mountPath: /var/data
      sizeGB: 1
```
وغيّر `DATA_DIR` إلى `/var/data`.

بديل مجاني آخر: استخدم قاعدة بيانات Postgres مجانية على Render وحوّل `server/db.js` إليها.
