import login from './bot';

import { move, retreat, upgrade, reset, getColor } from './game';
import { debug } from 'webpack';
import { toastInfo, toastError } from './vueapp';
export interface Player {
  name: string;
  team: number;
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
    },
    delimiters: ['((','))'],
    mounted: function(){
      let token = sessionStorage.getItem('magic');
      if(token){
        this.tokenLogin(token);
      }
    },
    methods: {
     tokenLogin: function(token: string){
       login(token).then(p => {
         this.token = null;
         toastInfo('ready!');
         sessionStorage.setItem('magic',p);
         this.showToken = false;
         console.log(this.showToken);
       }, p => {
         console.log(p);
         toastError(p);
       }).catch(p => {
         console.log(p);
         toastError(p);
       });
     },
     move: function(){
       move(this.moveFrom,this.moveTo,this.amount, { name: '', team: this.selectedTeam, style: {color: getColor(this.selectedTeam)}, avatarUrl: null});
     },
     retreat: function(){
       retreat(this.moveTo, { name: '', team: this.selectedTeam, style: {color: getColor(this.selectedTeam)}, avatarUrl: null});
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



export {model};