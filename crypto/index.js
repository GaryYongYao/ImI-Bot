const { getETHFunctions } = require('./eth')
const { getMarketCap, getTopList } = require('./common')

function cryptoRoute(msg) {
  if (msg.content.includes('-price')) {
    getMarketCap(msg);
    return;
  }
  if (msg.content.includes('-list')) {
    getTopList(msg);
    return;
  }
  if (msg.content.includes('-eth')) {
    getETHFunctions(msg);
    return;
  }
}

module.exports = cryptoRoute