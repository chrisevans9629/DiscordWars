import login from './bot';

import { move, retreat, upgrade } from './game';

let model = {
    el: '#app',
    data: {
        token: '',
        moveFrom: 0,
        moveTo: 1,
        amount: 10,
    },
    methods: {
     tokenLogin: function(){
       login(this.token);
       this.token = null;
     },
     move: function(){
       move(this.moveFrom,this.moveTo,this.amount);
     },
     retreat: function(){
       retreat(this.moveTo);
     },
     upgrade: function() {
        upgrade(this.moveTo);
     }
    }
  }

  export {model};