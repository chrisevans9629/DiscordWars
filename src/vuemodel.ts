import login from './bot';

import { move, retreat, upgrade, reset, getColor } from './game';
import { debug } from 'webpack';
import { toastInfo } from './vueapp';
export interface Player {
  name: string;
  team: number;
  style: object;
}

export interface Chat {
  name: string;
  message: string;
  player: Player;
}

let chat: Chat[] = [];
let players: Player[] = [];

let model = {
    el: '#app',
    data: {
        token: '',
        moveFrom: 0,
        moveTo: 1,
        amount: 100,
        gameOver: false,
        title: 'test',
        isDebugging: false,
        teams: [1,2],
        selectedTeam: 0,
        players: players,
        selectedPlayer: '',
        chat: chat,
        fps: 0,
    },
    delimiters: ['((','))'],
    methods: {
     tokenLogin: function(){
       login(this.token);
       this.token = null;
       toastInfo('ready!');
     },
     move: function(){
       move(this.moveFrom,this.moveTo,this.amount, { name: '', team: this.selectedTeam, style: {color: getColor(this.selectedTeam)}});
     },
     retreat: function(){
       retreat(this.moveTo, { name: '', team: this.selectedTeam, style: {color: getColor(this.selectedTeam)}});
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
     join: function(){

     },
    }
  }

  export {model};