/**
 * Created by jsmith on 5/6/15.
 *
 * Based off example at http://bl.ocks.org/mbostock/3883245
 */
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var widthMultiplier = width / 6;

//var x = d3.scale.ordinal().range([0, widthMultiplier, widthMultiplier * 2, widthMultiplier * 3, widthMultiplier * 4, widthMultiplier * 5, widthMultiplier * 6]);
var x = d3.scale.ordinal().rangePoints([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var lineHigh = d3.svg.line()
    .x(function(d) { return x(d.t); })
    .y(function(d) { return y(d.p[1]); });

var lineLow = d3.svg.line()
    .x(function(d) { return x(d.t); })
    .y(function(d) { return y(d.p[2]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("aapl.json", function(error, data) {
    var yMinArr = [];
    var yMaxArr = [];
    var xDomains = [];
    var flattedData = [];
    //var earliestTime = data[data.length - 1][data[data.length - 1].length].t;
    for (var i = 0; i < data.length; i++) {
        var innerData = data[data.length - i - 1];

        // Get Y Domains
        yMinArr.push(d3.min(data[i], function(d) { return d.p[2] - d.p[3] * 0.02; }));
        yMaxArr.push(d3.max(data[i], function(d) { return d.p[1] + d.p[3] * 0.02; }));

        // Get X Domain Values
        //xDomains.push(moment.unix(data[i][0].t).format('L'));

        for (var j = 0; j < innerData.length; j++) {
            var entry = innerData[innerData.length - j - 1];
            entry.t = Math.floor(entry.t/60) * 60;
            flattedData.push(entry);
            xDomains.push(entry.t);
        }
    }

    console.log(xDomains);
    console.log(flattedData);
    x.domain(xDomains);
    //y.domain(d3.extent(data, function(d) { return d.p[1]; }));
    //y.domain([d3.min(data, function(d) { return d.p[2] - d.p[3] * 0.02; }), d3.max(data, function(d) { return d.p[1] + d.p[3] * 0.02; })]);
    y.domain([Math.min.apply(null, yMinArr), Math.max.apply(null, yMaxArr)]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("path")
        .datum(flattedData)
        .attr("class", "line line-high")
        .attr("d", lineHigh);

    svg.append("path")
        .datum(flattedData)
        .attr("class", "line line-low")
        .attr("d", lineLow);

    d3.json("predictions.json", function(error, predictionData) {
        var flattedPredData = [];
        for (var i = 0; i < predictionData.length; i++) {
            var predictionDayData = predictionData[i];
            for (var j = 0; j < predictionDayData.length; j++) {
                flattedPredData.push(predictionDayData[j]);
            }
        }
        var circleGroup = svg.append('g').selectAll('g').data(flattedPredData);
        circleGroup.enter().append('g').append('circle');
        circleGroup.selectAll('circle').attr('cx', function(d, i) { return x(d.params.t)})
                   .attr('cy', function(d, i) { return y(d.data.p.g)})
                   .attr('r', function(d, i) { return 3})
                   .attr('class', 'circle');
    });
});
