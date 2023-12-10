mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [126.978433, 37.56669], // starting position [lng, lat]
  zoom: 10, // starting zoom
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  })
);

map.addControl(new mapboxgl.NavigationControl());

// new mapboxgl.Marker().setLngLat(127.4914411, 36.6358351).addTo(map);

map.on("click", (e) => {
  console.log("e", e);
  const coord = JSON.stringify(e.lngLat);
  const geometryData = JSON.parse(coord);
  console.log("lng", geometryData.lng);
  console.log("coord", coord);
  new mapboxgl.Marker()
    .setLngLat([geometryData.lng, geometryData.lat])
    .addTo(map);
  document.getElementById("geocoord").value = [
    geometryData.lng,
    geometryData.lat,
  ];
});

mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
);
map.addControl(
  new MapboxLanguage({
    defaultLanguage: "ko",
  })
);
