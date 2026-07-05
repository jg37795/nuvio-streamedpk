/**
 * streamedpk - Built from src/streamedpk/
 * Generated: 2026-07-05T04:17:38.580Z
 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/streamedpk/index.js
var streamedpk_exports = {};
__export(streamedpk_exports, {
  getCatalog: () => getCatalog,
  getMeta: () => getMeta,
  getStreams: () => getStreams
});
module.exports = __toCommonJS(streamedpk_exports);
var API = "https://streamed.pk/api";
var PROXY = "https://cors-proxy.jg37795.workers.dev/";
function fetchJson(url) {
  return __async(this, null, function* () {
    const res = yield fetch(PROXY + encodeURIComponent(url));
    if (!res.ok)
      throw new Error(`HTTP ${res.status}`);
    return res.json();
  });
}
function getCatalog(_0) {
  return __async(this, arguments, function* ({ type, id }) {
    var _a;
    if (type !== "movie" || id !== "all")
      return { metas: [] };
    let sports = ["football"];
    try {
      const data = yield fetchJson(`${API}/sports`);
      if (Array.isArray(data) && data.length) {
        sports = typeof data[0] === "string" ? data : data.map((s) => s.id || s.name || s.sport).filter(Boolean);
      }
    } catch (e) {
    }
    let metas = [];
    for (const sport of sports) {
      try {
        const matches = yield fetchJson(`${API}/matches/${sport}`);
        if (!matches || !matches.length)
          continue;
        for (const m of matches) {
          const src = ((_a = m.sources) == null ? void 0 : _a[0]) || {};
          metas.push({
            id: `match_${m.id}`,
            type: "movie",
            name: m.title || `${sport} live`,
            poster: m.poster || "",
            extra: {
              sport,
              source: src.source || src.id,
              sourceId: src.id || src.source
            }
          });
        }
      } catch (e) {
      }
    }
    return { metas };
  });
}
function getStreams(_0) {
  return __async(this, arguments, function* ({ extra }) {
    if (!(extra == null ? void 0 : extra.source) || !(extra == null ? void 0 : extra.sourceId))
      return { streams: [] };
    try {
      const data = yield fetchJson(
        `${API}/stream/${extra.source}/${extra.sourceId}`
      );
      return {
        streams: data.map((s) => ({
          name: s.quality || s.label || "HD",
          url: s.link || s.embed || s.url,
          type: s.link && s.link.includes(".m3u8") ? "hls" : "iframe"
        }))
      };
    } catch (e) {
      return { streams: [] };
    }
  });
}
function getMeta(_0) {
  return __async(this, arguments, function* ({ extra }) {
    return {
      meta: {
        id: "match",
        type: "movie",
        name: (extra == null ? void 0 : extra.sport) ? `Live ${extra.sport}` : "Live Match"
      }
    };
  });
}
