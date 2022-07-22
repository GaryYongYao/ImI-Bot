const fetch = require('node-fetch')
const { coinMarketCapURL } = require('../utils/constant');
const { deleteMsg } = require('../utils')

async function getMarketCap(msg) {
  try {
    const search = msg.content.split(' ')[2].toUpperCase()
  
    const badResponse = () => msg.reply(`Hello, ${msg.author}, please provide a valid symbol for me to run the fetch.`)
  
    if (!search) {
      badResponse();
      return;
    }
  
    // Search
    const infoRes = await fetch(`${coinMarketCapURL}v2/cryptocurrency/info?CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API}&symbol=${search}`)
    const info = await infoRes.json();
  
    if (!info.data[search]) {
      badResponse();
      return;
    }
    
    const quoteRes = await fetch(`${coinMarketCapURL}v2/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API}&symbol=${search}`)
    const quotes = await quoteRes.json();
  
    if (!quotes.data[search]) {
      badResponse();
      return;
    }
  
    const { name, symbol, slug, logo, description, category } = info.data[search][0];
    const { cmc_rank, quote, total_supply, circulating_supply } = quotes.data[search][0];
    const { market_cap, volume_24h, price, percent_change_24h, percent_change_7d, percent_change_30d } = quote.USD
  
    if (category !== 'coin') {
      badResponse();
      return;
    }
  
    const embeds = [{
  	  color: 0xf2a900,
      title: `${name}(${symbol})`,
      url: `https://coinmarketcap.com/currencies/${slug}/`,
    	thumbnail: { url: logo },
      description,
    	author: {
    		name: 'CoinMarketCap',
    		icon_url: 'https://jobboardio.s3.amazonaws.com/uploads/employer/logo/293118/profile_coinmarketcap_black_logomark__1_.png',
    		url: 'https://coinmarketcap.com/',
    	},
  	  fields: [
    		{
    			name: `Details`,
    			value: `Market cap: $${market_cap?.toFixed(3)} (ranked #${cmc_rank})\n${total_supply ? `Total supply: ${total_supply} ${symbol}\n` : ''}Circulating supply: ${circulating_supply} ${symbol}`,
  			  inline: false,
    		},
    		{
    			name: `Trade`,
    			value: `Current Price: $${price?.toFixed(3)}\nTotal volume (24h): $${volume_24h?.toFixed(3)}`,
  			  inline: true
    		},
    		{
    			name: `Price change`,
    			value: ` Past day: ${percent_change_24h?.toFixed(2)}%\nPast week: ${percent_change_7d?.toFixed(2)}%\nPast month: ${percent_change_30d?.toFixed(2)}%`,
  			  inline: true
    		}
      ],
      footer: { text: 'Fetched from CoinMarketCap'}
    }]
      
    msg.channel.send({embeds});
    deleteMsg(msg);
  } catch(err) {
    console.log(err.message)
    msg.reply('Something went wrong :smiling_face_with_tear:')
  }
}

async function getTopList(msg) {
  try {
    const res = await fetch(`${coinMarketCapURL}v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.COINMARKETCAP_API}&limit=10`)
    const { data } = await res.json();
    
    const embeds = [{
      color: 0xf2a900,
      title: `Top 10 Crypto`,
      url: 'https://coinmarketcap.com/',
      author: {
        name: 'CoinMarketCap',
        icon_url: 'https://jobboardio.s3.amazonaws.com/uploads/employer/logo/293118/profile_coinmarketcap_black_logomark__1_.png',
        url: 'https://coinmarketcap.com/',
      },
      fields: data?.map(({
        name,
        quote: { USD },
        symbol,
        total_supply,
        circulating_supply,
        cmc_rank
      }) => ({
          name: `${name} - ${symbol} (ranked #${cmc_rank})`,
          value: `Market cap: $${USD?.market_cap?.toFixed(3)}\n${total_supply ? `Total supply: ${total_supply} ${symbol}\n` : ''}Circulating supply: ${circulating_supply} ${symbol}\nCurrent Price: $${USD?.price?.toFixed(3)}\nTotal volume (24h): $${USD?.volume_24h?.toFixed(3)}\nPast day: ${USD?.percent_change_24h?.toFixed(2)}%\n`,
          inline: false,
      })),
      footer: { text: 'Fetched from CoinMarketCap'}
    }]
      
    msg.channel.send({embeds});
    deleteMsg(msg);
  } catch(err) {
    console.log(err)
    msg.reply('Something went wrong :smiling_face_with_tear:')
  }
}

module.exports = {
  getMarketCap,
  getTopList
}