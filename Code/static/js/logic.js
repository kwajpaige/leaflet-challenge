// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

console.log(data.features) 

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData) 
    onEachFeature: onEachFeature;

}


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});



  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

 

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapID", {
    center: [
      37.09, -122.42
    ],
    zoom: 3,
    layers: [streetmap]
  });

// Loop through the cities array and create one marker for each city object
// for (var i = 0; i < data.features.length; i++) {

//     // Conditionals for countries points
//     var color = "";
//     if (countries[i].points > 200) {
//       color = "yellow";
//     }
//     else if (countries[i].points > 100) {
//       color = "blue";
//     }
//     else if (countries[i].points > 90) {
//       color = "green";
//     }
//     else {
//       color = "red";
//     }
  
//     // Add circles to map
//     L.circle(countries[i].location, {
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: color,
//       // Adjust radius
//       radius: countries[i].points * 1500
//     }).bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>").addTo(myMap);
//   }
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, {
    collapsed: false
  }).addTo(myMap);

})