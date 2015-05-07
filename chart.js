/**
 * Created by jsmith on 5/6/15.
 *
 * Based off example at http://bl.ocks.org/mbostock/3883245
 */
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var lineHigh = d3.svg.line()
    .x(function(d) { return x(d.t * 1000); })
    .y(function(d) { return y(d.p[1]); });

var lineLow = d3.svg.line()
    .x(function(d) { return x(d.t * 1000); })
    .y(function(d) { return y(d.p[2]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("aapl.json", function(error, data) {
    x.domain(d3.extent(data, function(d) { return d.t * 1000; }));
    //y.domain(d3.extent(data, function(d) { return d.p[1]; }));
    y.domain([d3.min(data, function(d) { return d.p[2] - d.p[3] * 0.02; }), d3.max(data, function(d) { return d.p[1] + d.p[3] * 0.02; })]);

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
        .datum(data)
        .attr("class", "line line-high")
        .attr("d", lineHigh);

    svg.append("path")
        .datum(data)
        .attr("class", "line line-low")
        .attr("d", lineLow);

    d3.json("predictions.json", function(error, data) {
        var circleGroup = svg.append('g').selectAll('g').data(data);
        circleGroup.enter().append('g').append('circle');
        circleGroup.selectAll('circle').attr('cx', function(d, i) { return x(d.params.t * 1000)})
                   .attr('cy', function(d, i) { return y(d.data.p.g)})
                   .attr('r', function(d, i) { return 3})
                   .attr('class', 'circle');
        console.log(circleGroup);
    });
});
