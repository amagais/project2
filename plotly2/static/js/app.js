var stateArray = []
// Initializes the page with a default plot
function init() {

  //Assign a reference to the drop down select 
  var selector = d3.select("#selDataset");
  
  //Assign a reference to the drop down select 
  var selector = d3.select("#selDataset");
  
  //use the list of samples to populate the options
  
  stateArray = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"]
  console.log(stateArray)
  id = stateArray.forEach(function(stateArray) {
    selector
      .append("option")
      .text(stateArray)
      .property("value");
  });
  buildMetadata("AL");
  buildchart();
  buildbubble();
  buildbubble2();
  
};

function buildMetadata(sampleID){
  found = false;
  d3.csv(csv).then((data) => {
    data.forEach(function(d){
      if (d.State == sampleID){
        pop = d.Population_Low_Access_to_Stores_2015
        income = d["Low_Income_&_Low_Access_to_Stores_2015"]
        fastfood = d["Fast-food_Restaurants_2014"]
        grocery = d.Grocery_Stores_2014
        snapstore = d.SNAP_Authorized_Stores_2016

        var demoPanel = d3.select("#sample-metadata");
        demoPanel.html("");
        demoPanel.append("p").text("Low Access to Stores: " + pop);
        demoPanel.append("p").text("Low Income and Low Access to Stores: " + pop);
        demoPanel.append("p").text("Number of Fast Food Restaurants: " + fastfood);
        demoPanel.append("p").text("Number of Grocery Stores: " + grocery);
        demoPanel.append("p").text("Number of SNAP-authorized Stores: " + snapstore);
        found = true
      }
    
    });
  });
};

function optionChanged(sampleID){
  buildMetadata(sampleID);
  //buildchart(sampleID);
  //buildbubble(sampleID);
}

var accessArray = []
var dictArray = []
var sortedaccessArray = []
var sortedStateArray = []
var snapArray = []
var fastfoodArray = []
var accessCountArray = []

function buildchart(){
 
  d3.csv(csv).then((data) => {
    
    
    data.forEach(function(d){
      var access_data = d["Percent_Pop_Low_Access_to_Stores_2015"]
      accessArray.push(access_data)
    })

    for (var i = 0; i < stateArray.length; i++){
      var access_data = data[i]["Percent_Pop_Low_Access_to_Stores_2015"]
      accessArray.push(access_data)

      var curState = stateArray[i]
      var dict = {"state": curState, "low_access": access_data}
      dictArray.push(dict)
    }


    sortedaccessArray = accessArray.sort(function(a,b){return a-b});
    sortedaccessArray.forEach(function(a){
      found = false;
      for (var i = 0; i< dictArray.length; i++){
        if (dictArray[i].low_access === a)
          sortedStateArray.push(dictArray[i].state)
          found = true;
      }
    
    })

    //create trace
    var trace = {
      x: sortedaccessArray,
      y: sortedStateArray,
      text: sortedStateArray,
      type: "bar",
      orientation: "h",
    }
    //create data variable 
    var data = [trace]

    //create layout
    var layout = {
      margine:{
        l: 100,
        r: 100,
        t: 100, 
        b: 100
      }
    };

    Plotly.newPlot("barchart",data, layout);
  });
};
//Create the bubble chart, looking at the number of SNAP authorized stores in resepct to low food insecuirty population
//The bigger the bubble, the more SNAP authorized stores 
function buildbubble(){
  d3.csv(csv).then((data) => {

    data.forEach(function(d){
      var access_count = d["Population_Low_Access_to_Stores_2015"]
      accessCountArray.push(access_count)
    })
    
    for (var i = 0; i < data.length; i++){
      var SNAP_store_2016 = data[i].SNAP_Authorized_Stores_2016
      snapArray.push(SNAP_store_2016)
      
    }  
   
  

    var snapResizedArray = []
    snapArray.forEach(function(snap){
      newSize = snap/250
      snapResizedArray.push(newSize)
    })

     var bubbleTrace = {
       x: snapArray,
       y: accessCountArray,
       mode : "markers",
       marker: {
        size: snapResizedArray,
        color: "purple",
      },
      text: stateArray
     };

     var data = [bubbleTrace];

     var layout = {
       showlegend: false,
       height:600,
       width: 600,
     };
    Plotly.newPlot("bubblechart",data,layout);
    
  })
}

//fast food restaurants in respect to low access population
//the bigger the bubbles, the more fast food restaurants in the state
function buildbubble2(){
  d3.csv(csv).then((data) => {
    for (var i = 0; i < data.length; i++){
      fastfoodStore = data[i]["Fast-food_Restaurants_2014"]
      fastfoodArray.push(fastfoodStore)
      
    }  
    

    var fastfoodResizedArray = []
    fastfoodArray.forEach(function(f){
      newSize2 = f/250
      fastfoodResizedArray.push(newSize2)
    })

     var bubbleTrace2 = {
       x: fastfoodArray,
       y: accessCountArray,
       mode : "markers",
       marker: {
        size: fastfoodResizedArray,
        color: "yellow",
      },
      text: stateArray
     };

     var data = [bubbleTrace2];

     var layout = {
       showlegend: false,
       height:600,
       width: 600,
     };
    Plotly.newPlot("bubblechart2",data,layout);
    
  })
}



var csv = "./data/food_environment_data3.csv";

init();
