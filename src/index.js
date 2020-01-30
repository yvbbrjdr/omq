const omq = require('./omq');

// mpv --idle --fullscreen --input-ipc-server=/tmp/mpvsock
// socat unix-connect:/tmp/mpvsock tcp-listen:12345,fork,reuseaddr

const q = new omq.OCFMediaQueue();
q.connectPlayer('127.0.0.1', 12345).then(() => {
  q.queueMedia('jerryzhou', 'seyana', true);
});
