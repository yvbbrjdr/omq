const irc = require('irc');
const ws = require('ws');

exports.IRCBot = class {
  start(server, nick, channels, wsAddr, wsPort) {
    this.client = new irc.Client(server, nick, {
      channels: channels
    });
    this.wsc = new ws(wsAddr + ':' + wsPort);
  }
};
