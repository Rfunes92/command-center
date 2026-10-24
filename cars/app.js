(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => n == null ? '—' : '$' + Number(n).toLocaleString('en-US');
  const miles = n => n == null ? '' : Number(n).toLocaleString('en-US') + ' mi';
  const TABS = ['overview', 'pipeline', 'workstreams', 'needs'];
  const CAR_SVG = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 30v-5l4-9a4 4 0 0 1 3.7-2.5h20.6A4 4 0 0 1 38 16l4 9v5a2 2 0 0 1-2 2h-2"/><path d="M10 32H8a2 2 0 0 1-2-2"/><path d="M18 32h12"/><circle cx="14" cy="32" r="4"/><circle cx="34" cy="32" r="4"/><path d="M8 24h32"/></svg>';
  let D = null, filter = 'all';

  const stageOf = id => D.stages.find(s => s.id === id) || { id, label: id };
  const byStage = id => D.vehicles.filter(v => v.stage === id);

  function photo(v, extra = '') {
    const alt = `${v.year} ${v.make} ${v.model}`;
    const img = v.photo
      ? `<img src="${esc(v.photo)}" alt="${esc(alt)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="640" height="360">`
      : '';
    return `<div class="ph">${img}<div class="nophoto" ${v.photo ? 'hidden' : ''}>${CAR_SVG}<span>Photo coming soon</span></div>${extra}</div>`;
  }

  function card(v) {
    const st = stageOf(v.stage);
    const sold = v.stage === 'sold';
    const extra =
      `<span class="pill"><i></i>${esc(st.label)}${sold && v.soldOn ? ' · ' + esc(v.soldOn) : ''}</span>` +
      (v.cotd ? '<span class="badge-cotd">Car of the Day</span>' : '') +
      (sold ? '<span class="ribbon" aria-hidden="true">SOLD</span>' : '');
    const title = v.title ? `<span class="tag ${v.title === 'rebuilt' ? 'reb' : ''}">${v.title === 'rebuilt' ? 'Rebuilt title' : 'Clean title'}</span>` : '';
    const fb = v.fb != null ? money(v.fb) : (v.stage === 'skipped' ? 'Not listed' : money(v.site != null ? v.site + 2000 : null));
    return `<article class="car st-${esc(v.stage)}${sold ? ' sold' : ''}" aria-label="${esc(v.year + ' ' + v.make + ' ' + v.model)}">
      ${photo(v, extra)}
      <div class="body">
        <div class="ttl"><span class="yr">${esc(v.year)}</span> ${esc(v.make)} ${esc(v.model)}</div>
        <div class="meta"><span>Stock <b class="num">#${esc(v.stock)}</b></span>${v.trim ? `<span>${esc(v.trim)}</span>` : ''}${v.miles ? `<span class="num">${miles(v.miles)}</span>` : ''}${title}</div>
        ${v.note ? `<div class="note-s">${esc(v.note)}</div>` : ''}
        <div class="prices">
          <div class="fb"><small>${sold ? 'Sold' : 'Facebook'}</small>${sold ? 'Off the lot' : esc(fb)}</div>
          ${v.site != null ? `<div class="site"><small>Site</small>${money(v.site)}</div>` : ''}
        </div>
      </div>
    </article>`;
  }

  function stageTile(id, label, hint, n, pressed, asLink) {
    const inner = `<div class="n">${n}</div><div class="l">${esc(label)}</div><div class="h">${esc(hint)}</div>`;
    return asLink
      ? `<a class="stage st-${id}" href="#pipeline/${id}" style="text-decoration:none">${inner}</a>`
      : `<button type="button" class="stage st-${id}" data-stage="${id}" aria-pressed="${pressed}">${inner}</button>`;
  }

  function renderStages() {
    $('#ov-stages').innerHTML = D.stages.map(s => stageTile(s.id, s.label, s.hint, byStage(s.id).length, false, true)).join('');
    $('#pl-stages').innerHTML =
      stageTile('all', 'All', 'Every vehicle', D.vehicles.length, filter === 'all') +
      D.stages.map(s => stageTile(s.id, s.label, s.hint, byStage(s.id).length, filter === s.id)).join('');
  }

  function renderGrid() {
    const stages = filter === 'all' ? D.stages : D.stages.filter(s => s.id === filter);
    let html = '';
    if (filter === 'all') {
      const list = D.stages.flatMap(s => byStage(s.id));
      $('#grid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty">${CAR_SVG}<b>No vehicles yet</b>Cars show up here once they hit the board.</div>`;
      wireImages($('#grid'));
      return;
    }
    for (const s of stages) {
      const list = byStage(s.id);
      if (!list.length) {
        html += `<div class="empty">${CAR_SVG}<b>Nothing in ${esc(s.label)} right now</b>${esc(s.hint)}. Cars show up here as they move.</div>`;
      } else html += list.map(card).join('');
    }
    $('#grid').innerHTML = html;
    wireImages($('#grid'));
  }

  function wireImages(root) {
    root.querySelectorAll('.ph img').forEach(img => {
      img.addEventListener('error', () => {
        const ph = img.closest('.ph');
        img.remove();
        ph && ph.querySelector('.nophoto')?.removeAttribute('hidden');
      }, { once: true });
      if (img.complete && img.naturalWidth === 0 && img.src) img.dispatchEvent(new Event('error'));
    });
  }

  function wsRow(w) {
    const pct = Math.max(0, Math.min(100, w.pct | 0));
    return `<div class="w s-${esc(w.status)}">
      <div style="min-width:0"><div class="w-n" title="${esc(w.name)}">${esc(w.name)}</div><div class="w-o" title="${esc(w.note || '')}">${esc(w.owner)}${w.note ? ' · ' + esc(w.note) : ''}</div></div>
      <div class="w-r"><span class="status">${esc(w.status)}</span><span class="pct">${pct}%</span></div>
      <div class="bar" role="progressbar" aria-label="${esc(w.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    </div>`;
  }

  function needItem(n, i) {
    return `<li class="p-${esc(n.priority)}"><span class="ix">${i + 1}</span><div><div class="t">${esc(n.title)}</div><div class="d">${esc(n.detail)}</div></div><span class="tg">${esc(n.tag)}</span></li>`;
  }

  function render() {
    $('#updated').textContent = D.updatedLabel;
    $('#updated').setAttribute('datetime', D.updated);
    const active = D.vehicles.filter(v => v.stage !== 'sold').length;
    const blocked = D.workstreams.filter(w => w.status === 'blocked').length;
    $('#cnt-pipeline').textContent = active;
    $('#cnt-work').textContent = D.workstreams.length;
    $('#cnt-needs').textContent = D.needs.length;
    $('#rule').textContent = D.priceRule;

    const sold = byStage('sold').length, ready = byStage('draft').length;
    $('#kpis').innerHTML = [
      ['c', 'Ready to post', ready, 'Drafts built'],
      ['', 'In the queue', byStage('queue').length, 'Next to build'],
      ['g', 'Sold today', sold, D.updatedLabel],
      ['a', 'Needs Ronnie', D.needs.length, `${blocked} workstreams blocked`]
    ].map(([c, l, v, s]) => `<div class="kpi ${c}"><div class="kpi-l">${l}</div><div class="kpi-v">${v}</div><div class="kpi-s">${esc(s)}</div></div>`).join('');

    const c = D.vehicles.find(v => v.cotd);
    $('#cotd').innerHTML = c ? `${photo(c)}
      <div><span class="eyebrow">★ Car of the Day</span>
      <h3>${esc(c.year)} ${esc(c.make)} ${esc(c.model)}</h3>
      <div class="trim">${esc(c.trim || '')} · Stock #${esc(c.stock)}${c.miles ? ' · ' + miles(c.miles) : ''}</div>
      <div class="prices"><div class="fb"><small>Facebook</small>${money(c.fb)}</div><div class="site"><small>Site</small>${money(c.site)}</div></div>
      ${c.note ? `<div class="note">${esc(c.note)}</div>` : ''}</div>`
      : `<div class="empty">${CAR_SVG}<b>No Car of the Day yet</b>Today's pick will show here.</div>`;
    wireImages($('#cotd'));

    $('#ov-needs').innerHTML = D.needs.slice(0, 4).map(needItem).join('');
    $('#needs').innerHTML = D.needs.map(needItem).join('');
    const rank = { blocked: 0, paused: 1, active: 2, done: 3 };
    $('#ov-ws').innerHTML = [...D.workstreams].sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9)).slice(0, 4).map(wsRow).join('');
    $('#ws').innerHTML = D.workstreams.map(wsRow).join('');
    const avg = Math.round(D.workstreams.reduce((a, w) => a + w.pct, 0) / D.workstreams.length);
    $('#ws-sum').textContent = `${D.workstreams.length} workstreams · ${avg}% average · ${blocked} blocked`;
    renderStages();
    renderGrid();
  }

  function route() {
    const [tab, sub] = (location.hash.slice(1) || 'overview').split('/');
    const t = TABS.includes(tab) ? tab : 'overview';
    if (t === 'pipeline' && sub !== undefined) filter = D && (sub === 'all' || D.stages.some(s => s.id === sub)) ? sub : 'all';
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.dataset.view !== t; });
    document.querySelectorAll('[data-tab]').forEach(a => {
      const on = a.dataset.tab === t;
      a.setAttribute('aria-selected', on);
      if (on) a.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    if (D && t === 'pipeline') { renderStages(); renderGrid(); }
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('button.stage');
    if (!b) return;
    filter = b.dataset.stage;
    history.replaceState(null, '', '#pipeline/' + filter);
    renderStages(); renderGrid();
    $('#pl-stages [data-stage="' + filter + '"]')?.focus();
  });
  addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

  fetch('data.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => { D = d; render(); route(); })
    .catch(err => { console.warn('data load failed', err); $('#err').hidden = false; route(); });
})();
