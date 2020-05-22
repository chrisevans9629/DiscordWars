
import { Client } from 'discord.js';

const client = new Client();
//client.commands = new Collection();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!ping') {
    msg.reply('!Pong');
  }
  if (msg.content.startsWith('!join')) {
    msg.reply(`joined!`);
  }
  if (msg.content.startsWith('!move')){
    msg.reply('moving!');
  }
  if(msg.content.startsWith('!upgrade')){
    msg.reply('upgrading!');
  }
  if(msg.content.startsWith('!leave')){
    msg.reply('thanks for playing!');
  }
  if(msg.content.startsWith('!retreat')){
    msg.reply('fighting another day!');
  }
});
export default function login(token: string){
    client.login(token);
}


