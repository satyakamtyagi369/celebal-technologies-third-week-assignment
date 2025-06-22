const EventEmitter = require('events');
class Logger extends EventEmitter {}
const logger = new Logger();

logger.on('log', (msg) => {
    console.log(`Logged Event Trigger: ${msg}`);
});

module.exports = logger;
