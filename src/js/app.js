require('css!../css/main.css');

var Vue = require('vue')

var Map = require('./map.vue')
var City = require('./city.vue')

Vue.config.debug = true

new Vue({
  el: 'body',
  components: {
    map: Map,
    city: City
  }
})
