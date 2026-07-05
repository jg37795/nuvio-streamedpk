var exports = {};

exports.getCatalog = function() {
  return {
    metas: [{
      id: 'tt1234567',
      type: 'movie',
      name: '✅ TEST MATCH – Click me',
      poster: '',
      extra: { test: true }
    }]
  };
};

exports.getStreams = function() {
  return {
    streams: [{
      name: 'Apple Test HLS',
      url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
      type: 'hls'
    }]
  };
};

module.exports = exports;
