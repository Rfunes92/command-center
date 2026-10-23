/* Ronnie's Command Center v2 · app logic. Data lives in data.js. */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const fmtSize = b => b == null ? "" : b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(b < 10240 ? 1 : 0) + " KB" : (b / 1048576).toFixed(1) + " MB";
const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const TZ = "America/New_York";
const REPO = "https://github.com/Rfunes92/command-center/blob/main/";
const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
const store = {
  get(k, d) { try { const v = localStorage.getItem("cc." + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("cc." + k, JSON.stringify(v)); } catch {} },
};

/* ---------- icons ---------- */
const P = {
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  rocket:'<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2"/><path d="M9 15 6 12c1-4 5-9 12-9 0 7-5 11-9 12z"/><circle cx="14.5" cy="9.5" r="1.5"/>',
  cube:'<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  photo:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  note:'<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 17h5"/>',
  star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  check:'<path d="m5 12 5 5 9-10"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  ext:'<path d="M7 17 17 7M8 7h9v9"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  menu:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  play:'<path d="M7 5v14l12-7z"/>',
  music:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  server:'<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  pin:'<path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  dumbbell:'<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',
  chart:'<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2"/><path d="M6 6V5a2 2 0 0 1 2-2h9"/>',
  book:'<path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z"/><path d="M4 16a4 4 0 0 1 4-4h10"/>',
  gauge:'<path d="M12 14l4-4"/><path d="M3.5 18a9 9 0 1 1 17 0"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  kanban:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v8M12 7v4M16 7v10"/>',
  flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',
  list:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
};
const ic = (n, size = 18, color = "currentColor", sw = 2, fill = "none") => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.link}</svg>`;

/* ---------- model ---------- */
const projColor = p => (CC.projects && CC.projects[p]) || "#8d98a5";
const CARDS = [];
CC.sections.forEach(s => s.links.forEach(l => CARDS.push({ ...l, id: s.id + "/" + slug(l.title), section: s })));
const FILES = CC.files.map((f, i) => ({ ...f, id: "f" + i + "-" + slug(f.name) }));
const MEDIA = CC.media.map((m, i) => ({ ...m, id: "m" + i + "-" + slug(m.title) }));
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const VIEWS = [
  { id: "home", label: "Home", icon: "home", group: "Overview" },
  ...CC.sections.map(s => ({ id: s.id, label: s.nav || s.title, icon: s.icon || "grid", group: "Workspace", count: s.links.length, section: s })),
  { id: "files", label: "Files", icon: "folder", group: "Library", count: FILES.length },
  { id: "media", label: "Images & Media", icon: "photo", group: "Library", count: MEDIA.length },
  { id: "notes", label: "Notes", icon: "note", group: "Library" },
];
let favs = store.get("favs", null) || CC.defaultFavorites.map(t => (CARDS.find(c => c.title === t) || {}).id).filter(Boolean);
let recent = store.get("recent", []);
const isFav = id => favs.includes(id);
function toggleFav(id) {
  favs = isFav(id) ? favs.filter(x => x !== id) : [...favs, id]; store.set("favs", favs);
  toast(isFav(id) ? "Pinned to Favorites" : "Removed from Favorites", isFav(id) ? "star" : "check");
  render(false); buildNav();
}
function addRecent(kind, id) {
  recent = [{ kind, id, t: Date.now() }, ...recent.filter(r => !(r.kind === kind && r.id === id))].slice(0, 8);
  store.set("recent", recent);
}
const fileUrl = f => f.private ? null : /\.(md|vtt)$/i.test(f.path) ? REPO + f.path : f.path;

/* ---------- toast ---------- */
let tt;
function toast(msg, icon = "check") { const t = $("#toast"); t.innerHTML = ic(icon, 16, "#00e5ff") + esc(msg); t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }
async function copy(text) {
  try { await navigator.clipboard.writeText(text); } catch { const a = document.createElement("textarea"); a.value = text; document.body.append(a); a.select(); document.execCommand("copy"); a.remove(); }
  toast("Link copied");
}

/* ---------- renderers ---------- */
const cardHTML = (c, i = 0) => `
  <div class="card${isFav(c.id) ? " pinned-card" : ""}" style="--i:${i}" role="link" tabindex="0" data-open-card="${c.id}" title="${esc(c.url)}">
    <div class="tile" style="background:${hexA(c.color, .14)};border:1px solid ${hexA(c.color, .3)}">${ic(c.icon, 20, c.color)}</div>
    <div class="body"><div class="ttl">${esc(c.title)}</div><div class="site">${esc(c.sub || host(c.url))}</div><span class="tag">${esc(c.tag)}</span></div>
    ${isFav(c.id) ? `<span class="star">${ic("star", 14, "#fbbf24", 2, "#fbbf24")}</span>` : ""}
    <div class="acts">
      <button class="copy" data-copy="${esc(c.url)}" title="Copy link" aria-label="Copy link">${ic("copy", 15)}</button>
      <button class="pin${isFav(c.id) ? " pinned" : ""}" data-fav="${c.id}" title="${isFav(c.id) ? "Unpin" : "Pin to Favorites"}" aria-label="Pin">${ic("star", 15, "currentColor", 2, isFav(c.id) ? "currentColor" : "none")}</button>
    </div>
  </div>`;

const TYPE_COLORS = { pdf: "#ef4444", docx: "#3b82f6", md: "#94a3b8", csv: "#22c55e", vtt: "#a855f7", mp4: "#f59e0b", wav: "#f59e0b", mp3: "#f59e0b", png: "#14b8a6", jpg: "#14b8a6" };
const ficon = t => { const c = TYPE_COLORS[t] || "#94a3b8"; return `<div class="ficon" style="background:${hexA(c, .13)};border:1px solid ${hexA(c, .3)};color:${c}">${esc(t.toUpperCase())}</div>`; };
const ptag = p => p ? `<span class="ptag"><i style="background:${projColor(p)}"></i>${esc(p)}</span>` : "";
const lockB = (t = "Private") => `<span class="lock">${ic("lock", 11, "currentColor", 2.4)}${t}</span>`;

function fileRows(list) {
  return list.map((f, i) => `
    <tr class="${f.private ? "priv" : ""}" style="--i:${i}">
      <td class="c-name"><div class="fname">${ficon(f.type)}<div style="min-width:0"><div class="n">${esc(f.name)}</div>${f.private ? `<div class="note">${esc(f.note || "Private, not published")}</div>` : `<div class="note">${esc(f.path.split("/").pop())}</div>`}</div></div></td>
      <td class="c-proj">${ptag(f.project)}</td>
      <td class="c-size num">${fmtSize(f.size)}</td>
      <td class="c-date num">${fmtDate(f.added)}</td>
      <td class="c-act"><div class="btns">${f.private ? lockB() : `
        ${f.type !== "docx" ? `<a class="btn" href="${esc(fileUrl(f))}" target="_blank" rel="noopener" data-rec="file:${f.id}">${ic("ext", 14)}Open</a>` : ""}
        <a class="btn primary" href="${esc(f.path)}" download data-rec="file:${f.id}">${ic("download", 14, "currentColor", 2.2)}<span class="lbl2">Download</span></a>`}</div></td>
    </tr>`).join("");
}
const fileTable = list => list.length ? `<div class="glass" style="overflow:hidden"><table class="ftable"><thead><tr><th>Name</th><th>Project</th><th>Size</th><th>Added</th><th style="text-align:right">Actions</th></tr></thead><tbody>${fileRows(list)}</tbody></table></div>` : emptyHTML("No files here yet", "Add one in data.js under CC.files.");

const isLogoish = m => m.type === "Logo" || (m.w && m.w < 600 && m.h < 600);
function mediaTile(m, i) {
  if (m.private) return `<div class="tilem priv" style="--i:${i}"><div class="lockph">${ic("lock", 30, "#fbbf24", 1.8)}</div><div class="meta"><div style="min-width:0;flex:1"><div class="mt">${esc(m.title)}</div><div class="ms">${esc(m.note || "Private")}</div></div>${lockB()}</div></div>`;
  let top = "";
  if (m.kind === "image") top = `<button class="ph${isLogoish(m) ? " contain" : ""}" data-lb="${m.id}" aria-label="Preview ${esc(m.title)}"><img src="${esc(m.thumb || m.src)}" alt="${esc(m.title)}" loading="lazy" ${m.w && !isLogoish(m) ? `width="${m.w}" height="${Math.round(m.h > m.w * 1.6 ? m.w * .75 : m.h)}"` : ""}><span class="kind">${esc(m.type || "Image")}</span></button>`;
  else if (m.kind === "video") top = `<video controls playsinline preload="none" poster="${esc(m.poster || "")}" data-rec="media:${m.id}"><source src="${esc(m.src)}" type="video/mp4">${m.captions ? `<track kind="captions" src="${esc(m.captions)}" srclang="en" label="English">` : ""}</video>`;
  else if (m.kind === "audio") top = `<div class="au"><div class="wave">${Array.from({ length: 34 }, (_, k) => `<i style="height:${18 + Math.round(Math.abs(Math.sin(k * 1.7) * Math.cos(k * .45)) * 82)}%"></i>`).join("")}</div><audio controls preload="none" src="${esc(m.src)}" data-rec="media:${m.id}"></audio></div>`;
  return `<div class="tilem" style="--i:${i}">${top}<div class="meta"><div style="min-width:0;flex:1"><div class="mt">${esc(m.title)}</div><div class="ms">${esc(m.project)} · ${m.kind === "image" ? esc(m.type || "Image") : m.kind === "video" ? "Video" : "Audio"} · ${fmtSize(m.size)}</div></div><a class="dl" href="${esc(m.src)}" download title="Download" aria-label="Download">${ic("download", 15)}</a></div></div>`;
}
const emptyHTML = (t, s) => `<div class="empty">${ic("folder", 30, "#5f6a77", 1.6)}<div class="et">${esc(t)}</div><div>${s}</div></div>`;

function nyNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour };
}
function daysLeft() { const n = nyNow(); const [y, m, d] = CC.goal.deadline.split("-").map(Number); return Math.max(0, Math.round((Date.UTC(y, m - 1, d) - Date.UTC(n.y, n.m - 1, n.d)) / 864e5)); }
const greeting = () => { const h = nyNow().h; return h < 5 ? "Up late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

function resolveRecent(r) {
  if (r.kind === "card") { const c = CARDS.find(x => x.id === r.id); return c && { t: c.title, s: c.section.title, color: c.color, icon: c.icon, attr: `data-open-card="${c.id}"` }; }
  if (r.kind === "file") { const f = FILES.find(x => x.id === r.id); return f && { t: f.name, s: "File · " + f.project, color: TYPE_COLORS[f.type] || "#94a3b8", icon: "file", attr: `data-open-file="${f.id}"` }; }
  if (r.kind === "media") { const m = MEDIA.find(x => x.id === r.id); return m && { t: m.title, s: (m.kind === "image" ? "Image" : m.kind === "video" ? "Video" : "Audio") + " · " + m.project, color: projColor(m.project), icon: m.kind === "image" ? "image" : m.kind === "video" ? "play" : "music", attr: m.kind === "image" ? `data-lb="${m.id}"` : `data-go="media"` }; }
}
const ago = t => { const s = (Date.now() - t) / 1000; return s < 60 ? "just now" : s < 3600 ? Math.floor(s / 60) + "m ago" : s < 86400 ? Math.floor(s / 3600) + "h ago" : Math.floor(s / 86400) + "d ago"; };

const V = {};
V.home = () => {
  const dl = daysLeft(), g = CC.goal, pct = Math.min(1, g.signed / g.target), C = 2 * Math.PI * 48;
  const favCards = favs.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const rec = recent.map(r => ({ ...resolveRecent(r), t0: r.t })).filter(r => r.t);
  const pub = MEDIA.filter(m => m.kind === "image" && !m.private), feat = pub.filter(m => m.featured);
  const imgs = (feat.length ? feat : pub).slice(0, 6);
  const now = new Date().toLocaleDateString("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric" });
  return `
  <div class="hero"><div><div class="eyebrow">${ic("clock", 13, "#00e5ff", 2.4)}${esc(now)}</div><h1>${greeting()}, <span class="hl">Ronnie</span></h1><p>${dl} days to ${fmtDate(g.deadline).replace(/, \d+$/, "")} · ${g.signed} of ${g.target} founding clients signed · ${g.prospects} prospects ready</p></div>
    <div class="chips"><a class="chip" href="#/files">${ic("folder", 15)}Files</a><a class="chip" href="#/media">${ic("photo", 15)}Images</a><button class="chip" data-act="palette">${ic("arrow", 15)}Jump to…</button></div></div>
  <div class="upnext"><div class="ic">${ic("arrow", 20, "currentColor", 2.6)}</div><div><div class="k">Up next</div><div class="v">${esc(CC.upNext)}</div></div></div>
  <div class="panels">
    <div class="panel glass"><h3>${ic("list", 17, "#00e5ff")}Where things stand</h3><div class="meta">Status as of ${esc(CC.statusAsOf)}</div>
      <ul class="status">${CC.status.map((s, i) => `<li style="--i:${i}"><span class="pill s-${esc(s.state)}">${esc(s.state)}</span><span>${esc(s.text)}</span></li>`).join("")}</ul></div>
    <div class="panel glass"><h3>${ic("flag", 17, "#00e5ff")}Road to ${g.target} clients</h3><div class="meta">${dl ? `${dl} day${dl === 1 ? "" : "s"} to sign ${g.target - g.signed} more` : "Deadline reached"}</div>
      <div class="goal">
        <div class="ring"><svg width="112" height="112" viewBox="0 0 112 112"><circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10"/><circle cx="56" cy="56" r="48" fill="none" stroke="url(#rg)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.max(pct, .015))}" style="filter:drop-shadow(0 0 6px rgba(0,229,255,.6))"/><defs><linearGradient id="rg"><stop offset="0" stop-color="#00b8cc"/><stop offset="1" stop-color="#00e5ff"/></linearGradient></defs></svg>
          <div class="rv"><div><b>${g.signed}<span style="display:inline;font-size:16px;color:#5f6a77">/${g.target}</span></b><span>signed</span></div></div></div>
        <div class="stats"><div class="stat hl"><span class="k">Days left</span><span class="v">${dl}</span></div><div class="stat"><span class="k">Prospects ready</span><span class="v">${g.prospects}</span></div><div class="stat"><span class="k">Deadline</span><span class="v">${fmtDate(g.deadline).replace(/, \d+$/, "")}</span></div></div>
      </div>
      <div class="bar" title="${g.signed} of ${g.target} signed"><i style="width:${pct * 100}%"></i></div>
    </div>
  </div>
  <div class="sec-head"><h2>${ic("star", 16, "#fbbf24", 2, "#fbbf24")}Favorites</h2><span class="sub">Tap the star on any card to pin or unpin</span></div>
  ${favCards.length ? `<div class="grid">${favCards.map(cardHTML).join("")}</div>` : emptyHTML("No favorites yet", "Hover a card and tap the star to pin it here.")}
  <div class="sec-head"><h2>${ic("clock", 16, "#00e5ff")}Recently opened</h2><span class="sub">On this device</span>${rec.length ? `<span class="right"><button class="linkbtn" data-act="clear-recent">Clear</button></span>` : ""}</div>
  ${rec.length ? `<div class="recent">${rec.map(r => `<div class="ritem" ${r.attr} tabindex="0"><div class="mini" style="background:${hexA(r.color, .14)}">${ic(r.icon, 15, r.color)}</div><div style="min-width:0;flex:1"><div class="rt">${esc(r.t)}</div><div class="rs">${esc(r.s)} · ${ago(r.t0)}</div></div></div>`).join("")}</div>`
    : `<div class="empty" style="padding:22px">Anything you open (cards, files, images) shows up here for one-tap access.</div>`}
  <div class="sec-head"><h2>${ic("photo", 16, "#00e5ff")}From the library</h2><span class="sub">${MEDIA.filter(m => !m.private).length} images & clips, ${FILES.filter(f => !f.private).length} files</span><span class="right"><a class="linkbtn" href="#/media">Open Images & Media →</a></span></div>
  <div class="strip">${imgs.map(m => `<button data-lb="${m.id}" aria-label="${esc(m.title)}"><img src="${esc(m.thumb)}" alt="${esc(m.title)}" loading="lazy"></button>`).join("")}</div>`;
};

function sectionView(s) {
  const cards = CARDS.filter(c => c.section === s);
  const files = s.project ? FILES.filter(f => f.project === s.project) : [];
  const media = s.project ? MEDIA.filter(m => m.project === s.project) : [];
  return `
  <div class="hero"><div><div class="eyebrow">${ic(s.icon || "grid", 13, "#00e5ff", 2.4)}Workspace</div><h1>${esc(s.title)}</h1><p>${esc(s.desc || "")}</p></div>
    <div class="chips"><span class="chip" style="cursor:default">${cards.length} links</span>${files.length ? `<a class="chip" href="#/files?p=${encodeURIComponent(s.project)}">${files.length} files</a>` : ""}${media.length ? `<a class="chip" href="#/media?p=${encodeURIComponent(s.project)}">${media.length} media</a>` : ""}</div></div>
  <div class="grid">${cards.map(cardHTML).join("")}</div>
  ${files.length ? `<div class="sec-head"><h2>${ic("folder", 16, "#00e5ff")}Files</h2><span class="right"><a class="linkbtn" href="#/files?p=${encodeURIComponent(s.project)}">All ${esc(s.project)} files →</a></span></div>${fileTable(files.slice(0, 6))}` : ""}
  ${media.length ? `<div class="sec-head"><h2>${ic("photo", 16, "#00e5ff")}Images & media</h2><span class="right"><a class="linkbtn" href="#/media?p=${encodeURIComponent(s.project)}">Open gallery →</a></span></div><div class="gallery">${media.slice(0, 8).map(mediaTile).join("")}</div>` : ""}`;
}

const state = { fp: "All", fq: "", mp: "All", mk: "All" };
V.files = () => {
  const projs = [...new Set(FILES.map(f => f.project))];
  return `
  <div class="hero"><div><div class="eyebrow">${ic("folder", 13, "#00e5ff", 2.4)}Library</div><h1>Files</h1><p>Templates, scripts and docs worth keeping. Private items are listed so you know they exist, but are never published.</p></div></div>
  <div class="toolbar">
    <label class="field">${ic("note", 15)}<input id="fq" placeholder="Filter files…" value="${esc(state.fq)}" autocomplete="off"></label>
    <div class="chips" id="fchips">${["All", ...projs].map(p => `<button class="chip${state.fp === p ? " on" : ""}" data-fp="${esc(p)}">${p !== "All" ? `<span class="dot" style="background:${projColor(p)}"></span>` : ""}${esc(p)}<span class="n">${p === "All" ? FILES.length : FILES.filter(f => f.project === p).length}</span></button>`).join("")}</div>
  </div>
  <div id="ftab"></div>`;
};
function drawFiles() {
  const q = state.fq.trim().toLowerCase();
  const list = FILES.filter(f => (state.fp === "All" || f.project === state.fp) && (!q || (f.name + " " + f.type + " " + f.project).toLowerCase().includes(q)));
  list.sort((a, b) => (a.private ? 1 : 0) - (b.private ? 1 : 0));
  $("#ftab").innerHTML = list.length ? fileTable(list) : emptyHTML(`No files match "${state.fq}"`, `<button class="linkbtn" data-act="fclear">Clear filters</button>`);
}
V.media = () => {
  const projs = [...new Set(MEDIA.map(m => m.project))];
  const kinds = [["All", "All"], ["image", "Images"], ["video", "Video"], ["audio", "Audio"]];
  return `
  <div class="hero"><div><div class="eyebrow">${ic("photo", 13, "#00e5ff", 2.4)}Library</div><h1>Images & Media</h1><p>Logos, brand graphics, mockups and clips. Tap an image to preview, videos and audio play right here.</p></div></div>
  <div class="toolbar"><div class="chips">${kinds.map(([k, l]) => `<button class="chip${state.mk === k ? " on" : ""}" data-mk="${k}">${l}<span class="n">${k === "All" ? MEDIA.length : MEDIA.filter(m => m.kind === k).length}</span></button>`).join("")}</div>
    <span style="width:1px;height:24px;background:var(--line2)"></span>
    <div class="chips">${["All", ...projs].map(p => `<button class="chip${state.mp === p ? " on" : ""}" data-mp="${esc(p)}">${p !== "All" ? `<span class="dot" style="background:${projColor(p)}"></span>` : ""}${p === "All" ? "All projects" : esc(p)}</button>`).join("")}</div></div>
  <div class="gallery" id="gal"></div>`;
};
let lbList = [];
function drawMedia() {
  const list = MEDIA.filter(m => (state.mk === "All" || m.kind === state.mk) && (state.mp === "All" || m.project === state.mp));
  list.sort((a, b) => (a.private ? 1 : 0) - (b.private ? 1 : 0));
  $("#gal").innerHTML = list.length ? list.map(mediaTile).join("") : "";
  if (!list.length) $("#gal").outerHTML = `<div id="gal">${emptyHTML("Nothing here yet", "Try another filter.")}</div>`;
}
V.notes = () => `
  <div class="hero"><div><div class="eyebrow">${ic("note", 13, "#00e5ff", 2.4)}Library</div><h1>Notes</h1><p>A quick scratchpad. Saved automatically in this browser only, never uploaded.</p></div></div>
  <div class="glass notes"><textarea id="notes" placeholder="Ideas, call notes, things to remember…">${esc(store.get("notes", ""))}</textarea><div class="nf"><span id="nsaved">Saved on this device</span><span id="ncount"></span></div></div>`;

/* ---------- router ---------- */
let current = "home";
function parseHash() { const h = location.hash.replace(/^#\/?/, ""); const [p, qs] = h.split("?"); return { id: p || "home", q: new URLSearchParams(qs || "") }; }
function render(animate = true) {
  const { id, q } = parseHash();
  const view = VIEWS.find(v => v.id === id) || VIEWS[0];
  current = view.id;
  if (q.get("p")) { if (view.id === "files") state.fp = q.get("p"); if (view.id === "media") state.mp = q.get("p"); }
  const c = $("#content");
  c.innerHTML = `<div class="view"${animate ? "" : ' style="animation:none"'}>${view.section ? sectionView(view.section) : V[view.id]()}</div>`;
  if (!animate) $$(".card,.status li,.tilem,.ftable tbody tr", c).forEach(e => e.style.animation = "none");
  if (view.id === "files") { drawFiles(); $("#fq").addEventListener("input", e => { state.fq = e.target.value; drawFiles(); }); }
  if (view.id === "media") drawMedia();
  if (view.id === "notes") { const t = $("#notes"), cnt = () => $("#ncount").textContent = t.value.trim() ? t.value.trim().split(/\s+/).length + " words" : ""; cnt(); let to; t.addEventListener("input", () => { $("#nsaved").textContent = "Saving…"; clearTimeout(to); to = setTimeout(() => { store.set("notes", t.value); $("#nsaved").textContent = "Saved on this device"; }, 350); cnt(); }); }
  $("#crumb").textContent = view.section ? view.section.title : view.label;
  document.title = (view.id === "home" ? "Command Center" : (view.section ? view.section.title : view.label) + " · Command Center") + " · Ronnie";
  $$("#nav a, #tabbar a").forEach(a => a.classList.toggle("on", a.dataset.v === view.id));
  document.body.classList.remove("drawer");
  if (animate) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}
function buildNav() {
  let html = "", g = "";
  VIEWS.forEach(v => { if (v.group !== g) { g = v.group; html += `<div class="navlabel">${g}</div>`; } html += `<a href="#/${v.id}" data-v="${v.id}" title="${esc(v.label)}">${ic(v.icon, 18)}<span class="lbl">${esc(v.label)}</span>${v.count ? `<span class="badge">${v.count}</span>` : ""}</a>`; });
  $("#nav").innerHTML = html;
  const tabs = [["home", "Home", "home"], ["rokhal", "Rokhal", "rocket"], ["files", "Files", "folder"], ["media", "Media", "photo"]];
  $("#tabbar").innerHTML = tabs.map(([v, l, i]) => `<a href="#/${v}" data-v="${v}">${ic(i, 21)}<span>${l}</span></a>`).join("") + `<button data-act="drawer">${ic("menu", 21)}<span>More</span></button>`;
  $$("#nav a, #tabbar a").forEach(a => a.classList.toggle("on", a.dataset.v === current));
}

/* ---------- open actions ---------- */
function openCard(id) { const c = CARDS.find(x => x.id === id); if (!c) return; addRecent("card", id); window.open(c.url, "_blank", "noopener"); }
function openFile(id) { const f = FILES.find(x => x.id === id); if (!f) return; if (f.private) return toast("Private item, not published", "lock"); addRecent("file", id); window.open(fileUrl(f), "_blank", "noopener"); }

/* lightbox */
let lbI = 0;
function openLB(id) {
  const scope = current === "media" ? $$("#gal [data-lb]").map(b => b.dataset.lb) : null;
  lbList = (scope && scope.includes(id) ? scope : MEDIA.filter(m => m.kind === "image" && !m.private).map(m => m.id));
  lbI = Math.max(0, lbList.indexOf(id)); showLB(); $("#lb").classList.add("open"); document.body.style.overflow = "hidden";
}
function showLB() {
  const m = MEDIA.find(x => x.id === lbList[lbI]); if (!m) return; addRecent("media", m.id);
  const img = $("#lbImg"); img.src = m.src; img.alt = m.title;
  $("#lbStage").classList.toggle("tall", m.h > m.w * 1.6); $("#lbStage").scrollTop = 0;
  $("#lbT").textContent = m.title; $("#lbS").textContent = `${m.project} · ${m.type || "Image"} · ${m.w}×${m.h} · ${fmtSize(m.size)} · ${lbI + 1} of ${lbList.length}`;
  $("#lbDl").href = m.src; $("#lbOpen").href = m.src;
}
const closeLB = () => { $("#lb").classList.remove("open"); document.body.style.overflow = ""; if (current === "home") render(false); };
const stepLB = d => { lbI = (lbI + d + lbList.length) % lbList.length; showLB(); };

/* palette */
let palItems = [], palSel = 0;
function palIndex() {
  return [
    ...VIEWS.map(v => ({ g: "Go to", t: v.section ? v.section.title : v.label, s: "View", icon: v.icon, color: "#00e5ff", run: () => location.hash = "#/" + v.id })),
    ...CARDS.map(c => ({ g: "Cards", t: c.title, s: c.section.title + " · " + (c.sub || host(c.url)), icon: c.icon, color: c.color, k: c.tag, run: () => openCard(c.id) })),
    ...FILES.map(f => ({ g: "Files", t: f.name, s: f.project + " · " + f.type.toUpperCase() + (f.private ? " · Private" : ""), icon: f.private ? "lock" : "file", color: f.private ? "#fbbf24" : (TYPE_COLORS[f.type] || "#94a3b8"), run: () => f.private ? toast("Private item, not published", "lock") : openFile(f.id) })),
    ...MEDIA.map(m => ({ g: "Images & media", t: m.title, s: m.project + " · " + (m.type || m.kind) + (m.private ? " · Private" : ""), icon: m.private ? "lock" : m.kind === "image" ? "image" : m.kind === "video" ? "play" : "music", color: m.private ? "#fbbf24" : projColor(m.project), img: m.kind === "image" && !m.private ? m.thumb : null, run: () => m.private ? toast("Private item, not published", "lock") : m.kind === "image" ? openLB(m.id) : (state.mk = m.kind, location.hash = "#/media", render()) })),
  ];
}
let PAL;
function palRender() {
  const q = $("#palQ").value.trim().toLowerCase(), terms = q.split(/\s+/).filter(Boolean);
  let list;
  if (!terms.length) {
    const rec = recent.slice(0, 5).map(r => { const x = resolveRecent(r); if (!x) return null; return PAL.find(p => p.t === x.t && p.g !== "Go to"); }).filter(Boolean).map(p => ({ ...p, g: "Recent" }));
    list = [...rec, ...PAL.filter(p => p.g === "Go to"), ...favs.map(id => CARDS.find(c => c.id === id)).filter(Boolean).map(c => ({ ...PAL.find(p => p.g === "Cards" && p.t === c.title), g: "Favorites" }))];
  } else {
    list = PAL.map(p => { const h = (p.t + " " + p.s + " " + (p.k || "") + " " + p.g).toLowerCase(); if (!terms.every(t => h.includes(t))) return null; const tl = p.t.toLowerCase(); return { ...p, sc: (tl.startsWith(q) ? 0 : tl.includes(q) ? 1 : 2) }; }).filter(Boolean);
    const order = ["Go to", "Cards", "Files", "Images & media"]; list.sort((a, b) => order.indexOf(a.g) - order.indexOf(b.g) || a.sc - b.sc); list = list.slice(0, 40);
  }
  palItems = list; palSel = Math.min(palSel, Math.max(0, list.length - 1));
  let g = "", html = "";
  list.forEach((p, i) => { if (p.g !== g) { g = p.g; html += `<div class="pal-g">${esc(g)}</div>`; } html += `<div class="pal-i${i === palSel ? " sel" : ""}" data-pi="${i}"><div class="mini" style="background:${hexA(p.color, .14)}">${p.img ? `<img src="${esc(p.img)}" alt="">` : ic(p.icon, 15, p.color)}</div><div style="min-width:0"><div class="pt">${esc(p.t)}</div><div class="ps">${esc(p.s)}</div></div><span class="go">${p.g === "Go to" ? "Go" : "Open"} ↵</span></div>`; });
  $("#palList").innerHTML = html || `<div class="empty" style="margin:8px;border:0">${ic("note", 26, "#5f6a77", 1.6)}<div class="et">No results for "${esc(q)}"</div><div>Try a site, project or file type.</div></div>`;
  const sel = $(".pal-i.sel"); sel && sel.scrollIntoView({ block: "nearest" });
}
function openPal() { PAL = palIndex(); $("#pal").classList.add("open"); const i = $("#palQ"); i.value = ""; palSel = 0; palRender(); i.focus(); }
const closePal = () => $("#pal").classList.remove("open");
function runPal(i) { const p = palItems[i]; if (!p) return; closePal(); p.run(); }

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const cp = t.closest("[data-copy]"); if (cp) { e.stopPropagation(); return copy(cp.dataset.copy); }
  const fv = t.closest("[data-fav]"); if (fv) { e.stopPropagation(); return toggleFav(fv.dataset.fav); }
  const oc = t.closest("[data-open-card]"); if (oc) return openCard(oc.dataset.openCard);
  const of = t.closest("[data-open-file]"); if (of) return openFile(of.dataset.openFile);
  const lb = t.closest("[data-lb]"); if (lb) return openLB(lb.dataset.lb);
  const rc = t.closest("[data-rec]"); if (rc) { const [k, id] = rc.dataset.rec.split(":"); addRecent(k, id); }
  const go = t.closest("[data-go]"); if (go) { location.hash = "#/" + go.dataset.go; return; }
  const fp = t.closest("[data-fp]"); if (fp) { state.fp = fp.dataset.fp; $$("#fchips .chip").forEach(c => c.classList.toggle("on", c === fp)); return drawFiles(); }
  const mk = t.closest("[data-mk]"); if (mk) { state.mk = mk.dataset.mk; $$("[data-mk]").forEach(c => c.classList.toggle("on", c === mk)); return drawMedia(); }
  const mp = t.closest("[data-mp]"); if (mp) { state.mp = mp.dataset.mp; $$("[data-mp]").forEach(c => c.classList.toggle("on", c === mp)); return drawMedia(); }
  const pi = t.closest("[data-pi]"); if (pi) return runPal(+pi.dataset.pi);
  const a = t.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act;
  if (act === "pal-bg" && t !== a) return;
  ({
    palette: openPal, "pal-bg": closePal,
    drawer: () => document.body.classList.add("drawer"), "drawer-close": () => document.body.classList.remove("drawer"),
    collapse: () => { document.body.classList.toggle("collapsed"); store.set("collapsed", document.body.classList.contains("collapsed")); },
    density: () => { const on = document.body.classList.toggle("compact"); store.set("compact", on); $("#densLbl").textContent = on ? "Comfortable view" : "Compact view"; toast(on ? "Compact view" : "Comfortable view", "menu"); },
    "lb-close": closeLB, "lb-prev": () => stepLB(-1), "lb-next": () => stepLB(1),
    "clear-recent": () => { recent = []; store.set("recent", []); render(false); },
    fclear: () => { state.fq = ""; state.fp = "All"; render(false); },
  }[act] || (() => {}))();
});
document.addEventListener("play", e => { const r = e.target.dataset && e.target.dataset.rec; if (r) { const [k, id] = r.split(":"); addRecent(k, id); } $$("video,audio").forEach(m => m !== e.target && m.pause()); }, true);
document.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); return $("#pal").classList.contains("open") ? closePal() : openPal(); }
  if ($("#pal").classList.contains("open")) {
    if (e.key === "Escape") return closePal();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); palSel = (palSel + (e.key === "ArrowDown" ? 1 : -1) + palItems.length) % Math.max(1, palItems.length); return palRender(); }
    if (e.key === "Enter") { e.preventDefault(); return runPal(palSel); }
    return;
  }
  if ($("#lb").classList.contains("open")) { if (e.key === "Escape") closeLB(); if (e.key === "ArrowRight") stepLB(1); if (e.key === "ArrowLeft") stepLB(-1); return; }
  if (e.key === "Escape") document.body.classList.remove("drawer");
  if (!typing && e.key === "/") { e.preventDefault(); openPal(); }
  if (!typing && e.key === "Enter" && document.activeElement.dataset.openCard) openCard(document.activeElement.dataset.openCard);
});
$("#palQ").addEventListener("input", () => { palSel = 0; palRender(); });
$("#lb").addEventListener("click", e => { if (e.target.id === "lbStage") closeLB(); });
window.addEventListener("hashchange", () => render());
let tx = 0; document.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
document.addEventListener("touchend", e => { if (!$("#lb").classList.contains("open")) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) stepLB(dx < 0 ? 1 : -1); }, { passive: true });

/* ---------- boot ---------- */
if (store.get("compact", false)) { document.body.classList.add("compact"); $("#densLbl").textContent = "Comfortable view"; }
if (store.get("collapsed", false)) document.body.classList.add("collapsed");
$("#kk1").textContent = $("#kk2").textContent = isMac ? "⌘K" : "Ctrl K";
function tick() { const n = new Date(); $("#time").textContent = n.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }); $("#date").textContent = n.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric" }) + " · ET"; }
tick(); setInterval(tick, 15000);
buildNav(); render();
})();
