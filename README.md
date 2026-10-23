# Ronnie's Command Center (v2)

Live: https://rfunes92.github.io/command-center/

An app-style home base: sidebar views (Home, Rokhal, Blaze, Apps, Money, Planning, Files, Images & Media, Notes), a Ctrl/⌘ K command palette that searches everything, and favorites, recently opened, density and sidebar state saved in your browser.

No build step. Files:

| File | What it is |
|---|---|
| `data.js` | **All content.** Edit only this file to add or change anything. |
| `index.html` | Layout and styles |
| `app.js` | Behavior (routing, palette, lightbox, favorites) |
| `assets/files/` | Downloadable documents |
| `assets/images/` (+ `thumbs/`) | Gallery images (full size + ~640px thumbnail) |
| `assets/media/` | Video and audio |

> **The repo and site are PUBLIC.** Never add anything personal, financial or family-related, client contact lists, credentials or `.env` files. If unsure, add it as a `private: true` entry instead (it shows a lock badge and has no link, and nothing gets uploaded).

## Add a card (link)
In `data.js`, find the section in `CC.sections` and add a line to its `links`:

```js
{ title: "New tool", sub: "example.com", url: "https://example.com", tag: "App", icon: "grid", color: "#00e5ff" },
```

Icons: `globe map grid layout link server bolt file image pin dumbbell chart wallet book gauge mail calendar kanban rocket cube folder photo note star flag` (you can add more SVG paths to `P` in `app.js`).

To pin it by default, add its title to `CC.defaultFavorites`. Each visitor can also pin and unpin with the star on any card.

## Add a section (sidebar entry)
Copy a whole block in `CC.sections`:

```js
{ id: "torque", title: "Torque Legion", nav: "Torque", icon: "cube", project: "Torque Legion",
  desc: "Short description.", links: [ /* cards */ ] },
```

`id` becomes the URL (`#/torque`). If `project` matches a project in `CC.projects`, that project's files and images show up on the section page automatically.

## Add a file
1. Copy the file into `assets/files/`.
2. Add a line to `CC.files`:

```js
{ name: "Price sheet", type: "pdf", project: "Rokhal", path: "assets/files/price-sheet.pdf", size: 120000, added: "2026-10-30" },
```

`size` is in bytes (`ls -l` shows it). Markdown and VTT files open on GitHub so they render nicely.

**Private item** (listed but never uploaded):

```js
{ name: "Client list", type: "csv", project: "Rokhal", size: 1848, added: "2026-10-22", private: true, note: "Private, on Becca's computer" },
```

## Add an image, video or audio clip
Images: save the full size (max ~1600px wide) to `assets/images/` and a ~640px-wide thumbnail with the same name to `assets/images/thumbs/`, then:

```js
{ title: "New logo", kind: "image", type: "Logo", project: "Rokhal", src: "assets/images/new-logo.png", thumb: "assets/images/thumbs/new-logo.png", w: 1200, h: 800, size: 54000, added: "2026-10-30" },
```

Add `featured: true` to show it in the Home "From the library" strip.

Video/audio (keep each file under ~25 MB; larger files go on the "private" list instead):

```js
{ title: "Promo clip", kind: "video", project: "Blaze", src: "assets/media/promo.mp4", poster: "assets/images/thumbs/promo.jpg", size: 3200000, added: "2026-10-30" },
{ title: "VO take", kind: "audio", project: "Rokhal", src: "assets/media/vo.mp3", size: 88000, added: "2026-10-30" },
```

## Home panels
`CC.status` / `CC.statusAsOf` (states: Done, Ready, Next, Waiting, Pending), `CC.goal` (days left are computed automatically), `CC.upNext`.

## Shortcuts
- `Ctrl K` / `⌘ K` or `/`: search everything and jump
- `↑ ↓ Enter`: move and open in the palette
- In the lightbox, `← →` move between images and `Esc` closes (swipe on a phone)

Commit and push to `main`. GitHub Pages updates in about a minute.
