const irc = require('irc');
const ws = require('ws');

exports.IRCBot = class {
  start(ircAddr, ircPort, ircSecure, ircNick, ircChannels, wsAddr, wsPort) {
    this.client = new irc.Client(ircAddr, ircNick, {
      channels: ircChannels
    }, {
      port: ircPort,
      secure: ircSecure
    });
    this.wsc = new ws('ws://' + wsAddr + ':' + wsPort);
  }
};
