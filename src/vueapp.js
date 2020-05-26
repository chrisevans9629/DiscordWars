import {model} from './vuemodel';


//import * as v from 'vue';

Vue.use(VueToast, {
    position: 'top'
});

var vm = new Vue(model);

function toastInfo(msg){
    Vue.$toast.info(msg);
}

export {vm, toastInfo };