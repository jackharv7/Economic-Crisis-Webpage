//add table for stocks prices
var formatTime = d3.timeFormat("%b %d");
var formatNum = d3.format("$,.2f");

function tabulate(data, columns) {
  data.map(function(d) {
    d['52 Week Min'] = formatNum(d['52 Week Min']),
    d['52 Week Max'] = formatNum(d['52 Week Max']),
    d['Last Price'] = formatNum(d['Last Price'])
  });

  var area = d3.select("body").append("div");
  var contain = area.append("div");
  contain.attr("class", "container-fluid");
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

$(window).on("load", function() {

  $.ajax({ method:'get',url:'/data/table'}).then(function(data){
    tabulate(data, ['Ticker', 'Last Price','52 Week Min', '52 Week Max']);
      

  }).catch(function(error) {
      console.log("/data/table", error);
  })

});