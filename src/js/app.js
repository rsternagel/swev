require('css!../css/main.css');

var Vue = require('vue')
var VueResource = require('vue-resource')

var Map = require('./map.vue')
var City = require('./city.vue')

Vue.config.debug = true

Vue.use(VueResource)

new Vue({
  el: 'body',
  components: {
    map: Map,
    city: City
  }
})
