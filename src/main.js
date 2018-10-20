import Vue from 'vue';
import App from './App.vue';
// 载入bootstrap样式
// import BootstrapVue from 'bootstrap-vue';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';

// Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
