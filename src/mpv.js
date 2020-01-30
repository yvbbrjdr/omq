const net = require('net');
const events = require('events');

exports.MPV = class {
  constructor() {
    this.socket = new net.Socket();
    this.emitter = new events.EventEmitter();
    this.requestId = 0;
    this.socket.setEncoding('utf8');
    this.socket.on('data', (data) => {
      const lines = data.split('\n').filter((s) => {
        return s.length > 0;
      });
      lines.forEach((line) => {
        const event = JSON.parse(line)['event'];
        if (event)
          this.emitter.emit(event);
      });
    });
  }

  connect(addr, port) {
    return new Promise((resolve, _) => {
      this.socket.connect(port, addr, resolve);
    });
  }

  send(command) {
    const id = this.requestId++;
    return new Promise((resolve, _) => {
      const recv = (data) => {
        const lines = data.split('\n').filter((s) => {
          return s.length > 0;
        });
        lines.forEach((line) => {
          const obj = JSON.parse(line);
          if (obj['request_id'] === id) {
            resolve(obj['data']);
            this.socket.removeListener('data', recv);
          }
        });
      };
      this.socket.on('data', recv);
      this.socket.write(JSON.stringify({
        command: command,
        request_id: id
      }) + '\n');
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

  get_volume(volume) {
    return this.send(['get_property', 'volume']);
  }

  set_volume(volume) {
    return this.send(['set_property', 'volume', volume]);
  }

  close() {
    this.socket.destroy();
  }

  on(event, listener) {
    this.emitter.on(event, listener);
  }
};
