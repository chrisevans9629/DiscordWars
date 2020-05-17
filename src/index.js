import login from './bot';


var app = new Vue({
  el: '#app',
  data: {
      message: 'Hello Vue!',
      token: null,
  },
  methods: {
    tokenLogin: function(){
      login(this.token);
      this.token = null;
    }
  }
})




