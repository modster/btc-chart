/**********************************************************************************************************************************
 *                                                                                                                                *
 *                                                20th Century Fox News Presents:                                                 *
 *                                                                                                                                *
 *                                               Summer 2019's Blockbuster Hit App                                                *
 *                                                                                                                                *
 ***********************************************************************************************************************************                                                                                                                                *
 *                                                                                                                                *
 *                                             B  I  T  C  O  I  N  -  C  H  A  R  T                                              *
 *                                                                                                                                *
 *                                                             ~ * ~                                                              *
 *                                                                                                                                *
 *                                                     E p i s o d e  X I I I                                                     *
 *                                                                                                                                *
 *                                           ' B u t t C o i n  B r e a k s  W i n d '                                            *
 *                                                                                                                                *
 *                                                                                                                                *
 **********************************************************************************************************************************
 *                                                                                                                                *
 *                                                                                                                                *
 *                                                           Starring                                                             *
 *                                                                                                                                *
 *                                           M I K E  " T h e  B o s s "  B O S T O C K                                           *
 *                                                                                                                                *
 *                                                              and                                                               *
 *                                                                                                                                *
 *                                                            D 3 J S                                                             *
 *                                                                                                                                *
 *                                                                                                                                *
 **********************************************************************************************************************************
 *                                                                                                                                *
 *                                                      Executive Producer:                                                       *
 *                                                                                                                                *
 *                                                     M I K E   G R E E F F                                                      *
 *                                                                                                                                *
 *                                                       mike@greeffer.com                                                        *
 *                                                                                                                                *
 *                                                             ~ * ~                                                              *
 *                                                                                                                                *
 *                                                        Special Thanks:                                                         *
 *                                                                                                                                *
 *                                                       The Repo I cloned                                                        *
 *                                                            My Wife                                                             *
 *                                                         My Girlfriend                                                          *
 *                                                      Maxwell House Coffee                                                      *
 *                                                          CoinDesk API                                                          *
 *                                                         Donald J Trump                                                         *
 *                                                                                                                                *
 *********************************************************************************************************************************/

 /**
 * Historical BPI endpoint:     https://api.coindesk.com/v1/bpi/historical/close.json (returns previous 31 days' price data)
 * ?index=USD/CNY               The index to return data for. Defaults to USD.
 * ?currency=<VALUE>            The currency to return the data in, specified in ISO 4217 format. Defaults to USD.
 * ?start=<VALUE>&end=<VALUE>   Allows data to be returned for a specific date range. Must be listed as a pair of start and end
 *                              parameters, with dates supplied in the YYYY-MM-DD format, e.g. 2013-09-01 for September 1st, 2013.
 * ?for=yesterday               Specifying this will return a single value for the previous day. Overrides the start/end parameter.
 * Sample Request:              https://api.coindesk.com/v1/bpi/historical/close.json?start=2013-09-01&end=2013-09-05 
 */
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
var yyyyMinusOne = yyyy-1;
if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
} 

var api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start='+ yyyyMinusOne +'-'+ mm + '-'+ dd +'&end='+ yyyy +'-'+ mm +'-'+ dd;
console.log(api)
/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener("DOMContentLoaded", function(event) {
fetch(api)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var parsedData = parseData(data);
        drawChart(parsedData);
    })
    .catch(function(err) { console.log(err); })
});

/**
 * Parse data into key-value pairs
 * @param {object} data Object containing historical data of BPI
 */
function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push({
            date: new Date(i), //date
            value: +data.bpi[i] //convert string to number
        });
    }
    return arr;
}

/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
function drawChart(data) {
var svgWidth = 600, svgHeight = 400;
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.date)})
    .y(function(d) { return y(d.value)})
    x.domain(d3.extent(data, function(d) { return d.date }));
    y.domain(d3.extent(data, function(d) { return d.value }));

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain")
    .remove();

g.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");

g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}

