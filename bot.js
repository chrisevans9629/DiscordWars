
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', (client) => {
  console.log(`Logged in as ${client.user}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(token);