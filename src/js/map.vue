<template>
  <div id="map"></div>
</template>

<style>
/* @import "~mapbox.js/theme/style.css"; */
#map {
  margin: 25px 0 0 0;
  width: 100%;
  height: 300px;
}
</style>

<script>
// require('mapbox.js');

export default {
  data: function () {
    return {
      msg: 'Hello world!'
    }
  },
  ready: function () {
    L.mapbox.accessToken = 'pk.eyJ1IjoidGhlYnJvdWhhaGEiLCJhIjoiZjY0ZmNhNjkzMmFjNWJiMDZlZjJmM2UxMmFiZWE3NjcifQ.R6qUW5dxSkEv-Lmnq4KU0Q';
    var map = L.mapbox.map('map', 'mapbox.streets')
                      .setView([49.006890, 8.403653], 6);

    var layer = L.mapbox.tileLayer('mapbox.streets');

    layer.on('ready', function() {
      var ka = new L.Marker(new L.LatLng(49.006890, 8.403653));
      map.addLayer(ka);

      var fr = new L.Marker(new L.LatLng(47.999008, 7.842104));
      map.addLayer(fr);
    });

    layer.on('error', function(err) {
      // Handle error
    });
  }
}
</script>
