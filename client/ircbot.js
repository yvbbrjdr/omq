const irc = require('irc');
const ws = require('ws');

exports.IRCBot = class {
  start(ircAddr, ircPort, ircSecure, ircNick, ircChannel, wsAddr, wsPort) {
    this.client = new irc.Client(ircAddr, ircNick, {
      port: ircPort,
      secure: ircSecure,
      channels: [ircChannel]
    });
    this.wsc = new ws('ws://' + wsAddr + ':' + wsPort);
  }
};
