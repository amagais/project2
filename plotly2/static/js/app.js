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



function buildchart(){
  var accessArray = []
  var dictArray = []
  var sortedaccessArray = []
  var sortedStateArray = []

  d3.csv(csv).then((data) => {

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
    var ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: { 
            labels: sortedStateArray,
            datasets: [{
                label: 'Access to stores',
                data: sortedaccessArray,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    
});

};



var csv = "./data/food_environment_data3.csv";

init();
