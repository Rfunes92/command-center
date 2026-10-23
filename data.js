/* =====================================================================
   RONNIE'S COMMAND CENTER · DATA
   Everything on the site comes from this file. Edit, commit, push.
   See README.md for copy-paste examples.

   Card:   { title, url, tag, icon, color, sub? }
   File:   { name, type, project, path, size, added, private?, note? }
   Media:  { title, featured?, kind: "image"|"video"|"audio", project, src, thumb?, poster?, size, added, private?, note? }
   featured: true -> shows in the Home "From the library" strip
   private: true  -> shows a lock badge and NO link (nothing is published)
   ===================================================================== */

var CC = window.CC = {};

/* Cards pinned to Home on first visit (by title). Ronnie can pin/unpin with the star. */
CC.defaultFavorites = ["Live website", "HighLevel dashboard", "Ronnie Finance", "Mount Up"];

/* Projects used for tags and filters (name: color) */
CC.projects = {
  "Rokhal":        "#00e5ff",
  "Blaze":         "#a855f7",
  "Apps":          "#a3e635",
  "Grace Auto":    "#3b82f6",
  "Torque Legion": "#f59e0b",
  "Betting":       "#22c55e",
};

/* Sidebar sections with link cards. Add a section = add a block (it gets a sidebar entry). */
CC.sections = [
  { id: "rokhal", title: "Rokhal Marketing", nav: "Rokhal", icon: "rocket", project: "Rokhal",
    desc: "Your agency: live site, CRM and domains.", links: [
    { title: "Live website", sub: "rokhalmarketing.com", url: "https://rokhalmarketing.com", tag: "Live", icon: "globe", color: "#00e5ff" },
    { title: "Rokhal Road Map", sub: "GitHub Pages", url: "https://rfunes92.github.io/rokhal-roadmap/", tag: "Plan", icon: "map", color: "#7c5cff" },
    { title: "HighLevel dashboard", sub: "GoHighLevel · Rokhal", url: "https://app.gohighlevel.com/v2/location/QSvv2ELnHxcoUpJoQ5H1/dashboard", tag: "CRM", icon: "grid", color: "#22c55e" },
    { title: "HighLevel Websites", sub: "Sites & funnels", url: "https://app.gohighlevel.com/v2/location/QSvv2ELnHxcoUpJoQ5H1/funnels-websites/websites", tag: "Builder", icon: "layout", color: "#3b82f6" },
    { title: "HighLevel Domains", sub: "GoHighLevel · Settings", url: "https://app.gohighlevel.com/v2/location/QSvv2ELnHxcoUpJoQ5H1/settings/domain", tag: "Settings", icon: "link", color: "#f59e0b" },
    { title: "GoDaddy portfolio", sub: "GoDaddy · All domains", url: "https://dcc.godaddy.com/control/portfolio", tag: "Domains", icon: "server", color: "#14b8a6" },
  ]},
  { id: "blaze", title: "Blaze Electric", nav: "Blaze", icon: "bolt", project: "Blaze",
    desc: "Client: 24/7 electrician in Brooklyn & NYC.", links: [
    { title: "Site preview: Home", sub: "LeadConnector preview", url: "https://sites.leadconnectorhq.com/preview/c6BeH0e4UHRuZCT9VT3R", tag: "Client", icon: "bolt", color: "#a855f7" },
    { title: "Panel Upgrade page", sub: "LeadConnector preview", url: "https://sites.leadconnectorhq.com/preview/dq73xEaZ3LsMNrVpi2CG", tag: "Client", icon: "file", color: "#a855f7" },
    { title: "Homepage mockup", sub: "GitHub Pages", url: "https://rfunes92.github.io/blaze-electric-preview/", tag: "Mockup", icon: "image", color: "#ec4899" },
    { title: "Google Business Profile", sub: "business.google.com", url: "https://business.google.com", tag: "Listing", icon: "pin", color: "#ef4444" },
    { title: "Blaze DNS", sub: "GoDaddy · blazeelectric.com", url: "https://dcc.godaddy.com/control/portfolio/blazeelectric.com/settings", tag: "DNS", icon: "server", color: "#14b8a6" },
  ]},
  { id: "apps", title: "Apps we built", nav: "Apps", icon: "cube", project: "Apps",
    desc: "Your own projects.", links: [
    { title: "Mount Up", sub: "Workout app", url: "https://rfunes92.github.io/workout-app/", tag: "App", icon: "dumbbell", color: "#a3e635" },
  ]},
  { id: "betting", title: "Betting", nav: "Betting", icon: "trophy", project: "Betting",
    desc: "Football and UFC, run by Edge. Strict bankroll limit; you place every bet.", links: [
    { title: "DraftKings Sportsbook", sub: "sportsbook.draftkings.com", url: "https://sportsbook.draftkings.com", tag: "Book", icon: "trophy", color: "#22c55e" },
    { title: "FanDuel Sportsbook", sub: "sportsbook.fanduel.com", url: "https://sportsbook.fanduel.com", tag: "Book", icon: "trophy", color: "#3b82f6" },
    { title: "Action Network odds", sub: "Lines, splits & movement", url: "https://www.actionnetwork.com/nfl/odds", tag: "Odds", icon: "chart", color: "#00e5ff" },
    { title: "Pro Football Reference", sub: "NFL player & team stats", url: "https://www.pro-football-reference.com", tag: "NFL", icon: "list", color: "#f59e0b" },
    { title: "NFL Next Gen Stats", sub: "nextgenstats.nfl.com", url: "https://nextgenstats.nfl.com", tag: "NFL", icon: "gauge", color: "#ef4444" },
    { title: "UFC Stats", sub: "ufcstats.com", url: "http://ufcstats.com/statistics/events/upcoming", tag: "UFC", icon: "flag", color: "#a855f7" },
    { title: "Tapology", sub: "Fight cards & records", url: "https://www.tapology.com", tag: "UFC", icon: "calendar", color: "#ec4899" },
  ]},
  { id: "money", title: "Money", nav: "Money", icon: "wallet", project: null,
    desc: "Reporting, budget and books. Nothing financial is stored on this site.", links: [
    { title: "Ronnie Finance", sub: "Financial reporting site", url: "https://rfunes92.github.io/ronnie-finance-site/", tag: "Finance", icon: "chart", color: "#22c55e" },
    { title: "YNAB", sub: "app.ynab.com", url: "https://app.ynab.com", tag: "Budget", icon: "wallet", color: "#3b82f6" },
    { title: "QuickBooks", sub: "qbo.intuit.com", url: "https://qbo.intuit.com", tag: "Books", icon: "book", color: "#10b981" },
    { title: "Cursor plan & usage", sub: "cursor.com/dashboard", url: "https://cursor.com/dashboard", tag: "Billing", icon: "gauge", color: "#a78bfa" },
  ]},
  { id: "planning", title: "Inbox & planning", nav: "Planning", icon: "calendar", project: null,
    desc: "Mail, calendar and boards.", links: [
    { title: "Gmail", sub: "mail.google.com", url: "https://mail.google.com", tag: "Inbox", icon: "mail", color: "#ef4444" },
    { title: "Google Calendar", sub: "calendar.google.com", url: "https://calendar.google.com", tag: "Calendar", icon: "calendar", color: "#3b82f6" },
    { title: "Trello", sub: "trello.com", url: "https://trello.com", tag: "Boards", icon: "kanban", color: "#0ea5e9" },
  ]},
];

/* Files library. Put the file in assets/files/ and add a line. */
CC.files = [
  { name: "Outreach email template", type: "md", project: "Rokhal", path: "assets/files/outreach-email-template.md", size: 659, added: "2026-10-22" },
  { name: "Explainer video script + storyboard", type: "md", project: "Rokhal", path: "assets/files/rokhal-explainer-script.md", size: 2794, added: "2026-10-22" },
  { name: "Explainer captions (English)", type: "vtt", project: "Rokhal", path: "assets/files/rokhal-explainer-captions.vtt", size: 399, added: "2026-10-22" },
  { name: "Reserved sign, blank", type: "pdf", project: "Grace Auto", path: "assets/files/reserved-sign-blank.pdf", size: 21618, added: "2026-10-22" },
  { name: "Reserved sign, editable", type: "pdf", project: "Grace Auto", path: "assets/files/reserved-sign-editable.pdf", size: 22274, added: "2026-10-22" },
  { name: "Reserved sign, editable (Word)", type: "docx", project: "Grace Auto", path: "assets/files/reserved-sign-editable.docx", size: 40858, added: "2026-10-22" },
  { name: "Reserved sign, handwrite", type: "pdf", project: "Grace Auto", path: "assets/files/reserved-sign-handwrite.pdf", size: 21618, added: "2026-10-22" },
  { name: "Outreach prospect list (12 local trades)", type: "csv", project: "Rokhal", size: 1848, added: "2026-10-22", private: true, note: "Private, on Becca's computer (third-party contact info)" },
  { name: "Rokhal one-page sales kit", type: "pdf", project: "Rokhal", size: 108372, added: "2026-10-22", private: true, note: "Private, not published (pricing)" },
  { name: "Proposal / estimate template", type: "md", project: "Rokhal", size: 6380, added: "2026-10-22", private: true, note: "Private, not published (pricing)" },
  { name: "Website audit: GJC Electric", type: "pdf", project: "Rokhal", size: 363724, added: "2026-10-22", private: true, note: "Private, not published (prospect audit)" },
  { name: "Website audit: Dayton & Sons Electric", type: "pdf", project: "Rokhal", size: 177327, added: "2026-10-22", private: true, note: "Private, not published (prospect audit)" },
  { name: "HighLevel buildout notes", type: "md", project: "Rokhal", size: 9588, added: "2026-10-22", private: true, note: "Private, not published (account IDs)" },
  { name: "Reserved signs for named customers (4)", type: "pdf", project: "Grace Auto", size: 23116, added: "2026-10-22", private: true, note: "Private, not published (customer names)" },
];

/* Images & media. Images: put full size in assets/images/ and a ~640px thumb in assets/images/thumbs/. */
CC.media = [
  { title: "Rokhal explainer video", kind: "video", project: "Rokhal", src: "assets/media/rokhal-explainer.mp4", poster: "assets/images/thumbs/rokhal-explainer-poster.jpg", captions: "assets/files/rokhal-explainer-captions.vtt", size: 2462263, added: "2026-10-22" },
  { title: "Blaze hero video", kind: "video", project: "Blaze", src: "assets/media/blaze-hero.mp4", poster: "assets/images/thumbs/blaze-hero-poster.jpg", size: 3245681, added: "2026-10-22" },
  { title: "Rokhal voiceover sample", kind: "audio", project: "Rokhal", src: "assets/media/rokhal-voiceover-sample.mp3", size: 88556, added: "2026-10-22" },
  { title: "Rokhal logo", kind: "image", type: "Logo", project: "Rokhal", src: "assets/images/rokhal-logo.jpg", thumb: "assets/images/thumbs/rokhal-logo.jpg", w: 567, h: 461, size: 26929, added: "2026-10-22" },
  { title: "Rokhal logo (wide)", kind: "image", type: "Logo", project: "Rokhal", src: "assets/images/rokhal-logo-wide.jpg", thumb: "assets/images/thumbs/rokhal-logo-wide.jpg", w: 1280, h: 720, size: 41880, added: "2026-10-22" },
  { title: "Never miss a job end card", featured: true, kind: "image", type: "Graphic", project: "Rokhal", src: "assets/images/rokhal-never-miss-a-job.jpg", thumb: "assets/images/thumbs/rokhal-never-miss-a-job.jpg", w: 1280, h: 720, size: 37172, added: "2026-10-22" },
  { title: "Electrician illustration", featured: true, kind: "image", type: "Illustration", project: "Rokhal", src: "assets/images/rokhal-electrician-illustration.jpg", thumb: "assets/images/thumbs/rokhal-electrician-illustration.jpg", w: 1280, h: 720, size: 121971, added: "2026-10-22" },
  { title: "Work van scene", kind: "image", type: "Illustration", project: "Rokhal", src: "assets/images/rokhal-van-scene.jpg", thumb: "assets/images/thumbs/rokhal-van-scene.jpg", w: 512, h: 288, size: 30833, added: "2026-10-22" },
  { title: "Homeowner kitchen scene", kind: "image", type: "Illustration", project: "Rokhal", src: "assets/images/rokhal-kitchen-scene.jpg", thumb: "assets/images/thumbs/rokhal-kitchen-scene.jpg", w: 512, h: 288, size: 13225, added: "2026-10-22" },
  { title: "rokhalmarketing.com, desktop", kind: "image", type: "Screenshot", project: "Rokhal", src: "assets/images/rokhal-site-desktop.jpg", thumb: "assets/images/thumbs/rokhal-site-desktop.jpg", w: 1100, h: 7791, size: 811029, added: "2026-10-22" },
  { title: "rokhalmarketing.com, mobile", kind: "image", type: "Screenshot", project: "Rokhal", src: "assets/images/rokhal-site-mobile.jpg", thumb: "assets/images/thumbs/rokhal-site-mobile.jpg", w: 375, h: 812, size: 53480, added: "2026-10-22" },
  { title: "Blaze bolt icon", kind: "image", type: "Logo", project: "Blaze", src: "assets/images/blaze-logo-icon.png", thumb: "assets/images/thumbs/blaze-logo-icon.png", w: 500, h: 500, size: 13582, added: "2026-10-22" },
  { title: "Blaze wordmark", kind: "image", type: "Logo", project: "Blaze", src: "assets/images/blaze-logo-wordmark.png", thumb: "assets/images/thumbs/blaze-logo-wordmark.png", w: 180, h: 43, size: 9446, added: "2026-10-22" },
  { title: "Blaze hero poster", featured: true, kind: "image", type: "Graphic", project: "Blaze", src: "assets/images/blaze-hero-poster.jpg", thumb: "assets/images/thumbs/blaze-hero-poster.jpg", w: 1280, h: 720, size: 61436, added: "2026-10-22" },
  { title: "Blaze new site preview", featured: true, kind: "image", type: "Mockup", project: "Blaze", src: "assets/images/blaze-new-site-preview.jpg", thumb: "assets/images/thumbs/blaze-new-site-preview.jpg", w: 1280, h: 800, size: 104390, added: "2026-10-22" },
  { title: "Blaze old site (before)", kind: "image", type: "Screenshot", project: "Blaze", src: "assets/images/blaze-old-site.jpg", thumb: "assets/images/thumbs/blaze-old-site.jpg", w: 1280, h: 800, size: 82404, added: "2026-10-22" },
  { title: "Blaze brand colors", kind: "image", type: "Brand", project: "Blaze", src: "assets/images/blaze-brand-swatches.png", thumb: "assets/images/thumbs/blaze-brand-swatches.png", w: 1000, h: 970, size: 96860, added: "2026-10-22" },
  { title: "Mount Up brand sheet", featured: true, kind: "image", type: "Brand", project: "Apps", src: "assets/images/mountup-brand.jpg", thumb: "assets/images/thumbs/mountup-brand.jpg", w: 1600, h: 1000, size: 105707, added: "2026-10-22" },
  { title: "Grace Auto Group logo", kind: "image", type: "Logo", project: "Grace Auto", src: "assets/images/grace-auto-logo.png", thumb: "assets/images/thumbs/grace-auto-logo.png", w: 512, h: 512, size: 47536, added: "2026-10-22" },
  { title: "Car Guy banner A", featured: true, kind: "image", type: "Graphic", project: "Grace Auto", src: "assets/images/grace-car-guy-banner-a.jpg", thumb: "assets/images/thumbs/grace-car-guy-banner-a.jpg", w: 1600, h: 609, size: 99405, added: "2026-10-22" },
  { title: "Car Guy banner B", kind: "image", type: "Graphic", project: "Grace Auto", src: "assets/images/grace-car-guy-banner-b.jpg", thumb: "assets/images/thumbs/grace-car-guy-banner-b.jpg", w: 1600, h: 609, size: 87217, added: "2026-10-22" },
  { title: "Reserved sign template", kind: "image", type: "Template", project: "Grace Auto", src: "assets/images/reserved-sign-preview.png", thumb: "assets/images/thumbs/reserved-sign-preview.png", w: 550, h: 425, size: 32666, added: "2026-10-22" },
  { title: "Torque Legion icon", kind: "image", type: "Logo", project: "Torque Legion", src: "assets/images/torque-legion-icon.png", thumb: "assets/images/thumbs/torque-legion-icon.png", w: 256, h: 256, size: 2517, added: "2026-10-22" },
  { title: "Blaze video voice reference", kind: "video", project: "Blaze", size: 7010051, added: "2026-10-22", private: true, note: "Private, not published (voice sample)" },
];

/* AI teammates shown in the Team view (no links: their chats are not web URLs).
   { name, initials, role, lanes: [..], projects: [..], color } */
CC.team = [
  { name: "Becca",      initials: "BE", role: "Main assistant & coordinator", lanes: ["Day-to-day help", "Coordinates the team", "Inbox & planning"], projects: ["Rokhal", "Blaze"], color: "#00e5ff" },
  { name: "Grace",      initials: "GR", role: "Site builds", lanes: ["Grace Auto", "Rokhal site builds", "Client websites"], projects: ["Grace Auto", "Rokhal", "Blaze"], color: "#3b82f6" },
  { name: "Serene",     initials: "SE", role: "Social media & brand", lanes: ["Social media", "Torque Legion brand"], projects: ["Torque Legion"], color: "#f59e0b" },
  { name: "Titan",      initials: "TI", role: "Fitness coach", lanes: ["Fitness", "Mount Up app"], projects: ["Apps"], color: "#a3e635" },
  { name: "Taylor",     initials: "TA", role: "Household CFO", lanes: ["Household money"], projects: [], color: "#a78bfa" },
  { name: "Rokhal CFO", initials: "RC", role: "Business books", lanes: ["Rokhal bookkeeping"], projects: ["Rokhal"], color: "#14b8a6" },
  { name: "Edge",       initials: "ED", role: "Betting analyst", lanes: ["Football", "UFC"], projects: ["Betting"], color: "#22c55e" },
];

/* Projects overview on Home: one compact card per project. view = sidebar id or a #/ link. */
CC.projectBoard = [
  { project: "Rokhal",        next: "Polish the site page by page, then send the first outreach emails Friday morning", owner: "Grace", view: "rokhal" },
  { project: "Blaze",         next: "Waiting on Ellyn's site approval; check the Google listing claim Oct 26", owner: "Grace", view: "blaze" },
  { project: "Betting",       next: "Edge preps the football and UFC slates; you place every bet", owner: "Edge", view: "betting" },
  { project: "Apps",          next: "Keep improving Mount Up", owner: "Titan", view: "apps" },
  { project: "Torque Legion", next: "Build out the brand and social presence", owner: "Serene", view: "media?p=Torque%20Legion" },
];

/* Home panels */
CC.statusAsOf = "Oct 22, 2026";
CC.status = [
  { state: "Done",    text: "rokhalmarketing.com live on the new HighLevel site" },
  { state: "Done",    text: "Premium plan upgrade" },
  { state: "Ready",   text: "Outreach list of 12 local trades + email template" },
  { state: "Next",    text: "Rokhal website polish, page by page" },
  { state: "Waiting", text: "Blaze site approval from Ellyn" },
  { state: "Pending", text: "Blaze Google listing claim (check Oct 26)" },
];
CC.goal = { signed: 0, target: 3, deadline: "2026-11-15", prospects: 12 };
CC.upNext = "Polish the Rokhal site page by page, then send the first outreach emails Friday morning.";
