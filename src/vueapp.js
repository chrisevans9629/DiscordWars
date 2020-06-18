
Vue.use(VueToast, {
    position: 'top'
});

function toastInfo(msg){
    Vue.$toast.info(msg);
}
function toastError(msg){
    Vue.$toast.error(msg);
}

export { toastInfo, toastError };