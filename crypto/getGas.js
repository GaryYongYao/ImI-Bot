const fetch = require('node-fetch')
const { GweitoWei } = require('../utils')
const { etherscanURL } = require('../utils/constant')

function getCurrentGasFee(msg) {
  if (msg.content.includes('-gas-eth')) {
    getEthGasFee(msg);
  }
}

async function getEthGasFee(msg) {
  const res = await fetch(`${etherscanURL}?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_KEY}`)
  const data = await res.json();
  const { SafeGasPrice, ProposeGasPrice, FastGasPrice } = data.result

  const fees = [
    GweitoWei(SafeGasPrice),
    GweitoWei(ProposeGasPrice),
    GweitoWei(FastGasPrice)
  ]

  const speeds = fees.map(async (fee) => {
    const res = await fetch(`${etherscanURL}?module=gastracker&action=gasestimate&gasprice=${fee}&apikey=${process.env.ETHERSCAN_KEY}`)
    const { result } = await res.json();
    const time = parseInt(result)
    if (time < 60) {
      return `${time} seconds`
    } else {
      const min = Math.round(time / 60) > 10 ? '>10' : `${Math.round(time / 60)}`
      return `${min} minutes`
    }
  })

  const embeds = [{
	  color: 0x0099ff,
    title: ':fuelpump: Current gas prices',
	  fields: [
  		{
  			name: `Slow :turtle: | ${await speeds[0]}`,
  			value: `${SafeGasPrice} Gwei`,
  		},
  		{
  			name: `Average :person_walking: | ${await speeds[1]}`,
  			value: `${ProposeGasPrice} Gwei`,
  		},
  		{
  			name: `Fast :zap: | ${await speeds[2]}`,
  			value: `${FastGasPrice} Gwei`,
  		}
    ],
    footer: { text: 'Fetched from etherscan'}
  }]
    
  msg.channel.send({embeds});
}

module.exports = {
  getCurrentGasFee
}