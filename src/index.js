const mq = require('./mediaqueue');
const mpv = require('./mpv');

// mpv --idle --fullscreen --input-ipc-server=/tmp/mpvsock
// socat unix-connect:/tmp/mpvsock tcp-listen:12345,fork,reuseaddr

(async () => {
  const que = new mq.MediaQueue();
  await que.push('jerryzhou', 'seyana', true);
  const m = new mpv.MPV();
  await m.connect('127.0.0.1', 12345);
  const info = que.pop();
  await m.load(info.url, info.video);
  m.on('idle', () => {
    console.log('done!');
    m.close();
  });
})();
