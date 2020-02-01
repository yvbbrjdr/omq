const config = require('../config/client');
const ircbot = require('./ircbot');

const b = new ircbot.IRCBot();
b.start(config.config.ircAddr, config.config.ircPort, config.config.ircSecure, config.config.ircNick, config.config.ircChannel, config.config.wsAddr, config.config.wsPort);
