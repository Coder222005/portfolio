# Portfolio (static)

Simple static portfolio with a client-side editable blog system.

Quick start:

1. Serve the folder (recommended) with a simple HTTP server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

2. Open the site and view blogs under the "Blogs" section. The initial posts live in `blogs.json`.

Editing and updating posts:

- Use the "New Post" or "Edit" buttons in the site to edit posts in-browser. Edits are saved to `localStorage` as a backup.
- To persist changes to the repository, click "Download blogs.json" to get the updated JSON, then replace the repo `blogs.json` and push.

Files:

- [index.html](index.html) — main site
- [styles.css](styles.css) — styles
- [app.js](app.js) — client logic
- [blogs.json](blogs.json) — blog data (edit and commit to update site)

Enjoy! If you want server-side blog editing, I can add a simple Node or Python backend to accept edits and persist them to `blogs.json`.
# portfolio