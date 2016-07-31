import '../../../styles/main.scss';

import Vue from 'vue';
import IndexView from './index.vue';

Vue.config.debug = true;
var VueAsyncData = require('vue-async-data');
var VueResource = require('vue-resource');
var VueTouch = require('vue-touch');
import fastclick from 'fastclick';
fastclick.attach(document.body);

Vue.use(VueResource);
Vue.use(VueAsyncData);
Vue.use(VueTouch);


new Vue({
  el: '#app',
  components: {
      'index-view': IndexView
  }
});

// 判断页面加载完毕 也可以写入动画效果
window.onload = function() {
  document.getElementById('app').style.display = 'block';
};
