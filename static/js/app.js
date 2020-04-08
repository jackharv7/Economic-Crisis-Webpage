var svgWidth = 1100;
var svgHeight = 560;

var margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 30
};

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("class", "container");

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//add title
chartGroup.append("text")
    .attr("y", -10)
    .attr("x", width/2)
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .text("Unemployment Rate  ( 1929 - 2020 )");
//add labels to visual
function addText(value, color, text) {
    return chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", color)
        .attr("value", value)
        .classed("inactive", true)
        .text(text);
}

function deactivateLine(line) {
    return line
        .classed("deactivate", true)
        .classed("activate", false);
}
function activateLine(line) {
    return line
        .classed("activate", true)
        .classed("deactivate", false);
}
function activateLabel(label) {
    return label
      .classed("active", true)
      .classed("inactive", false);
  }
function deactivateLabel(label) {
    return label
        .classed("active", false)
        .classed("inactive", true);
  }

function make_toolTip(circlesGroup, chosenYAxis) {

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            if (chosenYAxis === "unemp") {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected Unemployment Rate: ${d.Unemployment_Rate}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Unemployment Rate: ${d.Unemployment_Rate}%`)
                }
                
            }
            else if (chosenYAxis === "gdp") {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected GDP: ${d.GDP_Growth}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> GDP Growth: ${d.GDP_Growth}%`)
                }
                
            }
            else {
                if (d.Year.getFullYear() === 2020) {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Expected Inflation Rate: ${d.Inflation}%`)
                }
                else {
                    return (`<strong>${new Date(d.Year).getFullYear()}</strong><br> Inflation Rate: ${d.Inflation}%`)
                }
                
            }
        
    });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data, index, selection) {
    toolTip.show(data, selection[index])
})
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });
    return toolTip;
}
var parseTime = d3.timeParse("%Y");

//read data from extracted data file
d3.json("static/data/Unemployment_Inflation.json").then(function(data, err) {
    if (err) throw err;
    // develope a table from json data
    function tabulate(data, columns) {
        data.forEach(function(d) {
            d['Unemployment Rate'] += "%";
            d['GDP Growth'] += "%";
            d.Inflation += "%";
        })
        var area = d3.select("body").append("div");
        var contain = area.append("div");
        contain.attr("class", "container");
        var table = contain.append("table");
        table.attr("class", "table table-hover table-striped");
        var thead = table.append('thead');
        var tbody = table.append('tbody');

        // append the header row
        thead.append('tr')
          .selectAll('th')
          .data(columns).enter()
          .append('th')
          .style("text-align", "center")
          .text(function (column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return columns.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
          .text(function (d) { return d.value; });

      return table;
  }
  tabulate(data, ['Year', 'Unemployment Rate', 'GDP Growth', "Inflation"]);
});
//develop graph for values
d3.json("static/data/Unemployment_Inflation.json").then(function(data, err) {
    if (err) throw err;
    // parse data
    data.forEach(function(d) {
      d['Unemployment Rate'] = +d['Unemployment Rate'];
      d['GDP Growth'] = +d['GDP Growth'];
      d.Inflation = +d.Inflation;
      d.Year = parseTime(d.Year);
    });
    //add line to graph
    function addLine(line, color) {
        return chartGroup.append("path")
            .data([data])
            .attr("d", line)
            .classed(color, true);
    }
    //identify time scale
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);
// identify min and max values for y scale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d['GDP Growth']), d3.max(data, d => d['Unemployment Rate'])])
        .range([height, 0]);
//add cirlces for tool-tip at each date
    function makeCirlces(chosenXAxis, color) {
        return chartGroup.selectAll()
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xTimeScale(d.Year))
            .attr("cy", d => yLinearScale(d[chosenXAxis]))
            .attr("r", 3)
            .attr("fill", color);
    }
//draw line depending on x axis value
    function makeLine(chosenXAxis) {
        return d3.line()
            .x(d => xTimeScale(d.Year))
            .y(d => yLinearScale(d[chosenXAxis]));
    }
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));

    var leftAxis = d3.axisLeft(yLinearScale);
    var rightAxis = d3.axisRight(yLinearScale);

    function make_x_gridlines() {		
        return d3.axisBottom(xTimeScale)
            .ticks(10)
    }
    
    // gridlines in y axis function
    function make_y_gridlines() {		
        return d3.axisLeft(yLinearScale)
            .ticks(10)
    }
    chartGroup.append("g").attr("transform",`translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(bottomAxis);
    // add y-axis (left)
    chartGroup.append("g").call(leftAxis);
    chartGroup.append("g").attr("transform", `translate(${width}, 0)`).call(rightAxis);


    //draw lines for each value
    var unemp_line = addLine(makeLine('Center'), "line white");

    var unemp_line = addLine(makeLine('Unemployment Rate'), "line limegreen");

    var gdp_line = addLine(makeLine('GDP Growth'), "line orange");
        
    var inflation_line = addLine(makeLine('Inflation'), "line red");

    var unemp_circlesGroup = makeCirlces('Unemployment Rate', "green");

    var gdp_circlesGroup = makeCirlces('GDP Growth', "orange");

    var inflation_circlesGroup = makeCirlces('Inflation', "red");
//add tool-tip
    make_toolTip(gdp_circlesGroup, "gdp");
    make_toolTip(unemp_circlesGroup, "unemp");
    make_toolTip(inflation_circlesGroup, "inflation");
    
    chartGroup.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        );
  
    // add the Y gridlines
    chartGroup.append("g")			
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        );

        //add label to graph
    var unempLabel = addText('unemp', 'limegreen',"Unemployment Rate in the US (%)")
        .attr("y", 465)
        .attr("x", 230);

    var gdpLabel = addText('gdp', 'orange',"GDP Growth Per Year (%)")
        .attr("y", 465)
        .attr("x", 470);

    var inflationLabel = addText('inflation', 'red',"Inflation Per Year (%)")
        .attr("y", 465)
        .attr("x", 650);

    var allLabel = addText('all', 'white',"All Data")
        .attr("y", -10)
        .attr("x", 20);

    var inflationVgdp = addText('inflationVgdp', 'white',"Inflation vs GDP (%)")
        .attr("y", 465)
        .attr("x", 820);

//activate or deactivate value depending on whether or not it is chosen
    chartGroup.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            var isActive = d3.select(this).classed("active");
            if (isActive) {
                return;
            }
            else if (value === "gdp") {
                activateLabel(gdpLabel);
                activateLine(gdp_line);
                activateLine(gdp_circlesGroup);
                deactivateLabel(inflationLabel);
                deactivateLine(inflation_line);
                deactivateLine(inflation_circlesGroup);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
                deactivateLabel(allLabel);
                
            }
            else if (value === "inflation") {
                activateLabel(inflationLabel);
                activateLine(inflation_line);
                activateLine(inflation_circlesGroup);
                deactivateLine(gdp_line);
                deactivateLabel(gdpLabel);
                deactivateLabel(unempLabel);
                deactivateLabel(inflationVgdp);
                deactivateLine(gdp_circlesGroup);
                deactivateLabel(allLabel);
            }
            else if (value === "inflationVgdp") {
                activateLabel(inflationVgdp);
                activateLine(gdp_line);
                activateLine(inflation_line);
                activateLine(gdp_circlesGroup);
                activateLine(inflation_circlesGroup);
                deactivateLine(unemp_line);
                deactivateLabel(unempLabel);
                deactivateLine(unemp_circlesGroup);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
                deactivateLabel(allLabel);
            }
            else if (value === "unemp") {
                deactivateLabel(inflationLabel);
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationVgdp);
                activateLabel(unempLabel);
                activateLine(unemp_line);
                activateLine(unemp_circlesGroup);
                deactivateLine(inflation_line);
                deactivateLine(inflation_circlesGroup);
                deactivateLine(gdp_line);
                deactivateLine(gdp_circlesGroup);
                deactivateLabel(allLabel);
            }
            else {
                deactivateLabel(gdpLabel);
                deactivateLabel(inflationLabel);
                deactivateLabel(unempLabel);
                activateLine(unemp_line);
                activateLine(unemp_circlesGroup);
                activateLine(gdp_line);
                deactivateLabel(inflationVgdp);
                activateLine(inflation_circlesGroup);
                activateLine(inflation_line);
                activateLine(gdp_circlesGroup);
                activateLabel(allLabel);
            }
        })
    }).catch(function(error) {
      console.log(error);
});
