const net = require('net');

exports.MPV = class {
  constructor() {
    this.socket = net.Socket();
  }

  connect(addr, port) {
    return new Promise((resolve, _) => {
      this.socket.connect(port, addr, resolve);
    });
  }

  send(command) {
    return new Promise((resolve, _) => {
      this.socket.write(JSON.stringify({command: command}) + '\n', resolve);
    });
  }

  load(url, video) {
    return this.send(['loadfile', url, 'replace', 'vid=' + (video ? 'auto' : 'no')]);
  }

  play() {
    return this.send(['set_property', 'pause', false]);
  }

  pause() {
    return this.send(['set_property', 'pause', true]);
  }

  stop() {
    return this.send(['stop']);
  }

  set_volume(volume) {
    return this.send(['set_property', 'volume', volume]);
  }

  close() {
    this.socket.destroy();
  }
};
