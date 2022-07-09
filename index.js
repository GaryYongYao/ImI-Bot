const { Client, Intents, MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const cryptoRoute = require('./crypto')
const keepAlive = require('./server')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

async function getQuote() {
  const res = await fetch('https://zenquotes.io/api/random')
  const data = await res.json();
  
  const embed = { title: 'Inspiring',  }
    new MessageEmbed()
    .setTitle('Inspiring')
    .setDescription(data[0].q)
    .setAuthor(data[0].a)

  return embed
}

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return
  
  if (msg.mentions.users.has(client.user.id)) {
    msg.reply(`Hello, ${msg.author}`)
  }
  
  if (msg.content === '!inspire') {
    const quote = await getQuote()
    
    msg.channel.send({embeds: [quote]})
  }

  if (msg.content.includes('!crypto')) {
    cryptoRoute(msg);
    return;
    // msg.reply(` ${encouragement}`)
  }
})

keepAlive()
client.login(process.env.TOKEN)
