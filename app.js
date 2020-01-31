const config = require('./config');
const service = require('./src/service');

const s = new service.Service();
s.start(config.config.wsAddr, config.config.wsPort, config.config.mpvAddr, config.config.mpvPort);
