/* Ronnie's Command Center v3 · app logic (vanilla, no build). Data lives in data.js. */
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtSize = b => b == null ? "" : b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(b < 10240 ? 1 : 0) + " KB" : (b / 1048576).toFixed(1) + " MB";
const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
const TZ = "America/New_York";
const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
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
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',
  car:'<path d="M5 17h14v-5l-2-5H7l-2 5z"/><path d="M5 12h14"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
  chev:'<path d="m6 9 6 6 6-6"/>',
  list:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>',
  rows:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
};
const ic = (n, size = 18, color = "currentColor", sw = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.link}</svg>`;

/* ---------- model ---------- */
const projColor = p => (CC.projects && CC.projects[p]) || "#8d98a5";
const CARDS = [];
CC.sections.forEach(s => s.links.forEach(l => CARDS.push({ ...l, id: s.id + "/" + slug(l.title), section: s })));
const FILES = CC.files.map((f, i) => ({ ...f, id: "f" + i + "-" + slug(f.name) }));
const MEDIA = CC.media.map((m, i) => ({ ...m, id: "m" + i + "-" + slug(m.title) }));
const TEAM = (CC.team || []).map(m => ({ ...m, ...((CC.agentStatus || {})[m.name] || { state: "standby", now: "" }) }));
const DEADLINES = (CC.deadlines || []).map((d, i) => ({ ...d, id: "d" + i }));
const isExt = u => /^https?:/i.test(u || "");
const VIEWS = [
  { id: "home", label: "Home", icon: "home", group: "Overview" },
  { id: "folders", label: "All apps", icon: "grid", group: "Overview", count: CARDS.length },
  { id: "team", label: "Agents", icon: "bot", group: "Overview", count: TEAM.length },
  ...CC.sections.map(s => ({ id: s.id, label: s.nav || s.title, icon: s.icon || "grid", group: "Folders", count: s.links.length, section: s })),
  { id: "library", label: "Project library", icon: "layers", group: "Library", count: FILES.length + MEDIA.length },
  { id: "files", label: "Files", icon: "folder", group: "Library", count: FILES.length },
  { id: "media", label: "Images & Media", icon: "photo", group: "Library", count: MEDIA.length },
  { id: "notes", label: "Notes", icon: "note", group: "Library" },
];
let favs = store.get("favs", null) || CC.defaultFavorites.map(t => (CARDS.find(c => c.title === t) || {}).id).filter(Boolean);
let recent = store.get("recent", []);
const state = { lp: "All", lk: "all", lq: "", layout: store.get("libLayout", "grid") };

/* ---------- time (ET) ---------- */
function etOffsetMin(ms) {
  try {
    const s = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" }).formatToParts(new Date(ms)).find(p => p.type === "timeZoneName").value;
    const m = s.match(/GMT([+-]\d+)(?::(\d+))?/); if (m) return (+m[1]) * 60 + (m[2] ? Math.sign(+m[1]) * (+m[2]) : 0);
  } catch {}
  return -300;
}
function etToUtc(date, time = "00:00") { const [y, mo, d] = date.split("-").map(Number), [h, mi] = time.split(":").map(Number); const g = Date.UTC(y, mo - 1, d, h, mi); return g - etOffsetMin(g) * 60000; }
function etParts(d = new Date()) { const o = {}; new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d).forEach(p => o[p.type] = +p.value || p.value); return o; }
const greeting = () => { const h = etParts().hour % 24; return h < 5 ? "Working late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };
const daysTo = date => Math.max(0, Math.ceil((etToUtc(date) - Date.now()) / 864e5));

/* ---------- helpers ---------- */
const ptag = p => p ? `<span class="ptag" style="--c:${projColor(p)}"><span class="dot" style="background:${projColor(p)}"></span>${esc(p)}</span>` : "";
const isFav = id => favs.includes(id);
function toggleFav(id) { favs = isFav(id) ? favs.filter(x => x !== id) : [...favs, id]; store.set("favs", favs); toast(isFav(id) ? "Pinned to Home" : "Unpinned", "star"); render(false); }
function addRecent(kind, id) { recent = [{ k: kind, id, t: Date.now() }, ...recent.filter(r => !(r.k === kind && r.id === id))].slice(0, 8); store.set("recent", recent); }
let tt; function toast(msg, icon = "check") { const t = $("#toast"); t.innerHTML = ic(icon, 16, "#F5A524") + esc(msg); t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800); }
async function copy(text) { try { await navigator.clipboard.writeText(text); toast("Link copied", "copy"); } catch { toast("Copy not allowed here", "x"); } }
const absUrl = u => new URL(u, location.href).href;
const fileUrl = f => f.path;

/* ---------- components ---------- */
function cardTile(c, i = 0) {
  const priv = c.private || !c.url;
  const ext = isExt(c.url);
  const href = priv ? "" : ` href="${esc(c.url)}"${ext ? ' target="_blank" rel="noopener"' : ""}`;
  const Tag = priv ? "div" : "a";
  return `<${Tag} class="tile${priv ? " priv" : ""}" style="--c:${c.color || "#F5A524"};--i:${i}"${href} data-rec="card:${esc(c.id)}"${priv ? ' tabindex="0" data-priv="1"' : ""} aria-label="${esc(c.title)}${priv ? " (private)" : ""}">
    <div class="th"><span class="ti">${ic(priv ? "lock" : c.icon, 20)}</span><div style="min-width:0;padding-right:18px"><div class="tt">${esc(c.title)}</div><div class="tsub">${esc(c.sub || "")}</div></div></div>
    ${priv ? "" : `<span class="open">${ic(ext ? "ext" : "arrow", 16)}</span>`}
    <div class="tf"><span class="tag">${esc(c.tag || "")}</span>${priv ? `<span class="tag lock">${ic("lock", 11)} Private</span>` : ""}
      <span class="acts">${priv ? "" : `<button data-copy="${esc(absUrl(c.url))}" aria-label="Copy link to ${esc(c.title)}" title="Copy link">${ic("copy", 15)}</button>`}<button class="fav${isFav(c.id) ? " on" : ""}" data-fav="${esc(c.id)}" aria-pressed="${isFav(c.id)}" aria-label="${isFav(c.id) ? "Unpin" : "Pin"} ${esc(c.title)}" title="Pin to Home">${ic("star", 15)}</button></span></div>
  </${Tag}>`;
}
const folderTile = (s, i) => `<a class="tile ftile" href="#/${esc(s.id)}" style="--c:${projColor(s.project) !== "#8d98a5" ? projColor(s.project) : "#F5A524"};--i:${i}">
  <div class="th"><span class="ti">${ic(s.icon || "grid", 20)}</span><div style="min-width:0"><div class="tt">${esc(s.title)}</div><div class="tsub">${esc(s.desc || "")}</div></div></div>
  <div class="tf"><span class="tag">${plural(s.links.length, "app")}</span>${assetCount(s) ? `<span class="tag">${plural(assetCount(s), "asset")}</span>` : ""}</div><span class="open">${ic("arrow", 16)}</span></a>`;
const assetCount = s => s.project ? FILES.filter(f => f.project === s.project).length + MEDIA.filter(m => m.project === s.project).length : 0;

function libItem(x, i) {
  const c = projColor(x.project);
  if (x._k === "file") {
    return `<div class="litem${x.private ? " priv" : ""}" style="--c:${c};--i:${i}" ${x.private ? 'data-priv="1"' : `data-open-file="${esc(x.id)}"`} tabindex="0" role="button" aria-label="${esc(x.name)}">
      <div class="thumb"><span class="kind">File</span><span class="big">${x.private ? ic("lock", 30, "#fbbf24") : esc(x.type)}</span></div>
      <div class="meta"><div class="nm">${esc(x.name)}</div><div class="sm">${ptag(x.project)}<span>${esc(fmtSize(x.size))}</span></div>${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}</div></div>`;
  }
  const kindL = x.kind === "image" ? (x.type || "Image") : x.kind === "video" ? "Video" : "Audio";
  let thumb;
  if (x.private) thumb = `<div class="thumb"><span class="kind">${esc(kindL)}</span>${ic("lock", 30, "#fbbf24")}</div>`;
  else if (x.kind === "image") thumb = `<div class="thumb${x.type === "Logo" || x.type === "Brand" ? " contain" : ""}"><span class="kind">${esc(kindL)}</span><img src="${esc(x.thumb || x.src)}" alt="${esc(x.title)}" loading="lazy" decoding="async"></div>`;
  else if (x.kind === "video") thumb = `<div class="thumb" style="aspect-ratio:auto"><video controls preload="none" playsinline ${x.poster ? `poster="${esc(x.poster)}"` : ""} data-rec="media:${esc(x.id)}" src="${esc(x.src)}">${x.captions ? `<track kind="captions" srclang="en" label="English" src="${esc(x.captions)}">` : ""}</video></div>`;
  else thumb = `<div class="thumb" style="aspect-ratio:16/10;display:flex;flex-direction:column;gap:10px;justify-content:center;align-items:center"><span class="kind">Audio</span>${ic("music", 30, c)}<audio controls preload="none" src="${esc(x.src)}" data-rec="media:${esc(x.id)}"></audio></div>`;
  const clickable = !x.private && x.kind === "image";
  return `<div class="litem${x.private ? " priv" : ""}" style="--c:${c};--i:${i}" ${x.private ? 'data-priv="1"' : clickable ? `data-lb="${esc(x.id)}" tabindex="0" role="button"` : ""} aria-label="${esc(x.title)}">${thumb}
    <div class="meta"><div class="nm">${esc(x.title)}</div><div class="sm">${ptag(x.project)}<span>${esc(fmtSize(x.size))}</span></div>${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}</div></div>`;
}
function libRows(list) {
  return `<table class="ltable"><thead><tr><th>Name</th><th>Project</th><th class="hide-m">Type</th><th class="hide-m">Size</th><th class="hide-m">Added</th><th></th></tr></thead><tbody>${list.map(x => {
    const name = x.name || x.title, type = x._k === "file" ? x.type : (x.type || x.kind);
    const attr = x.private ? 'data-priv="1"' : x._k === "file" ? `data-open-file="${esc(x.id)}"` : x.kind === "image" ? `data-lb="${esc(x.id)}"` : `data-open-media="${esc(x.id)}"`;
    return `<tr ${attr} tabindex="0"><td><div style="display:flex;align-items:center;gap:10px"><span class="ftype" style="--c:${projColor(x.project)}">${esc(String(type).slice(0, 4))}</span><div><div style="font-weight:600">${esc(name)}</div>${x.note ? `<div class="note">${esc(x.note)}</div>` : ""}</div></div></td><td>${ptag(x.project)}</td><td class="hide-m">${esc(type)}</td><td class="hide-m">${esc(fmtSize(x.size))}</td><td class="hide-m">${esc(fmtDate(x.added))}</td><td>${x.private ? `<span class="lock">${ic("lock", 15)}</span>` : ic(x._k === "file" ? "download" : "arrow", 15)}</td></tr>`;
  }).join("")}</tbody></table>`;
}
function avatar(m) { return `<span class="av">${esc(m.initials)}<i class="sd"></i></span>`; }
function agentCard(m, i, full) {
  const owns = (CC.projectBoard || []).filter(p => p.owner === m.name);
  const st = m.state || "standby";
  return `<article class="glass agent st-${st}" id="agent-${slug(m.name)}" style="--c:${m.color};--i:${i}" tabindex="-1">
    <div class="ah">${avatar(m)}<div style="min-width:0"><h3>${esc(m.name)}</h3><div class="ar">${esc(m.role)}</div></div><span class="st">${esc(st)}</span></div>
    ${m.now ? `<div class="now"><b>Now</b>${esc(m.now)}</div>` : ""}
    ${full ? `<div class="lanes">${m.lanes.map(l => `<span>${esc(l)}</span>`).join("")}</div>${owns.map(p => `<div class="now"><b>Owns next · ${esc(p.project)}</b>${esc(p.next)}</div>`).join("")}` : ""}
    <div class="af">${m.projects.map(ptag).join("")}${m.url ? `<a class="linkbtn" style="margin-left:auto" href="${esc(m.url)}">Open app →</a>` : ""}</div>
  </article>`;
}
function ringSVG(size, stroke, signed, target, id = "rg") {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r, frac = Math.min(1, signed / target);
  // eslint-disable-next-line no-unused-vars
  const _segs = Array.from({ length: target }, (_, k) => { const a = (k / target) * 360; return `<line x1="${size / 2}" y1="${size / 2 - r - stroke}" x2="${size / 2}" y2="${size / 2 - r + stroke}" class="seg" stroke-width="3" transform="rotate(${a} ${size / 2} ${size / 2})"/>`; }).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC560"/><stop offset="1" stop-color="#F5A524"/></linearGradient></defs>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" class="trk" stroke-width="${stroke}"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" class="arc" stroke="url(#${id})" stroke-width="${stroke}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${C * (1 - frac)}"/></svg>`;
}

/* ---------- deadlines ---------- */
function dlState(d) {
  const start = etToUtc(d.date, d.time || "00:00"), end = start + 864e5, now = Date.now();
  if (now >= end) return { past: true, ms: 0 };
  if (now >= start) return { today: true, ms: 0 };
  return { ms: start - now };
}
function dlHTML(d, i) {
  const s = dlState(d), c = projColor(d.project) !== "#8d98a5" ? projColor(d.project) : "#F5A524";
  return `<div class="glass dl" id="dl-${d.id}" data-dl="${d.id}" style="--c:${c};--i:${i}">
    <div class="dh"><span class="di">${ic("timer", 18)}</span><div style="min-width:0"><div class="dt">${esc(d.title)}</div><div class="ds">${esc(d.note || "")}</div></div>
    <div class="when"><div>${d.approx ? "~" : ""}${esc(new Date(d.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))}</div><span class="pill" data-pill></span></div></div>
    <div class="cd"><div><b data-u="d">--</b><span>days</span></div><div><b data-u="h">--</b><span>hrs</span></div><div><b data-u="m">--</b><span>min</span></div><div><b data-u="s">--</b><span>sec</span></div></div>
    <div class="bar"><i data-bar style="width:0"></i></div></div>`;
}
function tickDeadlines() {
  DEADLINES.forEach(d => {
    const el = document.getElementById("dl-" + d.id); if (!el) return;
    const s = dlState(d), t = Math.floor(s.ms / 1000);
    const v = { d: Math.floor(t / 86400), h: Math.floor(t % 86400 / 3600), m: Math.floor(t % 3600 / 60), s: t % 60 };
    $$("[data-u]", el).forEach(b => b.textContent = String(v[b.dataset.u]).padStart(2, "0"));
    const pill = $("[data-pill]", el), days = s.ms / 864e5;
    el.classList.toggle("past", !!s.past); el.classList.toggle("urgent", !!s.today || (!s.past && days < 3)); el.classList.toggle("soon", !s.past && days >= 3 && days < 10);
    pill.className = "pill" + (s.today || days < 3 ? " r" : "");
    pill.textContent = s.past ? "Passed" : s.today ? "Today" : days < 1 ? "Tomorrow" : "in " + Math.ceil(days) + "d";
    $("[data-bar]", el).style.width = (s.past || s.today ? 100 : Math.max(3, 100 - days / 30 * 100)) + "%";
  });
}

/* ---------- views ---------- */
const V = {};
V.home = () => {
  const g = CC.goal || { signed: 0, target: 3, deadline: "2026-11-15", prospects: 0 };
  const favCards = favs.map(id => CARDS.find(c => c.id === id)).filter(Boolean);
  const featured = MEDIA.filter(m => m.featured && !m.private).map(m => ({ ...m, _k: "media" }));
  const rec = recent.map(r => r.k === "card" ? CARDS.find(c => c.id === r.id) : null).filter(Boolean).slice(0, 6);
  const today = new Date().toLocaleDateString("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric" });
  return `<div class="dash stagger">
  <section class="glass welcome" style="--i:0">
    <div class="eyebrow">${ic("sparkle", 13, "#F5A524", 2.4)}${esc(today)}</div>
    <h1>${greeting()}, <em>Ronnie</em></h1>
    <p class="lead">${daysTo(g.deadline)} days to ${esc(new Date(g.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }))} · ${g.signed} of ${g.target} founding clients signed · ${g.prospects} prospects ready</p>
    ${CC.upNext ? `<div class="upnext"><span class="ui">${ic("arrow", 20, "#1a1205", 2.4)}</span><div><div class="uk">Up next</div><div class="ut">${esc(CC.upNext)}</div></div></div>` : ""}
    <div class="quick"><a class="chip" href="betting/">${ic("trophy", 15)}Edge Betting HQ</a><a class="chip" href="roadmap/">${ic("map", 15)}Road Map</a><a class="chip" href="#/library">${ic("layers", 15)}Library</a><a class="chip" href="#/team">${ic("bot", 15)}Agents</a><button class="chip" data-act="palette">${ic("search", 15)}Search <kbd>${isMac ? "⌘K" : "Ctrl K"}</kbd></button></div>
  </section>
  <section class="glass ring-card" style="--i:1" aria-label="Road to 3 clients">
    <div class="ring">${ringSVG(150, 14, g.signed, g.target)}<div class="rc"><div><div class="rn">${g.signed}<small>/${g.target}</small></div><div class="rl">signed</div></div></div></div>
    <div class="ring-meta"><h3>Road to ${g.target} clients</h3><p>Founding-client push. Every signed client fills a slot.</p>
      <div class="kv"><span>Days left</span><b>${daysTo(g.deadline)}</b><span>Prospects ready</span><b>${g.prospects}</b><span>Deadline</span><b>${esc(new Date(g.deadline + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }))}</b></div>
      <div class="slots">${Array.from({ length: g.target }, (_, k) => `<span class="slot${k < g.signed ? " on" : ""}">${k + 1}</span>`).join("")}</div></div>
  </section>
  ${DEADLINES.length ? `<section class="deadlines" id="deadlines" style="--i:2" aria-label="Deadlines">${DEADLINES.map(dlHTML).join("")}</section>` : ""}
  ${favCards.length ? `<section class="span-12" style="--i:3"><div class="ph-row"><h2>${ic("star", 16, "#F5A524")}Pinned</h2><span class="sub">Star any app to pin it here</span><span class="right"><a class="linkbtn" href="#/folders">All apps →</a></span></div><div class="tiles stagger">${favCards.map(cardTile).join("")}</div></section>` : ""}
  <section class="span-12" style="--i:4"><div class="ph-row"><h2>${ic("grid", 16, "#F5A524")}Folders</h2><span class="sub">${plural(CC.sections.length, "folder")} · ${plural(CARDS.length, "app")}</span></div><div class="tiles stagger">${CC.sections.map(folderTile).join("")}</div></section>
  <section class="span-8 agents-wrap" style="--i:5"><div class="ph-row"><h2>${ic("bot", 16, "#F5A524")}Agents</h2><span class="sub">Status as of ${esc(CC.agentStatusAsOf || "")}</span><span class="right"><a class="linkbtn" href="#/team">All agents →</a></span></div><div class="agents stagger">${TEAM.map((m, i) => agentCard(m, i, false)).join("")}</div></section>
  <section class="span-4 status-wrap" style="--i:6"><div class="glass panel"><div class="ph-row"><h2>${ic("list", 16, "#F5A524")}Where things stand</h2><span class="sub">as of ${esc(CC.statusAsOf || "")}</span></div>
    <ul class="status stagger">${(CC.status || []).map((s, i) => `<li style="--i:${i}"><span class="sb ${esc(s.state)}">${esc(s.state)}</span><span>${esc(s.text)}</span></li>`).join("")}</ul></div></section>
  ${(CC.projectBoard || []).length ? `<section class="span-12" style="--i:7"><div class="glass panel"><div class="ph-row"><h2>${ic("cube", 16, "#F5A524")}Projects</h2><span class="sub">Next step and owner</span></div><div class="projects">${CC.projectBoard.map(p => `<a class="proj" href="#/${esc(p.view)}" style="--c:${projColor(p.project)}">${ptag(p.project)}<div class="pn">${esc(p.next)}</div><div class="po">Owner: ${esc(p.owner)}</div></a>`).join("")}</div></div></section>` : ""}
  ${rec.length ? `<section class="span-12"><div class="ph-row"><h2>${ic("clock", 16, "#F5A524")}Recently opened</h2><span class="right"><button class="linkbtn" data-act="clear-recent">Clear</button></span></div><div class="tiles">${rec.map(cardTile).join("")}</div></section>` : ""}
  ${featured.length ? `<section class="span-12 lib-wrap" style="--i:8"><div class="ph-row"><h2>${ic("photo", 16, "#F5A524")}From the library</h2><span class="sub">${MEDIA.filter(m => !m.private).length} images & clips · ${FILES.filter(f => !f.private).length} files</span><span class="right"><a class="linkbtn" href="#/library">Open library →</a></span></div><div class="ltiles stagger">${featured.map(libItem).join("")}</div></section>` : ""}
  </div>`;
};
V.folders = () => `<div class="hero"><div><div class="eyebrow">${ic("grid", 13, "#F5A524", 2.4)}Overview</div><h1>All apps</h1><p>Every site, tool and app in one place. Star one to pin it to Home.</p></div></div>
  ${CC.sections.map(s => `<section class="fgroup"><div class="ph-row"><h2><span class="ti" style="--c:${projColor(s.project) !== "#8d98a5" ? projColor(s.project) : "#F5A524"}">${ic(s.icon, 17)}</span>${esc(s.title)}</h2><span class="sub">${plural(s.links.length, "app")}</span><span class="right"><a class="linkbtn" href="#/${esc(s.id)}">Open folder →</a></span></div>
  ${s.links.length ? `<div class="tiles stagger">${CARDS.filter(c => c.section === s).map(cardTile).join("")}</div>` : `<div class="glass empty">No app links yet. Assets are in the <a class="linkbtn" href="#/library?p=${encodeURIComponent(s.project || "")}">library</a>.</div>`}</section>`).join("")}`;
V.team = () => `<div class="hero"><div><div class="eyebrow">${ic("bot", 13, "#F5A524", 2.4)}Overview</div><h1>Agents</h1><p>Your AI teammates, their lanes and what they are on. Status is set by hand (as of ${esc(CC.agentStatusAsOf || "")}); chats are not web links.</p></div></div>
  <div class="agents stagger">${TEAM.map((m, i) => agentCard(m, i, true)).join("")}</div>`;
function sectionView(s) {
  const cards = CARDS.filter(c => c.section === s);
  const assets = s.project ? [...FILES.filter(f => f.project === s.project).map(f => ({ ...f, _k: "file" })), ...MEDIA.filter(m => m.project === s.project).map(m => ({ ...m, _k: "media" }))] : [];
  return `<div class="hero"><div><div class="eyebrow">${ic(s.icon, 13, "#F5A524", 2.4)}Folder</div><h1>${esc(s.title)}</h1><p>${esc(s.desc || "")}</p></div>
    <div class="chips"><span class="chip">${plural(cards.length, "app")}</span>${assets.length ? `<a class="chip" href="#/library?p=${encodeURIComponent(s.project)}">${ic("layers", 14)}${plural(assets.length, "asset")}</a>` : ""}</div></div>
  ${cards.length ? `<div class="tiles stagger">${cards.map(cardTile).join("")}</div>` : `<div class="glass empty">No app links yet.</div>`}
  ${assets.length ? `<div class="ph-row" style="margin-top:28px"><h2>${ic("layers", 16, "#F5A524")}Library</h2><span class="sub">${esc(s.project)} files & media</span><span class="right"><a class="linkbtn" href="#/library?p=${encodeURIComponent(s.project)}">Open in library →</a></span></div><div class="ltiles stagger">${assets.slice(0, 12).map(libItem).join("")}</div>` : ""}`;
}
V.library = () => {
  const projs = [...new Set([...FILES, ...MEDIA].map(x => x.project))];
  const cnt = p => FILES.filter(f => p === "All" || f.project === p).length + MEDIA.filter(m => p === "All" || m.project === p).length;
  const kinds = [["all", "All"], ["file", "Files"], ["media", "Media"], ["image", "Images"], ["video", "Video"], ["audio", "Audio"]];
  return `<div class="hero"><div><div class="eyebrow">${ic("layers", 13, "#F5A524", 2.4)}Library</div><h1>Project library</h1><p>Files, logos, graphics and clips by project. Private items are listed so you know they exist, but nothing private is published.</p></div></div>
  <div class="lib"><aside class="glass libside" aria-label="Projects"><div class="hd">Projects</div>${["All", ...projs].map(p => `<button data-lp="${esc(p)}" class="${state.lp === p ? "on" : ""}">${p === "All" ? ic("layers", 15) : `<span class="dot" style="background:${projColor(p)}"></span>`}${p === "All" ? "All projects" : esc(p)}<span class="n">${cnt(p)}</span></button>`).join("")}</aside>
  <div><div class="toolbar"><label class="field">${ic("search", 15)}<input id="lq" placeholder="Filter the library…" value="${esc(state.lq)}" autocomplete="off" aria-label="Filter the library"></label>
    <div class="seg" role="group" aria-label="Kind">${kinds.map(([k, l]) => `<button data-lk="${k}" class="${state.lk === k ? "on" : ""}">${l}</button>`).join("")}</div>
    <div class="seg" role="group" aria-label="Layout"><button data-layout="grid" class="${state.layout === "grid" ? "on" : ""}" aria-label="Grid">${ic("grid", 15)}</button><button data-layout="list" class="${state.layout === "list" ? "on" : ""}" aria-label="List">${ic("rows", 15)}</button></div></div>
  <div id="libOut"></div></div></div>`;
};
function drawLib() {
  const q = state.lq.trim().toLowerCase();
  let list = [...FILES.map(f => ({ ...f, _k: "file" })), ...MEDIA.map(m => ({ ...m, _k: "media" }))];
  list = list.filter(x => (state.lp === "All" || x.project === state.lp) && (state.lk === "all" || (state.lk === "file" ? x._k === "file" : state.lk === "media" ? x._k === "media" : x.kind === state.lk)) && (!q || [x.name, x.title, x.type, x.kind, x.project].join(" ").toLowerCase().includes(q)));
  list.sort((a, b) => (a.private ? 1 : 0) - (b.private ? 1 : 0));
  $("#libOut").innerHTML = !list.length ? `<div class="glass empty">Nothing matches. <button class="linkbtn" data-act="lclear">Clear filters</button></div>` : state.layout === "list" ? libRows(list) : `<div class="ltiles stagger">${list.map(libItem).join("")}</div>`;
}
V.notes = () => `<div class="hero"><div><div class="eyebrow">${ic("note", 13, "#F5A524", 2.4)}Library</div><h1>Notes</h1><p>A quick scratchpad. Saved in this browser only, never uploaded.</p></div></div>
  <div class="glass notes"><textarea id="notes" placeholder="Ideas, call notes, things to remember…" aria-label="Notes">${esc(store.get("notes", ""))}</textarea><div class="nf"><span id="nsaved">Saved on this device</span><span id="ncount"></span></div></div>`;

/* ---------- router ---------- */
let current = "home";
function parseHash() { const h = location.hash.replace(/^#\/?/, ""); const [p, qs] = h.split("?"); return { id: p || "home", q: new URLSearchParams(qs || "") }; }
function render(animate = true) {
  let { id, q } = parseHash();
  if (id === "files") state.lk = "file";
  if (id === "media") state.lk = "media";
  if (q.get("p")) state.lp = q.get("p");
  const view = VIEWS.find(v => v.id === id) || VIEWS[0];
  current = view.id;
  const libLike = ["library", "files", "media"].includes(view.id);
  const c = $("#content");
  c.innerHTML = `<div class="view"${animate ? "" : ' style="animation:none"'}>${view.section ? sectionView(view.section) : libLike ? V.library() : V[view.id]()}</div>`;
  if (!animate) $$(".stagger>*", c).forEach(e => e.style.animation = "none");
  if (libLike) { drawLib(); $("#lq").addEventListener("input", e => { state.lq = e.target.value; drawLib(); }); }
  if (view.id === "notes") { const t = $("#notes"), cnt = () => $("#ncount").textContent = t.value.trim() ? plural(t.value.trim().split(/\s+/).length, "word") : ""; cnt(); let to; t.addEventListener("input", () => { $("#nsaved").textContent = "Saving…"; clearTimeout(to); to = setTimeout(() => { store.set("notes", t.value); $("#nsaved").textContent = "Saved on this device"; }, 400); cnt(); }); }
  if (view.id === "home") { tickDeadlines(); requestAnimationFrame(() => setTimeout(() => $$(".arc", c).forEach(a => a.style.strokeDashoffset = a.dataset.off), 120)); }
  $("#crumb").textContent = view.section ? view.section.title : view.label;
  document.title = (view.id === "home" ? "The Brain" : (view.section ? view.section.title : view.label) + " · The Brain") + " · Ronnie";
  $$("#nav a, #tabbar a").forEach(a => { const on = a.dataset.v === view.id; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); });
  document.body.classList.remove("drawer");
  if (animate) window.scrollTo(0, 0);
  bindTilt();
}
function buildNav() {
  let html = "", g = "";
  VIEWS.forEach(v => { if (v.group !== g) { g = v.group; html += `<div class="navlabel">${g}</div>`; } html += `<a href="#/${v.id}" data-v="${v.id}" data-label="${esc(v.label)}" aria-label="${esc(v.label)}">${ic(v.icon, 19)}<span class="lbl">${esc(v.label)}</span>${v.count != null ? `<span class="badge">${v.count}</span>` : ""}</a>`; });
  $("#nav").innerHTML = html;
  const tabs = [["home", "Home", "home"], ["folders", "Apps", "grid"], ["library", "Library", "layers"], ["team", "Agents", "bot"]];
  $("#tabbar").innerHTML = tabs.map(([v, l, i]) => `<a href="#/${v}" data-v="${v}">${ic(i, 21)}<span>${l}</span></a>`).join("") + `<button data-act="palette" aria-label="Search">${ic("search", 21)}<span>Search</span></button><button data-act="drawer" aria-label="More">${ic("menu", 21)}<span>More</span></button>`;
  const g2 = CC.goal || { signed: 0, target: 3 };
  $("#miniRing").innerHTML = `<span style="width:34px;height:34px;display:block">${ringSVG(34, 5, g2.signed, g2.target, "rg2")}</span><span class="mt"><b>${g2.signed}/${g2.target} clients</b>${daysTo(g2.deadline)} days left</span>`;
  $("#miniRing").onclick = () => { location.hash = "#/home"; };
  setTimeout(() => $$("#miniRing .arc").forEach(a => a.style.strokeDashoffset = a.dataset.off), 300);
}

/* ---------- tile hover glow / tilt ---------- */
const fine = matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches;
function bindTilt() {
  if (!fine) return;
  $$(".tile").forEach(t => {
    if (t._tilt) return; t._tilt = 1;
    t.addEventListener("pointermove", e => { const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; t.style.setProperty("--mx", x * 100 + "%"); t.style.setProperty("--my", y * 100 + "%"); t.style.setProperty("--rx", (0.5 - y) * 6 + "deg"); t.style.setProperty("--ry", (x - 0.5) * 6 + "deg"); });
    t.addEventListener("pointerleave", () => { t.style.setProperty("--rx", "0deg"); t.style.setProperty("--ry", "0deg"); });
  });
}

/* ---------- open ---------- */
function openFile(id) { const f = FILES.find(x => x.id === id); if (!f) return; if (f.private) return toast("Private item, not published", "lock"); addRecent("file", id); window.open(fileUrl(f), "_blank", "noopener"); }
let lbList = [], lbI = 0, lastFocus;
function openLB(id) { lbList = MEDIA.filter(m => m.kind === "image" && !m.private); lbI = Math.max(0, lbList.findIndex(m => m.id === id)); addRecent("media", id); lastFocus = document.activeElement; showLB(); $("#lb").classList.add("open"); $("#lb [data-act=lb-close]").focus(); }
function showLB() { const m = lbList[lbI]; if (!m) return; $("#lbImg").src = m.src; $("#lbImg").alt = m.title; $("#lbT").textContent = m.title; $("#lbS").textContent = [m.project, m.type, m.w && m.h ? m.w + "×" + m.h : "", fmtSize(m.size)].filter(Boolean).join(" · "); $("#lbOpen").href = m.src; $("#lbDl").href = m.src; $("#lbStage").classList.toggle("tall", m.h > m.w * 2); }
function closeLB() { $("#lb").classList.remove("open"); $("#lbImg").src = ""; lastFocus && lastFocus.focus && lastFocus.focus(); }
const stepLB = d => { lbI = (lbI + d + lbList.length) % lbList.length; showLB(); };

/* ---------- command palette ---------- */
const SCOPES = [["all", "All"], ["Apps", "Apps"], ["Files", "Files & media"], ["Agents", "Agents"], ["Go to", "Views"], ["Deadlines", "Deadlines"], ["Actions", "Actions"]];
const GORD = ["Apps", "Agents", "Files", "Deadlines", "Go to", "Actions"];
let PAL = [], palItems = [], palSel = 0, palScope = "all";
function goAgent(m) { location.hash = "#/team"; setTimeout(() => { const el = document.getElementById("agent-" + slug(m.name)); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1500); } }, 80); }
function palIndex() {
  return [
    ...CARDS.map(c => ({ g: "Apps", t: c.title, s: (c.section.title) + " · " + (c.sub || "") + (c.private ? " · Private" : ""), icon: c.private ? "lock" : c.icon, color: c.color, run: () => { if (c.private || !c.url) return toast("Private item, not published", "lock"); addRecent("card", c.id); isExt(c.url) ? window.open(c.url, "_blank", "noopener") : (location.href = c.url); } })),
    ...TEAM.map(m => ({ g: "Agents", t: m.name, s: m.role + (m.now ? " · " + m.now : ""), icon: "bot", color: m.color, run: () => goAgent(m) })),
    ...FILES.map(f => ({ g: "Files", t: f.name, s: f.project + " · " + f.type.toUpperCase() + (f.private ? " · Private" : ""), icon: f.private ? "lock" : "file", color: f.private ? "#fbbf24" : projColor(f.project), run: () => openFile(f.id) })),
    ...MEDIA.map(m => ({ g: "Files", t: m.title, s: m.project + " · " + (m.type || m.kind) + (m.private ? " · Private" : ""), icon: m.private ? "lock" : m.kind === "image" ? "image" : m.kind === "video" ? "play" : "music", color: m.private ? "#fbbf24" : projColor(m.project), img: m.kind === "image" && !m.private ? m.thumb : null, run: () => m.private ? toast("Private item, not published", "lock") : m.kind === "image" ? openLB(m.id) : (state.lk = m.kind, state.lp = "All", location.hash = "#/library") })),
    ...VIEWS.map(v => ({ g: "Go to", t: v.section ? v.section.title : v.label, s: "View", icon: v.icon, color: "#F5A524", run: () => location.hash = "#/" + v.id })),
    ...DEADLINES.map(d => ({ g: "Deadlines", t: d.title, s: (d.approx ? "About " : "") + fmtDate(d.date) + " · " + daysTo(d.date) + " days", icon: "timer", color: "#F5A524", run: () => { location.hash = "#/home"; setTimeout(() => { const el = document.getElementById("dl-" + d.id); el && el.scrollIntoView({ block: "center", behavior: "smooth" }); }, 80); } })),
    { g: "Actions", t: "Toggle sidebar", s: "Collapse or expand ( [ )", icon: "layout", color: "#60a5fa", run: toggleCollapse },
    { g: "Actions", t: "Toggle compact view", s: "Density", icon: "rows", color: "#60a5fa", run: toggleDensity },
    { g: "Actions", t: "Open Edge Betting HQ", s: "/betting", icon: "trophy", color: "#22c55e", run: () => location.href = "betting/" },
    { g: "Actions", t: "Open Rokhal Road Map", s: "/roadmap", icon: "map", color: "#7c5cff", run: () => location.href = "roadmap/" },
  ];
}
const hl = (t, q) => { if (!q) return esc(t); const i = t.toLowerCase().indexOf(q); return i < 0 ? esc(t) : esc(t.slice(0, i)) + "<mark>" + esc(t.slice(i, i + q.length)) + "</mark>" + esc(t.slice(i + q.length)); };
function palRender() {
  const raw = $("#palQ").value.trim().toLowerCase(), toks = raw.split(/\s+/).filter(Boolean);
  let items = PAL.filter(p => palScope === "all" || p.g === palScope);
  if (toks.length) items = items.map(p => { const hay = (p.t + " " + p.s + " " + p.g).toLowerCase(); if (!toks.every(t => hay.includes(t))) return null; const tl = p.t.toLowerCase(); return { p, sc: tl.startsWith(raw) ? 0 : tl.includes(raw) ? 1 : 2 }; }).filter(Boolean).sort((a, b) => GORD.indexOf(a.p.g) - GORD.indexOf(b.p.g) || a.sc - b.sc).map(x => x.p);
  else items = items.filter(p => palScope !== "all" || ["Go to", "Agents", "Deadlines"].includes(p.g) || (p.g === "Apps" && favs.some(f => p.t === (CARDS.find(c => c.id === f) || {}).title)));
  palItems = items.slice(0, 60);
  palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
  let g = "", html = "";
  palItems.forEach((p, i) => { if (p.g !== g) { g = p.g; html += `<div class="pg">${esc(g === "Files" ? "Files & media" : g)}</div>`; } html += `<div class="pi${i === palSel ? " on" : ""}" role="option" aria-selected="${i === palSel}" data-pi="${i}" id="pi${i}">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : `<span class="ti" style="--c:${p.color}">${ic(p.icon, 16)}</span>`}<div style="min-width:0"><div class="pt">${hl(p.t, raw)}</div><div class="ps">${hl(p.s, raw)}</div></div><span class="pk">${i === palSel ? "↵" : ""}</span></div>`; });
  $("#palList").innerHTML = html || `<div class="empty">No matches for "${esc(raw)}"</div>`;
  $("#palCount").textContent = plural(palItems.length, "result");
  $("#palScopes").innerHTML = SCOPES.map(([k, l]) => `<button class="chip${palScope === k ? " on" : ""}" data-scope="${k}">${l}</button>`).join("");
  const on = $("#pi" + palSel); on && on.scrollIntoView({ block: "nearest" });
}
function openPal() { lastFocus = document.activeElement; PAL = palIndex(); palScope = "all"; $("#pal").classList.add("open"); const i = $("#palQ"); i.value = ""; palSel = 0; palRender(); i.focus(); }
function closePal() { $("#pal").classList.remove("open"); lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
function runPal(i) { const p = palItems[i]; if (!p) return; closePal(); p.run(); }

/* ---------- actions ---------- */
function toggleCollapse() { const on = document.body.classList.toggle("collapsed"); store.set("collapsed", on); const b = $(".collapse"); b.setAttribute("aria-expanded", !on); b.setAttribute("aria-label", on ? "Expand sidebar" : "Collapse sidebar"); }
function toggleDensity() { const on = document.body.classList.toggle("compact"); store.set("compact", on); $("#densLbl").textContent = on ? "Comfortable view" : "Compact view"; toast(on ? "Compact view" : "Comfortable view", "rows"); }

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const cp = t.closest("[data-copy]"); if (cp) { e.preventDefault(); e.stopPropagation(); return copy(cp.dataset.copy); }
  const fv = t.closest("[data-fav]"); if (fv) { e.preventDefault(); e.stopPropagation(); return toggleFav(fv.dataset.fav); }
  if (t.closest("video,audio")) return;
  const pv = t.closest("[data-priv]"); if (pv) return toast("Private item, not published", "lock");
  const of = t.closest("[data-open-file]"); if (of) return openFile(of.dataset.openFile);
  const om = t.closest("[data-open-media]"); if (om) { const m = MEDIA.find(x => x.id === om.dataset.openMedia); if (m) { addRecent("media", m.id); window.open(m.src, "_blank", "noopener"); } return; }
  const lb = t.closest("[data-lb]"); if (lb) return openLB(lb.dataset.lb);
  const rc = t.closest("[data-rec]"); if (rc) { const [k, ...id] = rc.dataset.rec.split(":"); addRecent(k, id.join(":")); }
  const sc = t.closest("[data-scope]"); if (sc) { palScope = sc.dataset.scope; palSel = 0; palRender(); $("#palQ").focus(); return; }
  const pi = t.closest("[data-pi]"); if (pi) return runPal(+pi.dataset.pi);
  const lp = t.closest("[data-lp]"); if (lp) { state.lp = lp.dataset.lp; $$("[data-lp]").forEach(b => b.classList.toggle("on", b === lp)); if (location.hash.includes("?")) history.replaceState(null, "", "#/" + current); return drawLib(); }
  const lk = t.closest("[data-lk]"); if (lk) { state.lk = lk.dataset.lk; $$("[data-lk]").forEach(b => b.classList.toggle("on", b === lk)); return drawLib(); }
  const ly = t.closest("[data-layout]"); if (ly) { state.layout = ly.dataset.layout; store.set("libLayout", state.layout); $$("[data-layout]").forEach(b => b.classList.toggle("on", b === ly)); return drawLib(); }
  const a = t.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act;
  if (act === "pal-bg" && t !== a) return;
  ({
    palette: openPal, "pal-bg": closePal,
    drawer: () => document.body.classList.add("drawer"), "drawer-close": () => document.body.classList.remove("drawer"),
    collapse: toggleCollapse, density: toggleDensity,
    "lb-close": closeLB, "lb-prev": () => stepLB(-1), "lb-next": () => stepLB(1),
    "clear-recent": () => { recent = []; store.set("recent", []); render(false); },
    lclear: () => { state.lq = ""; state.lp = "All"; state.lk = "all"; render(false); },
  }[act] || (() => {}))();
});
document.addEventListener("play", e => { $$("video,audio").forEach(m => m !== e.target && m.pause()); }, true);
document.addEventListener("keydown", e => {
  const typing = /INPUT|TEXTAREA/.test((document.activeElement || {}).tagName);
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); return $("#pal").classList.contains("open") ? closePal() : openPal(); }
  if ($("#pal").classList.contains("open")) {
    if (e.key === "Escape") return closePal();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); palSel = (palSel + (e.key === "ArrowDown" ? 1 : -1) + palItems.length) % Math.max(1, palItems.length); return palRender(); }
    if (e.key === "Tab") { e.preventDefault(); const i = SCOPES.findIndex(s => s[0] === palScope); palScope = SCOPES[(i + (e.shiftKey ? -1 : 1) + SCOPES.length) % SCOPES.length][0]; palSel = 0; return palRender(); }
    if (e.key === "Enter") { e.preventDefault(); return runPal(palSel); }
    return;
  }
  if ($("#lb").classList.contains("open")) { if (e.key === "Escape") closeLB(); if (e.key === "ArrowRight") stepLB(1); if (e.key === "ArrowLeft") stepLB(-1); return; }
  if (e.key === "Escape") document.body.classList.remove("drawer");
  if (typing) return;
  if (e.key === "/") { e.preventDefault(); openPal(); }
  if (e.key === "[") toggleCollapse();
  const ae = document.activeElement;
  if ((e.key === "Enter" || e.key === " ") && ae && ae.matches && ae.matches("[data-open-file],[data-lb],[data-priv],tr[data-open-media]")) { e.preventDefault(); ae.click(); }
});
$("#palQ").addEventListener("input", () => { palSel = 0; palRender(); });
$("#lb").addEventListener("click", e => { if (e.target.id === "lbStage") closeLB(); });
window.addEventListener("hashchange", () => { const go = () => { render(); $("#content").focus({ preventScroll: true }); }; document.startViewTransition && !matchMedia("(prefers-reduced-motion:reduce)").matches ? (() => { const vt = document.startViewTransition(go); [vt.ready, vt.finished, vt.updateCallbackDone].forEach(pr => pr && pr.catch(() => {})); })() : go(); });
let tx = 0; document.addEventListener("touchstart", e => tx = e.touches[0].clientX, { passive: true });
document.addEventListener("touchend", e => { if (!$("#lb").classList.contains("open")) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) stepLB(dx < 0 ? 1 : -1); }, { passive: true });

/* ---------- boot ---------- */
if (store.get("compact", false)) { document.body.classList.add("compact"); $("#densLbl").textContent = "Comfortable view"; }
if (store.get("collapsed", false)) { document.body.classList.add("collapsed"); $(".collapse").setAttribute("aria-expanded", "false"); }
$("#kk1").textContent = $("#kk2").textContent = isMac ? "⌘K" : "Ctrl K";
function tick() {
  const n = new Date();
  $("#time").textContent = n.toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" });
  $("#date").textContent = n.toLocaleDateString("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric", year: "numeric" });
  $("#greet").innerHTML = `${greeting()}, <em>Ronnie</em>`;
}
tick(); setInterval(tick, 15000);
setInterval(() => { if (current === "home" && !document.hidden) tickDeadlines(); }, 1000);
buildNav(); render();
})();
