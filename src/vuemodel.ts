import login from './bot';

import { move, retreat, upgrade, reset, getColor, updateVolume, getVolumes } from './game';
import { toastInfo, toastError } from './vueapp';
import { ITeamSystem, getTeam } from './support/TeamSystem';
export interface Player {
  name: string;
  team: ITeamSystem;
  style: object;
  avatarUrl: string;
}

export interface Chat {
  name: string;
  message: string;
  player: Player;
}

let chat: Chat[] = []
let players: Player[] = [];



let model = {
    el: '#app',
    data: {
        token: '',
        moveFrom: 2,
        moveTo: 4,
        amount: 100,
        gameOver: false,
        title: 'test',
        isDebugging: false,
        teams: [1,2],
        selectedTeam: 1,
        players: players,
        selectedPlayer: '',
        chat: chat,
        fps: 0,
        showToken: true,
        isSettings: false,
        music: 1,
        effects: 1,
        master: 1,
        isMainMenu: true,
    },
    delimiters: ['((','))'],
    mounted: function(){
       TryLogin();
    },
    methods: {
      settings: function() {
        let volumes = getVolumes();
         this.effects = volumes.effects;
        this.music = volumes.music;
        this.master = volumes.master;
        this.isSettings = !this.isSettings;
      },
      saveSettings: function() {
        updateVolume(this.music, this.effects, this.master);
        this.isSettings = !this.isSettings;
      },
      tokenLogin: async function(token: string){
        try {
          let t = await login(token);
          this.token = null;
          toastInfo('ready!');
          sessionStorage.setItem('magic',t);
          this.showToken = false;
          console.log(this.showToken);
          return true;
        } catch (error) {
          console.log(error);
          toastError(error);
          return false;
        }
     },
     move: function(){
       move(this.moveFrom,this.moveTo,this.amount, { name: '', team: getTeam(this.selectedTeam), style: {color: getColor(this.selectedTeam)}, avatarUrl: null});
     },
     retreat: function(){
       retreat(this.moveTo, { name: '', team: getTeam(this.selectedTeam), style: {color: getColor(this.selectedTeam)}, avatarUrl: null});
     },
     upgrade: function() {
        upgrade(this.moveTo, this.selectedTeam);
     },
     reset: function() {
        reset()
     },
     debug: function(){
       this.isDebugging = !this.isDebugging;
     },
    }
  }

  export async function TryLogin(){
    let token = sessionStorage.getItem('magic');
    if(token){
      return await model.methods.tokenLogin(token);
    }
    return false;
  }

export {model};