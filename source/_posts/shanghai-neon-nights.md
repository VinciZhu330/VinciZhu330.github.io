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

## How media works in travel posts

Put images and videos under `source/media/shanghai-neon-nights/`, then reference them by absolute path:

```html
<img src="/media/shanghai-neon-nights/bund.jpg" alt="The Bund at night" loading="lazy">

<video controls preload="metadata" playsinline>
  <source src="/media/shanghai-neon-nights/bund-walk.mp4" type="video/mp4">
</video>
```

Once the real files are in place, move the tags out of this code fence and they will render. Tips:

- Keep videos as H.264 `.mp4`, ideally under ~30 MB (GitHub's hard limit is 100 MB per file).
- Use `loading="lazy"` for images below the fold.
