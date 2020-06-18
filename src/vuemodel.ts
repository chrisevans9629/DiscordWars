import login from './bot';

import { toastInfo, toastError } from './vueapp';

let model = {
    el: '#app',
    data: {
    },
    mounted: function(){
    },
    methods: {
      tokenLogin: async function(token: string){
        try {
          let t = await login(token);
          this.token = null;
          toastInfo('ready!');
          sessionStorage.setItem('magic',t);
          this.showToken = false;
          //console.log(this.showToken);
          return true;
        } catch (error) {
          console.log(error);
          toastError(error);
          return false;
        }
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