const events = require('events');

const mpv = require('./mpv');
const mq = require('./mediaqueue');

exports.OCFMediaQueue = class {
  constructor() {
    this.nowPlaying = null;
    this.que = new mq.MediaQueue();
    this.player = new mpv.MPV();
    this.emitter = new events.EventEmitter();
    this.player.on('idle', () => {
      this.playNext();
    });
  }

  connectPlayer(addr, port) {
    return this.player.connect(addr, port);
  }

  async playNext() {
    const info = this.que.pop();
    this.nowPlaying = info;
    if (info !== null)
      await this.player.load(info.url, info.video);
    this.emitter.emit('stateChanged', this.getState());
  }

  async queueMedia(username, query, video) {
    await this.que.push(username, query, video);
    if (this.nowPlaying === null) {
      await this.playNext();
      return;
    }
    this.emitter.emit('stateChanged', this.getState());
  }

  skip() {
    return this.player.stop();
  }

  removeMedia(username, id) {
    this.que.remove(username, id);
    this.emitter.emit('stateChanged', this.getState());
  }

  play() {
    return this.player.play();
  }

  pause() {
    return this.player.pause();
  }

  getVolume() {
    return this.player.getVolume();
  }

  setVolume(volume) {
    return this.player.setVolume(volume);
  }

  disconnectPlayer() {
    this.player.close();
  }

  getState() {
    return {
      now_playing: this.nowPlaying,
      queue: this.que.getQueue()
    };
  }

  on(event, listener) {
    this.emitter.on(event, listener);
  }
};
