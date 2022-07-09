const { getCurrentGasFee } = require('./getGas')
const { getMarketCap } = require('./common')

function cryptoRoute(msg) {
  if (msg.content.includes('-gas')) {
    getCurrentGasFee(msg);
    return;
  }
  if (msg.content.includes('-price')) {
    getMarketCap(msg);
    return;
  }
}

module.exports = cryptoRoute