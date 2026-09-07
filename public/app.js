const api = (p, o) => fetch('/api' + p, o).then(r => r.json());

function navActive() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    if (a.getAttribute('href') === here) a.classList.add('active');
  });
}

async function loadStats(el) {
  if (!el) return;
  const s = await api('/stats');
  el.innerHTML = `
    <div class="stat"><b>${s.projects}</b><span>مشروع</span></div>
    <div class="stat"><b>${s.skills}</b><span>مهارة</span></div>
    <div class="stat"><b>${s.messages}</b><span>رسالة</span></div>`;
}

async function loadProjects(el, limit) {
  if (!el) return;
  let list = await api('/projects');
  if (limit) list = list.slice(0, limit);
  el.innerHTML = list.length ? list.map(p => `
    <article class="card">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags">${(p.tech || '').split(',').filter(Boolean).map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>
      ${p.url && p.url !== '#' ? `<p style="margin-top:12px"><a class="tag" href="${p.url}" target="_blank">زيارة المشروع ↗</a></p>` : ''}
    </article>`).join('') : '<p class="loading">لا توجد مشاريع بعد.</p>';
}

async function loadSkills(el) {
  if (!el) return;
  const list = await api('/skills');
  el.innerHTML = list.map(s => `
    <div class="card">
      <div class="row"><strong>${s.name}</strong><span class="muted">${s.level}%</span></div>
      <div class="bar"><i style="width:${s.level}%"></i></div>
      <div class="tags"><span class="tag">${s.category}</span></div>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', navActive);
