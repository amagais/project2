  // Creating map object
  var myMap = L.map("map", {
    center: [40.0522, -90.2437],
    zoom: 7
  });

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = "static/data/IL_new.geojson";

var geojson;


// Grab data with d3
d3.json(geoData, function(data) {
  console.log(data.features)

  // Create a new choropleth layer
  //population 2015 layer 
  var geojson2015 = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "lowaccess_pop_2015",

    // Set color scale
    scale: ["#cde1a9", "#10a565"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("County: " + feature.properties.County + "<br>");
    }

  }).addTo(myMap);

  //popluation 2010 layer
  var geojson2010 = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "lowaccess_pop_2010",

    // Set color scale
    scale: ["#cde1a9", "#10a565"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("County: " + feature.properties.County + "<br>");
    }
    
  }).addTo(myMap);

  //obesity layer 
  var geojsonobesity = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "Percent_1",

    // Set color scale
    scale: ["#f2f0a2", "#f58905"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup("County: " + feature.properties.County + "<br>");
    }

  }).addTo(myMap);

  //child layer 2010 
  var geojson_children_2010 = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "lowaccess_children_2010",

    // Set color scale
    scale: ["#f2c6ec", "#9c0688"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup("County: " + feature.properties.County + "<br>");
    }

  }).addTo(myMap);

  //child layer 2015
  var geojson_children_2015 = L.choropleth(data, {
    
    // Define what  property in the features to use
    valueProperty: "lowaccess_children_2015",

    // Set color scale
    scale: ["#f2c6ec", "#9c0688"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    onEachFeature: function(feature, layer) {
      layer.bindPopup("County: " + feature.properties.County + "<br>");
    }

  }).addTo(myMap);

 //senior layer 2010 
 var geojson_seniors_2010 = L.choropleth(data, {
    
  // Define what  property in the features to use
  valueProperty: "lowaccess_seniors_2010",

  // Set color scale
  scale: ["#e5e5ff", "#1717d8"],

  // Number of breaks in step range
  steps: 10,

  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },

  onEachFeature: function(feature, layer) {
    layer.bindPopup("County: " + feature.properties.County + "<br>");
  }

}).addTo(myMap);

// senior layer 2015
var geojson_seniors_2015 = L.choropleth(data, {
    
  // Define what  property in the features to use
  valueProperty: "lowaccess_seniors_2015",

  // Set color scale
  scale: ["#e5e5ff", "#1717d8"],
  

  // Number of breaks in step range
  steps: 10,

  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },

  onEachFeature: function(feature, layer) {
    layer.bindPopup("County: " + feature.properties.County + "<br>");
  }

}).addTo(myMap);

  var baseMaps = {
    Population_lowaccess_2015: geojson2015,
    Population_lowaccess_2010: geojson2010,
    Children_lowaccess_2015: geojson_children_2015,
    Children_lowaccess_2010: geojson_children_2010,
    Seniors_lowaccess_2015: geojson_seniors_2015,
    Seniors_lowaccess_2010: geojson_seniors_2010,
    Population_obesity_2015: geojsonobesity
    
  }


  
  //Add layers to map 
  L.control.layers(baseMaps).addTo(myMap);


  
  // Defining the legends 
  var obesityLegend = L.control({position: 'bottomright'});
  var population2010Legend = L.control({position: 'bottomright'});
  var population2015Legend = L.control({position: 'bottomright'});
  var children2010Legend = L.control({position: 'bottomright'});
  var children2015Legend = L.control({position: 'bottomright'});
  var seniors2010Legend = L.control({position: 'bottomright'});
  var seniors2015Legend = L.control({position: 'bottomright'});

  obesityLegend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojsonobesity.options.limits;
    var colors = geojsonobesity.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Population: Obesity(%) 2015</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;
  };



  population2010Legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson2010.options.limits;
    var colors = geojson2010.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Population: Low acess to store(%) 2010</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  population2015Legend.onAdd = function (myMap) {
    console.log("limits")
    
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson2015.options.limits;
    var colors = geojson2015.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Population: Low acess to store(%) 2015</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  children2010Legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson_children_2010.options.limits;
    var colors = geojson_children_2010.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Children: Low acess to store(%) 2010</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  children2015Legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson_children_2015.options.limits;
    var colors = geojson_children_2015.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Children: Low acess to store(%) 2010</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  seniors2010Legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson_seniors_2010.options.limits;
    var colors = geojson_seniors_2010.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Seniors: Low acess to store(%) 2010</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  seniors2015Legend.onAdd = function (myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson_seniors_2015.options.limits;
    var colors = geojson_seniors_2015.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Seniors: Low acess to store(%) 2010</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };


  //Add this one (only) for now, as the Population layer is on by default
  seniors2015Legend.addTo(myMap);

  myMap.on('baselayerchange', function(layer){
 
    if (layer.name === "Population_lowaccess_2010"){
      this.removeControl(obesityLegend);
      this.removeControl(population2015Legend);
      this.removeControl(children2015Legend);
      this.removeControl(children2010Legend);
      this.removeControl(seniors2015Legend);
      this.removeControl(seniors2010Legend);
      population2010Legend.addTo(this);
    } else if (layer.name === "Population_lowaccess_2015"){
      this.removeControl(obesityLegend);
      this.removeControl(population2010Legend);
      this.removeControl(children2015Legend);
      this.removeControl(children2010Legend);
      this.removeControl(seniors2015Legend);
      this.removeControl(seniors2010Legend);
      population2015Legend.addTo(this);
    } else if (layer.name === "Population_obesity_2015"){
      this.removeControl(population2010Legend)
      this.removeControl(population2015Legend)
      this.removeControl(children2015Legend);
      this.removeControl(children2010Legend);
      this.removeControl(seniors2015Legend);
      this.removeControl(seniors2010Legend);
      obesityLegend.addTo(this);
    } else if (layer.name === "Children_lowaccess_2010"){
      this.removeControl(obesityLegend);
      this.removeControl(population2015Legend);
      this.removeControl(population2010Legend);
      this.removeControl(children2015Legend);
      this.removeControl(seniors2015Legend);
      this.removeControl(seniors2010Legend);
      children2010Legend.addTo(this);
    } else if (layer.name === "Children_lowaccess_2015"){
      this.removeControl(obesityLegend);
      this.removeControl(population2015Legend);
      this.removeControl(population2010Legend);
      this.removeControl(children2010Legend);
      this.removeControl(seniors2015Legend);
      this.removeControl(seniors2010Legend);
      children2015Legend.addTo(this);
    } else if (layer.name === "Seniors_lowaccess_2015"){
      this.removeControl(obesityLegend);
      this.removeControl(population2015Legend);
      this.removeControl(population2010Legend);
      this.removeControl(children2010Legend);
      this.removeControl(children2015Legend);
      this.removeControl(seniors2010Legend);
      seniors2015Legend.addTo(this);
    } else if (layer.name === "Seniors_lowaccess_2010"){
      this.removeControl(obesityLegend);
      this.removeControl(population2015Legend);
      this.removeControl(population2010Legend);
      this.removeControl(children2010Legend);
      this.removeControl(children2015Legend);
      this.removeControl(seniors2015Legend);
      seniors2010Legend.addTo(this);
    }
    
  }); 


}, function(err) {
  console.log(err);
});


