const youtube = require('./youtube');
const mpv = require('./mpv');

const timeoutPromise = (ms) => {
  return new Promise((resolve, _) => {
    setTimeout(resolve, ms);
  });
};


// mpv --idle --fullscreen --input-ipc-server=/tmp/mpvsock
// socat unix-connect:/tmp/mpvsock tcp-listen:12345,fork,reuseaddr

(async () => {
  const info = await youtube.query('seyana');
  console.log(info);
  const m = new mpv.MPV();
  await m.connect('127.0.0.1', 12345);
  await m.load(info.url, false);
  await timeoutPromise(10000);
  await m.pause();
  await timeoutPromise(1000);
  await m.play();
  await timeoutPromise(5000);
  await m.stop();
  await m.load(info.url, true);
  await timeoutPromise(10000);
  await m.pause();
  await timeoutPromise(1000);
  await m.play();
  await timeoutPromise(5000);
  await m.stop();
  m.close();
})();
