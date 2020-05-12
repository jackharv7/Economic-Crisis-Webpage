// capture user input
//  - Listen to form to be submitted
//  - Prevent form from submitting
//  - Read the value of the input field from the form
// send ticker back for prediction
// draw graph plus prediction data

function graphPredictions(data) {
    console.log(data);
    var dates = data.map(data => new Date(data.Date));
    var close = data.map(data => data['Adj Close'])
    var predicts = data.map(data => data.Prediction)

    var trace1 = {
        type: "scatter",
        name: 'Close Price',
        x: dates,
        y: close,
        line: {color: 'blue'}
    }
    var trace2 = {
        type: "scatter",
        name: 'Predictions',
        x: dates,
        y: predicts,
        line: {color: 'orange'}
    }
    var data = [trace1, trace2];

    var layout = {
        yaxis: {
            title:'Price (USD)'
        },
        title: 'Stock Predictions for the Next 5 Days'
    }

    Plotly.newPlot('plot', data, layout);
}


(function() {
    var isPredicting = false;
    $('#stock-ticker-form').on("submit", function(event) {
        event.preventDefault();
        if (!isPredicting) {
            console.log(this)
            var ticker = $(this).find('input[name="ticker"]')[0].value.toUpperCase();
            console.log(ticker);
            isPredicting = true;
            $.ajax({ method:'get',url:'/predicts', data:{ticker}, dataType:'json' }).then(function(response){
                graphPredictions(response);
                isPredicting = false;
            }).catch(function(error) {
                console.log(error);
                isPredicting = false;
            })
        }
    });
})();

