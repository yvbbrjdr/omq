const irc = require('irc');
const ws = require('ws');

exports.IRCBot = class {
  start(ircAddr, ircPort, ircSecure, ircNick, ircChannel, wsAddr, wsPort) {
    this.volume = 0;
    this.state = {
      now_playing: null,
      queue: []
    };
    this.client = new irc.Client(ircAddr, ircNick, {
      port: ircPort,
      secure: ircSecure,
      channels: [ircChannel]
    });
    this.wsc = new ws('ws://' + wsAddr + ':' + wsPort);
    this.client.on('message', async (from, _, msg) => {
      const space = msg.indexOf(' ');
      const comm = ['', ''];
      if (space === -1) {
        comm[0] = msg;
      } else {
        comm[0] = msg.slice(0, space);
        comm[1] = msg.slice(space + 1).trim();
      }
      switch (comm[0]) {
        case '!h':
          this.sendToChat('help:');
          this.sendToChat('!h         : show this help');
          this.sendToChat('!n         : show now playing');
          this.sendToChat('!p         : play');
          this.sendToChat('!ps        : pause');
          this.sendToChat('!q <query> : queue audio');
          this.sendToChat('!qv <query>: queue video');
          this.sendToChat('!r <id>    : remove media');
          this.sendToChat('!s         : skip');
          this.sendToChat('!sq        : show the queue');
          this.sendToChat('!v [volume]: get/set the volume');
          break;
        case '!n':
          const n = this.state['now_playing'];
          if (n === null)
            this.sendToChat('OMQ is idle.');
          else
            this.sendToChat(n.title + ' (' + n.url + ')');
          break;
        case '!p':
          this.sendPlay();
          break;
        case '!ps':
          this.sendPause();
          break;
        case '!q':
          if (comm[1] === '')
            this.sendToChat('usage: !q <query>');
          else
            this.sendQueue(from, comm[1], false);
          break;
        case '!qv':
          if (comm[1] === '')
            this.sendToChat('usage: !qv <query>');
          else
            this.sendQueue(from, comm[1], true);
          break;
        case '!r':
          if (comm[1] === '') {
            this.sendToChat('usage: !r <id>');
          } else {
            await this.sendRemove(from, parseInt(comm[1]));
            this.sendToChat('Removed if id is valid!');
          }
          break;
        case '!s':
          this.sendSkip();
          break;
        case '!sq':
          const q = this.state['queue'];
          if (q.length === 0)
            this.sendToChat('The queue is empty.');
          else
            q.forEach((user) => {
              this.sendToChat(user['username'] + ':');
              user['queue'].forEach((entry) => {
                this.sendToChat(entry.title);
              });
            });
          break;
        case '!v':
          if (comm[1] === '')
            this.sendToChat('Volume: ' + this.volume);
          else
            this.sendSetVolume(parseFloat(comm[1]));
          break;
      }
    });
    this.wsc.on('message', (data) => {
      const obj = JSON.parse(data);
      switch (obj['event']) {
        case 'stateChanged':
          this.state = obj['data'];
          break;
        case 'volumeChanged':
          this.volume = obj['data'];
          break;
        case 'queued':
          this.sendToChat('Queued!');
          break;
      }
    });
  }

  sendCommand(command) {
    return new Promise((resolve, _) => {
      this.wsc.send(JSON.stringify({command: command}), {}, resolve);
    });
  }

  sendQueue(username, query, video) {
    return this.sendCommand(['queue', username, query, video]);
  }

  sendSkip() {
    return this.sendCommand(['skip']);
  }

  sendRemove(username, id) {
    return this.sendCommand(['remove', username, id]);
  }

  sendPlay() {
    return this.sendCommand(['play']);
  }

  sendPause() {
    return this.sendCommand(['pause']);
  }

  sendSetVolume(volume) {
    return this.sendCommand(['setVolume', volume]);
  }

  sendToChat(msg) {
    this.client.say(this.client.opt.channels[0], msg);
  }
};
