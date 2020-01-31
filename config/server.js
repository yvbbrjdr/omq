// mpv --idle --fullscreen --input-ipc-server=/tmp/mpvsock
// socat unix-connect:/tmp/mpvsock tcp-listen:10678,fork,reuseaddr

exports.config = {
  wsAddr: '127.0.0.1',
  wsPort: 10080,
  mpvAddr: '127.0.0.1',
  mpvPort: 10678
};
