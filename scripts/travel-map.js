'use strict';

/**
 * Travel map marker generator
 * ------------------------------------------------------------------
 * Collects every post whose front matter carries a `location` object
 * (city / lat / lng) and emits the list as /map/markers.json, which
 * the interactive map page (/map/) fetches at runtime.
 *
 * Post front-matter example:
 *   location:
 *     city: Shanghai
 *     lat: 31.2304
 *     lng: 121.4737
 *
 * Posts without a valid numeric lat/lng are silently skipped, so a
 * malformed post can never break the JSON.
 */
hexo.extend.generator.register('travel_map_markers', function (locals) {
  const { stripHTML, truncate } = require('hexo-util');

  const markers = locals.posts
    .sort('-date')
    .filter(post => {
      const loc = post.location;
      return Boolean(
        loc && Number.isFinite(Number(loc.lat)) && Number.isFinite(Number(loc.lng))
      );
    })
    .map(post => {
      const loc = post.location;
      const text = stripHTML(post.excerpt || post.description || post.content || '').trim();
      return {
        title: post.title,
        url: post.permalink,
        city: loc.city || '',
        lat: Number(loc.lat),
        lng: Number(loc.lng),
        date: post.date.format(hexo.config.date_format),
        description: truncate(text, { length: 120 }),
        cover: post.cover || ''
      };
    });

  return { path: 'map/markers.json', data: JSON.stringify(markers) };
});
