const ws = require('ws');

const omq = require('./omq');

exports.Service = class {
  constructor() {
    this.que = new omq.OCFMediaQueue();
  }

  async start(wsAddr, wsPort, mpvAddr, mpvPort) {
    await this.que.connectPlayer(mpvAddr, mpvPort);
    this.wss = new ws.Server({
      host: wsAddr,
      port: wsPort
    });
    this.wss.on('connection', async (client) => {
      client.on('message', async (data) => {
        const comm = JSON.parse(data)['command'];
        switch (comm[0]) {
          case 'queue':
            await this.que.queueMedia(comm[1], comm[2], comm[3]);
            this.sendQueued(client);
            break;
          case 'skip':
            this.que.skip();
            break;
          case 'remove':
            this.que.removeMedia(comm[1], comm[2]);
            break;
          case 'play':
            this.que.play();
            break;
          case 'pause':
            this.que.pause();
            break;
          case 'setVolume':
            await this.que.setVolume(comm[1]);
            this.wss.clients.forEach((client) => {
              if (client.readyState === ws.OPEN)
                this.sendVolume(client, comm[1]);
            });
            break;
          case 'getState':
            this.sendState(client);
            break;
          case 'getVolume':
            this.sendVolume(client);
            break;
        }
      });
      await this.sendState(client);
      this.sendVolume(client);
    });
    this.que.on('stateChanged', (state) => {
      this.wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN)
          this.sendState(client, state);
      });
    });
  }

  sendEvent(client, name, data) {
    return new Promise((resolve, _) => {
      client.send(JSON.stringify({
        event: name,
        data: data
      }), {}, resolve);
    });
  }

  sendState(client, state) {
    if (state === undefined)
      state = this.que.getState();
    return this.sendEvent(client, 'stateChanged', state);
  }

  async sendVolume(client, volume) {
    if (volume === undefined)
      volume = await this.que.getVolume();
    await this.sendEvent(client, 'volumeChanged', volume);
  }

  sendQueued(client) {
    return this.sendEvent(client, 'queued', null);
  }
};
