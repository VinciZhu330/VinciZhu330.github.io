/**
 * Travel map runtime — Vinci's Blog (/map/)
 * ------------------------------------------------------------------
 * Lazy-loads Leaflet, fetches /map/markers.json (generated at build
 * time from posts that carry a `location` front-matter object) and
 * renders draggable dark tiles with one neon marker per travel post.
 *
 * Loaded site-wide via inject.bottom, but no-ops on every page that
 * does not contain a #travel-map element.
 */
(function () {
  'use strict';

  var CONTAINER_ID = 'travel-map';
  var MARKERS_URL = '/map/markers.json';
  var LEAFLET_VERSION = '1.9.4';
  var LEAFLET_CSS = 'https://cdn.jsdelivr.net/npm/leaflet@' + LEAFLET_VERSION + '/dist/leaflet.css';
  var LEAFLET_JS = 'https://cdn.jsdelivr.net/npm/leaflet@' + LEAFLET_VERSION + '/dist/leaflet.js';
  var TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var TILE_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors ' +
    '&copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

  var mapInstance = null;
  var mapEl = null;

  /* ---------- helpers ---------- */

  function escapeHtml(s) {
    var lookup = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(s).replace(/[&<>"']/g, function (c) { return lookup[c]; });
  }

  function loadCss(href) {
    var id = 'tm-leaflet-css';
    if (document.getElementById(id)) return;
    var link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (window.L) { resolve(); return; }
      var id = 'tm-leaflet-js';
      var existing = document.getElementById(id);
      if (existing) { existing.addEventListener('load', resolve, { once: true }); return; }
      var script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Failed to load Leaflet')); };
      document.head.appendChild(script);
    });
  }

  function popupHtml(m) {
    var html =
      '<a class="tm-popup-title" href="' + escapeHtml(m.url) + '">' + escapeHtml(m.title) + '</a>';
    if (m.city) html += '<div class="tm-popup-city">📍 ' + escapeHtml(m.city) + '</div>';
    if (m.date) html += '<div class="tm-popup-date">' + escapeHtml(m.date) + '</div>';
    if (m.description) html += '<div class="tm-popup-desc">' + escapeHtml(m.description) + '</div>';
    html += '<a class="tm-popup-link" href="' + escapeHtml(m.url) + '">Read more →</a>';
    return html;
  }

  /* ---------- map ---------- */

  function buildMap(el, markers) {
    mapInstance = L.map(el, {
      center: [25, 10],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true
    });

    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTR,
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapInstance);

    var bounds = [];
    markers.forEach(function (m) {
      var icon = L.divIcon({
        className: 'tm-marker-wrap',
        html: '<span class="tm-marker"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12]
      });
      L.marker([m.lat, m.lng], { icon: icon })
        .addTo(mapInstance)
        .bindPopup(popupHtml(m), { maxWidth: 280 });
      bounds.push([m.lat, m.lng]);
    });

    if (bounds.length) {
      mapInstance.fitBounds(bounds, { padding: [48, 48], maxZoom: 6 });
    }
  }

  function init() {
    var el = document.getElementById(CONTAINER_ID);
    if (!el) return;                             // not the map page — no-op
    if (mapInstance && mapEl === el) return;     // already initialised
    if (mapInstance) { mapInstance.remove(); mapInstance = null; } // container swapped (pjax)
    mapEl = el;

    loadCss(LEAFLET_CSS);
    loadScript(LEAFLET_JS)
      .then(function () {
        return fetch(MARKERS_URL + '?t=' + Date.now(), { cache: 'no-cache' });
      })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (markers) {
        buildMap(el, Array.isArray(markers) ? markers : []);
      })
      .catch(function (err) {
        mapEl = null; // allow retry on next navigation
        el.innerHTML = '<div class="tm-error">Map failed to load: ' + escapeHtml(err.message) + '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  // Future-proofing: pjax is currently disabled in the theme config.
  document.addEventListener('pjax:complete', init);
})();
