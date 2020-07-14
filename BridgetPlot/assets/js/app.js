// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
  right: 40,
  bottom: 240,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial parameter
var chosenYAxis = "Percent_Pop_WIC_Participants_2009";

// Function to update y-scale variable upon click
function yScale(foodData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(foodData, d => d[chosenYAxis]) * 0.8,
          d3.max(foodData, d => d[chosenYAxis]) * 1.2
      ])
      .range([chartHeight, 0]);
  return yLinearScale;
}

// Function to update yAxis variable upon click
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  return yAxis;
}

// Function used for updating bars with a transition to new bars
function renderBars(barsGroup, newYScale, chosenYAxis) {
    barsGroup.transition()
        .duration(1000)
        .attr("height", d => chartHeight - newYScale(d[chosenYAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return barsGroup;
}

// Function to update bars with new tooltip
function updateToolTip(chosenYAxis, barsGroup) {
    var label;

    if (chosenYAxis === "Percent_Pop_WIC_Participants_2009") {
        label = "% of Pop WIC Participants 2009";
    }
    else if (chosenYAxis === "Percent_Pop_WIC_Participants_2015") {
      label = "% of Pop WIC Participants 2015";
    }
    else if (chosenYAxis === "Percent_Pop_National_School_Lunch_Program_Participants_2009") {
        label = "% of Pop School Lunch Program Participants 2009";
    }
    else if (chosenYAxis === "Percent_Pop_National_School_Lunch_Program_Participants_2015") {
      label = "% of Pop School Lunch Program Participants 2015";
    }
    else if (chosenYAxis === "Percent_Pop_School_Breakfast_Program_Participants_2009") {
        label = "% of Pop School Breakfast Program Participants 2009";
    }
    else if (chosenYAxis === "Percent_Pop_School_Breakfast_Program_Participants_2015") {
      label = "% of Pop School Breakfast Program Participants 2015";
    }
    else if (chosenYAxis === "Percent_Pop_Summer_Food_Participants_2009") {
        label = "% of Pop Summer Food Participants 2009";
    }
    else if (chosenYAxis === "Percent_Pop_Summer_Food_Participants_2015") {
      label = "% of Pop Summer Food Participants 2015";
    }
    else if (chosenYAxis === "Percent_Pop_Child_and_Adult_Care_Participants_2009") {
        label = "% of Pop Child & Adult Care Participants 2009"
    }
    else {
      label = "% of Pop Child & Adult Care Participants 2015"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([120, -60])
        .html(function(d) {
            return (`${d.State}<br>${label}: ${d[chosenYAxis]}`);
        });

    barsGroup.call(toolTip);

    barsGroup
        .on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });
    return barsGroup;
}

// Load data
d3.csv("assets/data/food_environment_data3.csv").then(function(foodData) {

  console.log(foodData);

  // Cast the value to a number for each piece of foodData
  foodData.forEach(function(d) {  
    d.Percent_Pop_WIC_Participants_2009 = +d.Percent_Pop_WIC_Participants_2009;
    d.Percent_Pop_WIC_Participants_2015 = +d.Percent_Pop_WIC_Participants_2015;
    d.Percent_Pop_National_School_Lunch_Program_Participants_2009 = +d.Percent_Pop_National_School_Lunch_Program_Participants_2009;
    d.Percent_Pop_National_School_Lunch_Program_Participants_2015 = +d.Percent_Pop_National_School_Lunch_Program_Participants_2015;
    d.Percent_Pop_School_Breakfast_Program_Participants_2009 = +d.Percent_Pop_School_Breakfast_Program_Participants_2009;
    d.Percent_Pop_School_Breakfast_Program_Participants_2015 = +d.Percent_Pop_School_Breakfast_Program_Participants_2015;
    d.Percent_Pop_Summer_Food_Participants_2009 = +d.Percent_Pop_Summer_Food_Participants_2009;
    d.Percent_Pop_Summer_Food_Participants_2015 = +d.Percent_Pop_Summer_Food_Participants_2015;
    d.Percent_Pop_Child_and_Adult_Care_Participants_2009 = +d.Percent_Pop_Child_and_Adult_Care_Participants_2009;
    d.Percent_Pop_Child_and_Adult_Care_Participants_2015 = +d.Percent_Pop_Child_and_Adult_Care_Participants_2015;
  });

  // Configure a band scale for the horizontal axis with a padding of 0.7
  var xBandScale = d3.scaleBand()
    .domain(foodData.map(d => d.State))
    .range([0, chartWidth])
    .padding(0.75);

  // Create a linear scale for the vertical axis.
  // var yLinearScale = yScale(foodData, chosenYAxis);
  
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(foodData, d => d[chosenYAxis])])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(15);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  var barsGroup = chartGroup.selectAll(".bar")
    .data(foodData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.State))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d[chosenYAxis]));

  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  var wicLabel09 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "Percent_Pop_WIC_Participants_2009")
    .classed("active", true)
    .text("2009 WIC Participants");

  var wicLabel15 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "Percent_Pop_WIC_Participants_2015")
    .classed("inactive", true)
    .text("2015 WIC Participants");

  var lunchLabel09 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "Percent_Pop_National_School_Lunch_Program_Participants_2009")
    .classed("inactive", true)
    .text("2009 National School Lunch Program Participants");

  var lunchLabel15 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 100)
    .attr("value", "Percent_Pop_National_School_Lunch_Program_Participants_2015")
    .classed("inactive", true)
    .text("2015 National School Lunch Program Participants");

  var breakfastLabel09 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 120)
    .attr("value", "Percent_Pop_School_Breakfast_Program_Participants_2009")
    .classed("inactive", true)
    .text("2009 School Breakfast Program Participants");

  var breakfastLabel15 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 140)
    .attr("value", "Percent_Pop_School_Breakfast_Program_Participants_2015")
    .classed("inactive", true)
    .text("2015 School Breakfast Program Participants");

  var summerLabel09 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 160)
    .attr("value", "Percent_Pop_Summer_Food_Participants_2009")
    .classed("inactive", true)
    .text("2009 Summer Food Program Participants");

  var summerLabel15 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 180)
    .attr("value", "Percent_Pop_Summer_Food_Participants_2015")
    .classed("inactive", true)
    .text("2015 Summer Food Program Participants");

  var careLabel09 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 200)
    .attr("value", "Percent_Pop_Child_and_Adult_Care_Participants_2009")
    .classed("inactive", true)
    .text("2009 Child & Adult Care Participants");

  var careLabel15 = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 220)
    .attr("value", "Percent_Pop_Child_and_Adult_Care_Participants_2015")
    .classed("inactive", true)
    .text("2015 Child & Adult Care Participants");
  
  // chartGroup.append("g")
  //   .call(leftAxis);

  // chartGroup.append("g")
  //   .attr("transform", `translate(0, ${chartHeight})`)
  //   .call(bottomAxis);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left)
    .attr("x", 0 - (chartHeight/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Percentage of State Population");

  var barsGroup = updateToolTip(chosenYAxis, barsGroup);

  labelsGroup.selectAll("text")
    .on("click", function() {
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

          chosenYAxis = value;
          yLinearScale = yScale(foodData, chosenYAxis);
          yAxis = renderYAxes(yLinearScale, yAxis);
 
          barsGroup = renderBars(barsGroup, yLinearScale, chosenYAxis);
          barsGroup = updateToolTip(chosenYAxis, barsGroup);

          if (chosenYAxis === "Percent_Pop_WIC_Participants_2009") {
            wicLabel09
              .classed("active", true)
              .classed("inactive", false);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_WIC_Participants_2015") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", true)
              .classed("inactive", false);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_National_School_Lunch_Program_Participants_2009") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", true)
              .classed("inactive", false);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_National_School_Lunch_Program_Participants_2015") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", true)
              .classed("inactive", false);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_School_Breakfast_Program_Participants_2009") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", true)
              .classed("inactive", false);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_School_Breakfast_Program_Participants_2015") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", true)
              .classed("inactive", false);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_Summer_Food_Participants_2009") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", true)
              .classed("inactive", false);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_Summer_Food_Participants_2015") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", true)
              .classed("inactive", false);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenYAxis === "Percent_Pop_Child_and_Adult_Care_Participants_2009") {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", true)
              .classed("inactive", false);
            careLabel15
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            wicLabel09
              .classed("active", false)
              .classed("inactive", true);
            wicLabel15
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel09
              .classed("active", false)
              .classed("inactive", true);
            lunchLabel15
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel09
              .classed("active", false)
              .classed("inactive", true);
            breakfastLabel15
              .classed("active", false)
              .classed("inactive", true);            
            summerLabel09
              .classed("active", false)
              .classed("inactive", true);
            summerLabel15
              .classed("active", false)
              .classed("inactive", true);
            careLabel09
              .classed("active", false)
              .classed("inactive", true);
            careLabel15
              .classed("active", true)
              .classed("inactive", false);
          }
        }

  });




}).catch(function(error) {
  console.log(error);
});





