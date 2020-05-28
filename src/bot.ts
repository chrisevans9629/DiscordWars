
import { Client, Message } from 'discord.js';
import { move, upgrade, retreat, say, getColor, getTeam } from './game';
import { model, Chat, Player } from './vuemodel';
import { toastInfo } from './vueapp';

const client = new Client();
//client.commands = new Collection();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

interface ICommand {
  name: string;
  execute(msg: Message, args: string): void;
}

let getPlayer = (msg: Message) => {
  return model.data.players.find(p => p.name == msg.author.username)
};

let moveCmd = {
  name: '!move',
  execute(msg: Message, args: string) {
    let team = getPlayer(msg);
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
    args = args.replace(' ','');
    let player = getPlayer(msg);
    if(player){
      msg.reply('you are already joined');
      return;
    }
    let tm = Number(args);
    let team = getTeam(tm);
    if(!team){
      msg.reply(`team '${args}' does not exist`);
      return;
    }
    model.data.players.push({team: tm, name: msg.author.username, style: {color: getColor(tm)}});
    toastInfo(`player ${msg.author.username} joined!`);
    msg.reply(`joined!`);
  },
};

let upgradeCmd = {
  name: '!upgrade',
  execute(msg: Message, args: string) {
    let team = getPlayer(msg);
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
    let team = getPlayer(msg);
    retreat(Number(args), team);
  },
}

let sayCmd = {
  name: '!say',
  execute(msg: Message, args: string){
    let team = getPlayer(msg);
    if(!team){
      msg.reply("you must !join first");
      return;
    }
    
    let chat: Chat = { name: msg.author.username, message: args, player: team };
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
    return client.login(token);
}


