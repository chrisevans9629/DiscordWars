import login from './bot';
const manager = require('./manager');
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
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
        manager.events.move(this.moveFrom,this.moveTo,this.amount);
      }
    }
  })

  export {app};