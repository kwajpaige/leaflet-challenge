var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "<h3>" + feature.properties.mag + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // allow circle size increase
  function magnitude(depth) {
    return depth * 8000;
  }

  // set circle colors
  function color(depth) {
    if (depth < 1) {
      return "#88ff33" 
    }
    else if (depth < 2) {
      return "#fedb65"
    }
    else if (depth < 3) {
      return "#fec919"
    }
    else if (depth < 4) {
      return "#ff7733"
    }
    else if (depth < 5) {
      return "#ff3355"
    }
    else {
      return "#ff3333"
    }
  }

  // create circle layer
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: magnitude(earthquakeData.properties.mag),
        color: color(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Adding tile layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {"Light Map": lightmap,};
  // Create overlay object to hold our overlay layer
  var overlayMaps = {Earthquakes: earthquakes,};

  // Create our map of San Francisco, giving it the lighttmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [37.09, -122.42],
    zoom: 6,
    // layers: [outdoorsmap, earthquakes, faultLine]
    layers: [lightmap, earthquakes]
  });

  // Create a layer control; add it to the map
  // Pass in our baseMaps and overlayMaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Set up the legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];

// color function to be used when creating the legend
    function getColor(propMag) { 
          return propMag > 5  ? '#ff3355' :   
                 propMag > 4  ? '#ff7733' :
                 propMag > 3  ? '#fec919' :
                 propMag > 2  ? '#fedb65' :
                 propMag > 1  ? '#88ff33' : 
                                '#88ff33';
    }
        
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  // Add legend to map
  legend.addTo(myMap);
}