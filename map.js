var margin = { top: 20, right: 20, bottom: 20, left: 20 };
width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    formatPercent = d3.format(".1%");

var svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

queue()
    .defer(d3.csv, "us-counties.csv")
    .defer(d3.json, "us.json")
    .defer(d3.csv, "county_fips_master.csv")
    .await(ready);

var legendText = ["", "10%", "", "15%", "", "20%", "", "25%"];
var legendColors = ["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"];


function ready(error, data, us, countyMaster) {

    var counties = topojson.feature(us, us.objects.counties);

    data.forEach(function (d) {
        // d.date = parseTime(d.date);
        d.fips = +d.fips;
        d.rate = +d.rate;
    });

    var dataByCountyByDate = d3.nest()
        .key(function (d) { return d.fips; })
        .key(function (d) { return d.date; })
        .map(data);
    
    var county_master = d3.nest()
        .key(function (d) { return d.fips; })
        .map(countyMaster);

    counties.features.forEach(function (county) {
        county.countyName = county_master[+county.id] ? county_master[+county.id][0].county_name : '';
        county.stateName = county_master[+county.id] ? county_master[+county.id][0].state_name : '';
        county.properties.dates = dataByCountyByDate[+county.id]
    });

    var color = d3.scale.threshold()
        .domain([10, 12.5, 15, 17.5, 20, 22.5, 25])
        .range(["#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

    var projection = d3.geo.albersUsa()
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var countyShapes = svg.selectAll(".county")
        .data(counties.features)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("d", path);

    countyShapes
        .on("mouseover", function (d) {
            var maxDate = getDateFromTs(slider.attr("max"));
            var selectedDate = getDateFromTs(slider.property("value"));
            tooltip.transition()
                .duration(250)
                .style("opacity", 1);
            tooltip.html(
                "<p><strong>" + d.countyName + ", " + d.stateName + "</strong></p>" +
                "<table><tbody><tr><td class='wide'>Cases on " + selectedDate + ":</td><td>" + getCasesOnDate(d, selectedDate) + "</td></tr>" +
                "<tr><td>Cases on " + maxDate + ":</td><td>" + getCasesOnDate(d, maxDate) + "</td></tr>" +
                "<tr><td>Change:</td><td>" + formatPercent((getCasesOnDate(d, maxDate) - getCasesOnDate(d, selectedDate)) / 100) + "</td></tr></tbody></table>"
            )
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(250)
                .style("opacity", 0);
        });

    svg.append("path")
        .datum(topojson.feature(us, us.objects.states, function (a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", path);

    var legend = svg.append("g")
        .attr("id", "legend");

    var legenditem = legend.selectAll(".legenditem")
        .data(d3.range(8))
        .enter()
        .append("g")
        .attr("class", "legenditem")
        .attr("transform", function (d, i) { return "translate(" + i * 31 + ",0)"; });

    legenditem.append("rect")
        .attr("x", width - 240)
        .attr("y", -7)
        .attr("width", 30)
        .attr("height", 6)
        .attr("class", "rect")
        .style("fill", function (d, i) { return legendColors[i]; });

    legenditem.append("text")
        .attr("x", width - 240)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text(function (d, i) { return legendText[i]; });

    function update(date) {
        slider.property("value", date);
        selectedDate = getDateFromTs(date);
        d3.select(".date").text(selectedDate);
        countyShapes.style("fill", function (d) {
            return (color(getCasesOnDate(d, selectedDate)));
        });
    }

    function getDateFromTs(date) {
        var d = new Date(+date);
        return d.getFullYear() + '-' + ("0" + (d.getMonth() + 1)).slice(-2) + '-' + ("0" + (d.getDate() + 1)).slice(-2);
    }

    function getCasesOnDate(county, selectedDate) {
        if (typeof county.properties.dates != "undefined") {
            if (selectedDate in county.properties.dates) {
                return +county.properties.dates[selectedDate][0].cases;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    var startDate = new Date("2020-01-21").valueOf();
    var endDate = new Date("2020-06-21").valueOf();
    var slider = d3.select(".slider")
        .append("input")
        .attr("type", "range")
        .attr("min", startDate)
        .attr("max", endDate)
        .attr("step", 86400000)
        .on("input", function () {
            update(this.value);
        });

    update(startDate);

}

d3.select(self.frameElement).style("height", "685px");