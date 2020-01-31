const config = require('../config/client');
const ircbot = require('./ircbot');

const b = new ircbot.IRCBot();
b.start(config.config.server, config.config.nick, config.config.channels, config.config.wsAddr, config.config.wsPort);
