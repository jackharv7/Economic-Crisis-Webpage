var MMM_date = new Array;
var MMM_values = new Array;
var cc_date = new Array;
var cc_values = new Array;
var pf_date = new Array;
var pf_values = new Array;
var GSPC_date = new Array;
var GSPC_values = new Array;
var nq_date = new Array;
var nq_values = new Array;
var un_date = new Array;
var un_values = new Array;
d3.csv("static/data/MMM.csv").then(function(data){
    data.forEach(data => MMM_date.push(data.Date));
    
    data.forEach(data => MMM_values.push(data.Close));
    
});
d3.csv("static/data/cocacola.csv").then(function(data){
    data.forEach(data => cc_date.push(data.Date));
    
    data.forEach(data => cc_values.push(data.Close));
    
});
d3.csv("static/data/pfizer.csv").then(function(data){
    data.forEach(data => pf_date.push(data.Date));
    
    data.forEach(data => pf_values.push(data.Close));
    
});
d3.csv("static/data/GSPC.csv").then(function(data){
    data.forEach(data => GSPC_date.push(data.Date));
    
    data.forEach(data => GSPC_values.push(data.Close));
    
});
d3.csv("static/data/nasdaq.csv").then(function(data){
    data.forEach(data => nq_date.push(data.Date));
    
    data.forEach(data => nq_values.push(data.Close));
    
});
d3.csv("static/data/unemployment.csv").then(function(data){
    data.forEach(data => un_date.push(data.Year));
    
    data.forEach(data => un_values.push(data.Mean));
    
});

console.log(cc_values)
var mychart = document.getElementById("chart1").getContext("2d");
var line = new Chart(mychart, {
    type: "line",
    data: {
        labels:GSPC_date ,
        datasets:[{
        label: "S&P 500",
        borderColor: "white",
        data: GSPC_values}
        
        
        ,
        {
            label: "Nasdaq",
            data: nq_values,
            borderColor: "green"} ]
}})
var mychart = document.getElementById("chart2").getContext("2d");
var line = new Chart(mychart, {
    type: "line",
    data: {
        labels: MMM_date,
        datasets:[{
        label: "3M",
        borderColor: "white",
        data: MMM_values}
        
        
        , {
            label: "Coca Cola",
            data: cc_values
        },
        {
            label: "Pfizer",
            data: pf_values,
            borderColor: "green"} ]
}})
var mychart = document.getElementById("chart3").getContext("2d");
var line = new Chart(mychart, {
    type: "line",
    data: {
        labels:un_date ,
        datasets:[{
        label: "Unemployment Rate",
        borderColor: "white",
        data: un_values}
        
        
         ]
}})