const omq = require('./src/omq');

// mpv --idle --fullscreen --input-ipc-server=/tmp/mpvsock
// socat unix-connect:/tmp/mpvsock tcp-listen:12345,fork,reuseaddr

(async () => {
  const q = new omq.OCFMediaQueue();
  q.on('stateChanged', (state) => {
    console.log(JSON.stringify(state, null, 4));
    if (state['now_playing'] === null)
      q.disconnectPlayer();
  });
  await q.connectPlayer('127.0.0.1', 12345);
  await q.queueMedia('jerryzhou', 'seyana', true);
  await q.queueMedia('keur', 'test', false);
  await q.queueMedia('jerryzhou', 'linus tech tips', true);
  await q.queueMedia('abizer', 'departures guilty crown', false);
  await q.queueMedia('keur', 'rickroll', false);
  q.removeMedia('keur', 0);
  await q.queueMedia('abizer', '前前前世', true);
  q.skip();
})();
