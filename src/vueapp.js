import login from './bot';

import { move } from './game';
//import * as v from 'vue';

 var vm = new Vue({
     el: '#app',
     data: {
         token: null,
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
      }
     }
   });

  export {vm};