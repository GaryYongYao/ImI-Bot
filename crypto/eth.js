const fetch = require('node-fetch')
const moment = require('moment')
const { deleteMsg, GweitoWei, weiToEth } = require('../utils')
const { etherscanURL } = require('../utils/constant')

function getETHFunctions(msg) {
  if (msg.content.includes('-eth-gas')) {
    getEthGasFee(msg);
  }
  
  if (msg.content.includes('-eth-check')) {
    getTransactionByAcc(msg);
  }
}

async function getEthGasFee(msg) {
  try {
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
    deleteMsg(msg);
  } catch (err) {
    msg.reply('Something went wrong :smiling_face_with_tear:')
  }
}

async function getTransactionByAcc(msg) {
  try {
    const search = msg.content.split(' ')[2]
    const res = await fetch(`${etherscanURL}?module=account&action=txlist&address=${search}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.ETHERSCAN_KEY}`)
    const { result } = await res.json();

    msg.channel.send(`${search} latest transactions`)
  
    const embeds = result.map(({ hash, from, value, to, blockNumber, timeStamp }) => ({
  	  color: 0x3d3e3f,
      title: `${hash}`,
      url: `https://etherscan.io/tx/${hash}`,
      description: `Value: ${weiToEth(value)} ETH`,
  	  fields: [
        {
          name: `From`,
          value: `[${from}](https://etherscan.io/address/${from})`,
  			  inline: true
        },
        {
          name: `To`,
          value: `[${to}](https://etherscan.io/address/${to})`,
  			  inline: true
        },
        {
          name: `Block`,
          value: `[${blockNumber}](https://etherscan.io/block/${blockNumber})`,
  			  inline: true
        },
        {
          name: 'Transaction Time',
          value: `${moment.unix(timeStamp).format('DD/MM/YY h:mm:ss A')}`,
  			  inline: false
        }
      ],
      footer: { text: 'Fetched from etherscan'}
    }))
      
    msg.channel.send({embeds});
    deleteMsg(msg);
  } catch (err) {
    console.log(err)
    msg.reply('Something went wrong :smiling_face_with_tear:')
  }
}

module.exports = {
  getETHFunctions
}