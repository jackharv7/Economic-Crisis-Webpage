
 Plotly.d3.csv("static/data/dot_com.csv", function(err, rows){

  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}

var trace1 = {
  type: "scatter",
  name: 'Nasdaq',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'Nasdaq'),
  line: {color: 'red'}
}

var trace2 = {
  type: "scatter",
  name: 'Amazon',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'Amazon'),
  line: {color: 'blue'}
}

var trace3 = {
  type: "scatter",
  name: 'Cisco',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'Cisco'),
  line: {color: 'green'}
}

var data = [trace1,trace2,trace3];
    
var layout = {
  title: 'Dot Com Bubble - Normalized Prices'
}

Plotly.newPlot('plot', data, layout);
})
