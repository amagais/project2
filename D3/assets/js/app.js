// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  // This should be where the data is coming in from the flask?
  var chosenXAxis = "lowaccess_pop_2015";
  var chosenYAxis = "Adult_diabetes_2013";
  
  // Retrieve data from the CSV file and execute everything below
  // How do I retrieve the data from within my DB?
  d3.csv("./assets/data/data.csv").then(function(data,err){
  //insert line 36 if connecting flask to local db******
  // d3.json("http://127.0.0.1:5002/api").then(function(data, err) {
    if (err) throw err;
  
    plotFoodInsecurityAxes(data);
    //plotFoodInsecurityMap(data);

    
  }).catch(function(error) {
    console.log(error);
    });
