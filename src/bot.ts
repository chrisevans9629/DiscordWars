
import { Client, Message } from 'discord.js';
import { move, upgrade, retreat, say, getColor, getTeam, addAvatar } from './game';
import { model } from './vuemodel';
import { toastInfo } from './vueapp';
import { TeamInteraction, Chat } from './support/TeamSystem';
import { botHandler } from './support/BotHandler';

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
  return TeamInteraction.players.find(p => p.name == msg.author.username)
};
let hasJoined = (msg: Message) => {
  let team = getPlayer(msg);
  if(!team){
    msg.reply("you must !join first");
    return {joined: false, team: team};
  }
  return {joined: true, team: team};
};



let moveCmd = {
  name: ['!move', '! move', '!m '],
  execute(msg: Message, args: string) {
    let team = hasJoined(msg);
    if(!team.joined){
      return;
    }
    let actions = args.split(' ').filter(p => p != ' ');
    console.log(actions);
    if(actions[0] == 'a' || actions[0] == 'all'){
        botHandler.moveAll(Number(actions[1]), 100, team.team);
    }
    else if(actions.length == 1){
       botHandler.moveAll(Number(actions[0]), 100, team.team);
    }
    else {
      let result = move(Number(actions[0]),Number(actions[1]),100,team.team);
      msg.reply(result.reason);
    }
    
    //console.log("moving");
  }
};

let joinCmd = {
  name: ['!join', '! join', '!j '],
  execute(msg: Message, args: string) {
    
    args = args.replace(' ','');
    let player = getPlayer(msg);
    if(player){
      msg.reply('you are already joined');
      return;
    }
    let team = getTeam(args);
    if(!team){
      msg.reply(`team '${args}' does not exist`);
      return;
    }
    let play = {team: team, name: msg.author.username, style: {color: getColor(team.teamId)}, avatarUrl: msg.author.avatarURL()};
    TeamInteraction.addPlayer(play);

    addAvatar(play);
    toastInfo(`player ${msg.author.username} joined!`);
    msg.reply(`joined!`);
  },
};

let upgradeCmd = {
  name: ['!upgrade', '! upgrade', '!u '],
  execute(msg: Message, args: string) {
    let team = hasJoined(msg);
    if(!team.joined){
      return;
    }
    upgrade(Number(args), team.team.team.teamId);
  },
};

let leaveCmd = {
  name: ['!leave',  '! leave', '!l'],
  execute(msg: Message, args: string) {
    if(!hasJoined(msg).joined){
      return;
    }
    TeamInteraction.removePlayer(msg.author.username);
    msg.reply('thanks for playing!');
  },
}

let retreatCmd = {
  name: ['!retreat', '! retreat','!r '],
  execute(msg: Message, args: string) {
    let team = hasJoined(msg);
    if(!team.joined){
      return;
    }
    let result = retreat(Number(args), team.team);
    msg.reply(result.reason);
  },
}



let sayCmd = {
  name: ['!say','! say', '!s '],
  execute(msg: Message, args: string){
    
    let joined = hasJoined(msg);
    if(!joined.joined){
      return;
    }
    
    let chat: Chat = { name: msg.author.username, message: args, player: joined.team };
    TeamInteraction.addChat(chat);
    say(chat);
  }
}

let helpCmd = {
  name: ['!help', '! help', '!h'],
  execute(msg: Message, args: string){
    msg.reply("!join 1 -> joins team 1\r\n!move 2 4 -> moves from base 2 to base 4\r\n!upgrade 1 -> upgrades base 1\r\n!retreat 1 -> retreats all units away from base 1\r\n!say loser -> roasts the other team\r\n!leave -> leaves the game");
  }
};

let commands = [moveCmd, joinCmd, upgradeCmd, leaveCmd, retreatCmd, sayCmd, helpCmd];

client.on('message', msg => {
  commands.forEach(p => {
    p.name.filter(t => msg.content.toLocaleLowerCase().startsWith(t)).forEach(r => {
      let t = msg.content.substr(r.length,100);
      p.execute(msg,t);
    });
  });
});




export default function login(token: string){
    return client.login(token);
}


