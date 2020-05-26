
import { Client, Message } from 'discord.js';
import { move, upgrade, retreat, say } from './game';
import { model } from './vuemodel';


const client = new Client();
//client.commands = new Collection();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

interface ICommand {
  name: string;
  execute(msg: Message, args: string): void;
}

let getTeam = (msg: Message) => model.data.players.find(p => p.name == msg.author.username);

let moveCmd = {
  name: '!move',
  execute(msg: Message, args: string) {
    let team = getTeam(msg);
    if(team !== null){
      let actions = args.split(' ');
      move(Number(actions[1]),Number(actions[2]),100,team);
      console.log("moving");
    }
  }
};

let joinCmd = {
  name: '!join',
  execute(msg: Message, args: string) {
    let team = getTeam(msg);
    if(team === null)
      return;
    model.data.players.push({team: Number(args), name: msg.author.username});
    msg.reply(`joined!`);
  },
};

let upgradeCmd = {
  name: '!upgrade',
  execute(msg: Message, args: string) {
    let team = getTeam(msg);
    upgrade(Number(args), team.team);
  },
};

let leaveCmd = {
  name: '!leave',
  execute(msg: Message, args: string) {
    model.data.players = model.data.players.filter(p => p.name != msg.author.username);
    msg.reply('thanks for playing!');
  },
}

let retreatCmd = {
  name: '!retreat',
  execute(msg: Message, args: string) {
    let team = getTeam(msg);
    retreat(Number(args), team);
  },
}

let sayCmd = {
  name: '!say',
  execute(msg: Message, args: string){
    let chat = { name: msg.author.username, message: args };
    model.data.chat.push(chat);
    say(chat);
  }
}

let commands = [moveCmd, joinCmd, upgradeCmd, leaveCmd, retreatCmd, sayCmd];

client.on('message', msg => {
  commands.filter(p => msg.content.startsWith(p.name)).forEach(p => {
    let t = msg.content.replace(p.name,'');
    p.execute(msg,t);
  });
});




export default function login(token: string){
    client.login(token);
}


