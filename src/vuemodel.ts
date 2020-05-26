import login from './bot';

import { move, retreat, upgrade, reset } from './game';
import { debug } from 'webpack';

export interface Player {
  name: string;
  team: number;
}

interface Chat {
  name: string;
  message: string;
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
       alert('Ready!');
     },
     move: function(){
       move(this.moveFrom,this.moveTo,this.amount, { name: '', team: this.selectedTeam});
     },
     retreat: function(){
       retreat(this.moveTo, { name: '', team: this.selectedTeam });
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