const config = require('../config/server');
const service = require('./service');

const s = new service.Service();
s.start(config.config.wsAddr, config.config.wsPort, config.config.mpvAddr, config.config.mpvPort);
