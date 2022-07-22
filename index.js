const { Client, Intents, MessageEmbed } = require('discord.js')
const cryptoRoute = require('./crypto')
const keepAlive = require('./server')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return
  
  if (msg.mentions.users.has(client.user.id)) {
    msg.reply(`Hello, ${msg.author}`)
  }

  if (msg.content.includes('!crypto')) {
    cryptoRoute(msg);
    return;
  }
})

keepAlive()
client.login(process.env.TOKEN)
