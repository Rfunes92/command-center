# Ronnie's Command Center

Live: https://rfunes92.github.io/command-center/

One file (`index.html`), no build step. Every link and status item lives in plain JS arrays at the top of `index.html`, in the `EDIT DATA HERE` block.

## Add a card
Find the section in `SECTIONS` and add a line to its `links`:

```js
{ title: "New tool", url: "https://example.com", tag: "App", icon: "grid", color: "#00e5ff" },
```

- `title`: card name
- `url`: opens in a new tab
- `tag`: the small pill (Client, Finance, App, ...)
- `icon`: one of `globe map grid layout link server bolt file image pin dumbbell chart wallet book gauge mail calendar kanban` (see `ICONS` further down the file, where you can add your own SVG path)
- `color`: icon tile color (any hex)
- `sub` (optional): small text shown instead of the domain

## Add a section
Copy a whole `{ id, title, sub, filter, links: [...] }` block in `SECTIONS`. A new `filter` name gets its own chip automatically.

## Favorites, status, goal
- `FAVORITES`: card titles pinned to the top row
- `STATUS` / `STATUS_AS_OF`: the "Where things stand" panel (states: Done, Ready, Next, Waiting, Pending)
- `GOAL`: signed clients, target, deadline (days left is computed automatically), prospects
- `UP_NEXT`: the banner text

Commit and push to `main`. GitHub Pages updates in about a minute.
