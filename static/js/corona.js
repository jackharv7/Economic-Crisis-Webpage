var svgWidth = 1100;
var svgHeight = 560;

var margin = {
  top: 40,
  right: 30,
  bottom: 120,
  left: 50
};

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#stock")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

const STOCKS = {
    'zoom': { 'value': 'zoom', 'display': 'Zoom', 'color': 'limegreen' },
    'cisco': { 'value': 'cisco', 'display': 'Cisco', 'color': 'limegreen' },
    'amazon': { 'value': 'amazon', 'display': 'Amazon', 'color': 'limegreen' },
    'boeing': { 'value': 'boeing', 'display': 'Boeing', 'color': 'red' },
    'lockheed': { 'value': 'lockheed', 'display': 'Lockheed', 'color': 'red' },
    'royalcruise': { 'value': 'royalcruise', 'display': 'RoyalCruise', 'color': 'white' },
    'marriott': { 'value': 'marriott', 'display': 'Marriott', 'color': 'white' },
    'amc': { 'value': 'amc', 'display': 'AMC', 'color': 'white' },
    'jnj': { 'value': 'jnj', 'display': 'JNJ', 'color': 'pink' },
    'roche': { 'value': 'roche', 'display': 'Roche', 'color': 'pink' },
    'moderna': { 'value': 'moderna', 'display': 'Moderna', 'color': 'yellow' },
    'gild': { 'value': 'gild', 'display': 'GILD', 'color': 'yellow' },
    'inovio': { 'value': 'inovio', 'display': 'Inovio', 'color': 'yellow' },
    'gspc': { 'value': 'gspc', 'display': 'GSPC', 'color': 'black' },
    'nasdaq': { 'value': 'nasdaq', 'display': 'Nasdaq', 'color': 'black' },
    'jpm': { 'value': 'jpm', 'display': 'JPM', 'color': 'coral' },
    'gs': { 'value': 'gs', 'display': 'GS', 'color': 'coral' },
    'ford': { 'value': 'ford', 'display': 'FORD', 'color': 'turquoise' },
    'gm': { 'value': 'gm', 'display': 'GM', 'color': 'turquoise' },
    'tesla': { 'value': 'tesla', 'display': 'Tesla', 'color': 'turquoise' },
    'chevron': { 'value': 'chevron', 'display': 'Chevron', 'color': 'magenta' },
    'exxon': { 'value': 'exxon', 'display': 'Exxon', 'color': 'magenta' },
    'chevron': { 'value': 'chevron', 'display': 'Chevron', 'color': 'magenta' },
    'nike': { 'value': 'nike', 'display': 'Nike', 'color': 'silver' },
    'adidas': { 'value': 'adidas', 'display': 'Adidas', 'color': 'silver' },
    'gap': { 'value': 'gap', 'display': 'Gap', 'color': 'lightblue' },
    'macy': { 'value': 'macy', 'display': "Macy", 'color': 'lightblue' }
};

var activeStocks = ['gspc', 'zoom', 'royalcruise', 'inovio'];
var masterData = [];

function generateActiveData(data, stocks, activeStocks) {
    return data.map(function(record) {
        var newRecord = {};
        Object.keys(record).forEach(function(key) {
            // console.log(key, key.split("_")[0].toLowerCase(), activeStocks);
            var stockRef = key.split(" ")[0].toLowerCase();
            if (key === "Date" || activeStocks.indexOf(stockRef) !== -1 || key === 'Center') {
                newRecord[key] = record[key];
            }
        })
        return newRecord;
    })
}

chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -55)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .text("Change in Price (%)");

function addStock(value, color, text) {
    return chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", color)
        .attr("value", value)
        .classed("inactive", true)
        .text(text);
}
function addStockMark(value, color, text) {
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

function make_toolTip(circleGroup, chosenvalue) {

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return (`<strong>${formatTime(d.Date)}</strong><br>${chosenvalue}<br><strong>$${formatNum(d[chosenvalue])}</strong>`)
    });
    circleGroup.call(toolTip);
    circleGroup.on("mouseover", function(data, index, selection) {

    toolTip.show(data, selection[index])

})
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });
    return toolTip;
}

var formatTime = d3.timeFormat("%b %d");
var formatNum = d3.format(",.2f");

function valuesByTypeInRecord(record, type) {
    return Object.keys(record).reduce(function(acc, key) {
        if (key.toLowerCase().endsWith(type)) acc.push(record[key])
        return acc;
    },[])
}

function createLabels() {
    addStock('reset', 'white', 'Clear')
        .attr("x", width/2)
        .attr("y", 510);
    return {
        zoom: addStock('zoom', 'limegreen', 'Zoom')
            .attr("x", width/2.35)
            .attr("y", 470),
        cisco: addStock('cisco', 'limegreen', 'Cisco')
            .attr("x", width/2.35)
            .attr("y", 490),
        amazon: addStock('amazon', 'limegreen', 'Amazon')
            .attr("x", width/2.35)
            .attr("y", 510),
        tech: addStock('tech', 'white', 'Tech')
            .attr("x", width/2.35)
            .attr("y", 440),
        boeing: addStock('boeing', 'red', 'Boeing')
            .attr("x", width/2.9)
            .attr("y", 470),
        lockheed: addStock('lockheed', 'red', 'Lockheed')
            .attr("x", width/2.9)
            .attr("y", 490),
        royalcruise: addStock('royalcruise', 'white', 'Royal Cruise')
            .attr("x", width/3.8)
            .attr("y", 470),
        marriott: addStock('marriott', 'white', 'Marriott')
            .attr("x", width/3.8)
            .attr("y", 490),
        amc: addStock('amc', 'white', 'AMC')
            .attr("x", width/3.8)
            .attr("y", 510),
        travel: addStock('travel', 'white', 'Entertainment/Travel')
            .attr("x", width/3.4)
            .attr("y", 440),
        jnj: addStock('jnj', 'pink', 'Johnson & Johnson')
            .attr("x", width/16)
            .attr("y", 470),
        roche: addStock('roche', 'pink', 'Roche')
            .attr("x", width/16)
            .attr("y", 490),
        gild: addStock('gild', 'yellow', 'GILD')
            .attr("x", width/6)
            .attr("y", 490),
        pharma: addStock('pharma', 'white', 'Pharmaceutical/Biotech')
            .attr("x", width/10)
            .attr("y", 440),
        moderna: addStock('moderna', 'yellow', 'Moderna')
            .attr("x", width/6)
            .attr("y", 470),
        inovio: addStock('inovio', 'yellow', 'Inovio')
            .attr("x", width/6)
            .attr("y", 510),
        jpm: addStock('jpm', 'coral', 'JP Morgan')
            .attr("x", width/1.66)
            .attr("y", 470),
        finance: addStock('finance', 'white', 'Finance')
            .attr("x", width/1.66)
            .attr("y", 440),
        automotive: addStock('auto', 'white', "Automotive")
            .attr("x", width/1.3)
            .attr("y", 440),
        gs: addStock('gs', 'coral', 'Goldman Sachs')
            .attr("x", width/1.66)
            .attr("y", 490),
        ford: addStock('ford', 'turquoise', 'Ford')
            .attr("x", width/1.38)
            .attr("y", 470),
        gm: addStock('gm', 'turquoise', 'General Motors')
            .attr("x", width/1.38)
            .attr("y", 490),
        tesla: addStock('tesla', 'turquoise', 'Tesla')
            .attr("x", width/1.38)
            .attr("y", 510),
        chevron: addStock('chevron', 'magenta', 'Chevron')
            .attr("x", width/1.23)
            .attr("y", 470),
        exxon: addStock('exxon', 'magenta', 'Exxon')
            .attr("x", width/1.23)
            .attr("y", 490),
        apparel: addStock('apparel', 'white', 'Apparel')
            .attr("x", width/1.09)
            .attr("y", 440),
        nike: addStock('nike', 'silver', 'Nike')
            .attr("x", width/1.13)
            .attr("y", 470),
        adidas: addStock('adidas', 'silver', 'Adidas')
            .attr("x", width/1.13)
            .attr("y", 490),
        gap: addStock('gap', 'lightblue', 'Gap')
            .attr("x", width/1.05)
            .attr("y", 470),
        macy: addStock('macy', 'lightblue', "Macy's")
            .attr("x", width/1.05)
            .attr("y", 490),
        nasdaq: addStockMark('nasdaq', 'black', 'Nasdaq')
            .attr("x", width/2)
            .attr("y", 480),
        gspc: addStockMark('gspc', 'black', 'S&P 500')
            .classed("active", true)
            .classed("inactive", false)
            .attr("x", width/2)
            .attr("y", 460)
    };
}

var xTimeScale = d3.scaleTime();
var yLinearScale = d3.scaleLinear();
var bottomAxis = d3.axisTop(xTimeScale).tickFormat(d3.timeFormat("%b-%d"));
var leftAxis = d3.axisLeft(yLinearScale);
var rightAxis = d3.axisRight(yLinearScale);
var labelsMap = createLabels();

function reset() {

    chartGroup.selectAll("path").remove();
    chartGroup.selectAll("circle").remove();
    deactivateLabel(chartGroup.selectAll("text.active"));

}

chartGroup.selectAll("text")
    .on("click", function() {
        var value = d3.select(this).attr("value");
        var isActive = d3.select(this).classed("active");
        if (value === 'reset') {
            reset();
            activeStocks = ['gspc'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (isActive) {
            reset();
            deactivateLabel(labelsMap[value]);
            activeStocks.splice(activeStocks.indexOf(value), 1);
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (STOCKS[value]) {
            reset();
            activeStocks.push(value);
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'tech') {
            reset();
            activeStocks = ['gspc', 'zoom', 'cisco', 'amazon'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'travel') {
            reset();
            activeStocks = ['gspc', 'boeing', 'lockheed', 'marriott', 'royalcruise', 'amc'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'pharma') {
            reset();
            activeStocks = ['gspc', 'jnj', 'roche', 'moderna', 'gild', 'inovio'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'finance') {
            reset();
            activeStocks = ['gspc', 'jpm', 'gs'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'auto') {
            reset();
            activeStocks = ['gspc', 'ford', 'gm', 'tesla', 'chevron', 'exxon'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === 'apparel') {
            reset();
            activeStocks = ['gspc', 'macy', 'gap', 'adidas', 'nike'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
        if (value === "reload") {
            reset();
            activeStocks = ['gspc', 'zoom', 'royalcruise', 'inovio'];
            buildGraph(generateActiveData(masterData, STOCKS, activeStocks));
            return;
        }
    });

chartGroup
    .append("g")
    .classed('x-axis', true)
    .attr("transform",`translate(0, 0)`)
    .call(bottomAxis);
// add y-axis (left)
chartGroup
    .append("g")
    .classed('left-y-axis', true)
    .call(leftAxis);

chartGroup
    .append("g")
    .attr("transform", `translate(${width}, 0)`)
    .classed('right-y-axis', true)
    .call(rightAxis);
    

function buildGraph(data) {
    function addLine(line, color) {
        return chartGroup.append("path")
            .data([data])
            .attr("d", line)
            .classed(color, true);
    }
    xTimeScale
        .domain(d3.extent(data, d => d.Date))
        .range([0, width]);

    yLinearScale
        .domain([d3.min(data,record => d3.min(valuesByTypeInRecord(record, 'percent'))) - 5, d3.max(data,record => d3.max(valuesByTypeInRecord(record, 'percent')))])
        .range([height, 0]);

    function makeCirlces(chosenXAxis, color) {
        return chartGroup.selectAll()
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xTimeScale(d.Date))
            .attr("cy", d => yLinearScale(d[chosenXAxis]))
            .attr("r", 3)
            .attr("fill", color);
    }
    function makeLine(chosenXAxis) {
        return d3.line()
            .x(d => xTimeScale(d.Date))
            .y(d => yLinearScale(d[chosenXAxis]));
    }

    chartGroup.select(".x-axis").attr("transform",`translate(0, 0)`).call(bottomAxis);
    // add y-axis (left)
    chartGroup.select(".left-y-axis").call(leftAxis);

    chartGroup.select(".right-y-axis").attr("transform", `translate(${width}, 0)`).call(rightAxis);

    addLine(makeLine('Center'), 'line white');

    function addStockLine(name,label) {
        activateLine(name);
        activateLabel(label);
    }
    function Line_Tip(name, color) {
        return addLine(makeLine(`${name} Percent`), `line ${color}`);
    }
    function addTool(name, color) {
        return make_toolTip(makeCirlces(`${name} Percent`, color), `${name} Price`);
    }

    activeStocks.forEach(function(key) {
        var params = STOCKS[key];
        addStockLine(Line_Tip(params.display, params.color),labelsMap[params.value]);
        addTool(params.display, params.color);
    })


}
function updateGraphData() {

    d3.json('static/data/stocks.json').then(function(data, err) {
        if (err) throw err;
        data.forEach(function(d) {
            d.Date = new Date(d.Date);
            Object.keys(d).forEach(function(key) {
                d[key] = +d[key];
            });
        });
        masterData = data;
        var activeData = generateActiveData(masterData, STOCKS, activeStocks);

        buildGraph(activeData);
       
    })
}
updateGraphData();
(function() {
    var isScraping = false;
    $('#stockButton').on("click", function() {
        if (!isScraping) {
            isScraping = true;
            $.ajax({ method:'get',url:'/scrape'}).then(function(response){
                updateGraphData();
                isScraping = false;
            }).catch(function(error) {
                console.log(error);
                isScraping = false;
            })
        }
    });
})();