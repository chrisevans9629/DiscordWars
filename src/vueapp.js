import {model} from './vuemodel';


//import * as v from 'vue';

Vue.use(VueToast, {
    position: 'top'
});

var vm = new Vue(model);

function toastInfo(msg){
    Vue.$toast.info(msg);
}
function toastError(msg){
    Vue.$toast.error(msg);
}

export {vm, toastInfo, toastError };