const Discord = require("discord.js")
const client = new Discord.Client()
require('dotenv').config()
const prefix = process.env.PREFIX

client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

   const args = message.content
       .trim().slice(prefix.length)
       .split(/ +/g);
   const command = args.shift().toLowerCase();

   try {
       const commandFile = require(`./commands/${command}.js`)
       commandFile.run(client, message, args);
   } catch (err) {
   console.error('Erro:' + err);
 }
 client.on("ready", () => {
    console.log('ready')
    client.user.setPresence(({
      status: 'dnd',
      activity: {
          name: "R6",
          type: "PLAYING",
          url: 'https://www.twitch.tv/dh3_'
      }
  }))
  
})
});


client.login(process.env.TOKEN)