const handlers = require('./handlers');

function handler(data) {
    handlers.forEach(handler => handler.parse(data));
}

module.exports = {
    handler
};
