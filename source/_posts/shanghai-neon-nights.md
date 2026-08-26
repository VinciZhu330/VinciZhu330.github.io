---
title: Shanghai Neon Nights
date: 2026-08-24 15:30:00
tags:
  - travel
description: Demo travel post — the first pin on the travel map.
location:
  city: Shanghai
  lat: 31.2304
  lng: 121.4737
---

First pin on the travel map! This demo post shows how a travel story is wired to the map: the `location` block in the front matter is all it takes — the marker appears on [/map/](/map/) automatically at build time.

Replace this post with your own journey, or delete it once your first real travel log is published.

## How to insert local images

`hexo new post` creates a folder next to this file with the same name (`source/_posts/shanghai-neon-nights/`). Drop local images straight into it, then reference them by file name only:

```markdown
![The Bund at night](bund.jpg)
```

Videos live in the same folder and embed with a relative path:

```html
<video controls preload="metadata" playsinline>
  <source src="bund-walk.mp4" type="video/mp4">
</video>
```

Tips:

- Keep videos as H.264 `.mp4`, ideally under ~30 MB (GitHub's hard limit is 100 MB per file).
- Images render at half column width by default (site style); that's expected.
