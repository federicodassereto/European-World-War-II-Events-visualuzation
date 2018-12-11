loadEvents();
loadCSV();
loadStateInfo();

var infos,events,sides;
var jj=false;
var width = 800;
var height = 500;
var path = d3.geoPath();
var height2 = 25;
var dict = {}, stackColor = {};
var csv = [],keys = [];

var tooltip = d3.select("body")
    .append("div")
    .attr('id','tooltip')
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color","white");

var svg = d3.select("body").append("svg")
    .attr('id','map')
    .style('background-color','#F5F5F5')
    .attr("width", width-4)
    .attr("height", height+25)
    .style('margin-left','2%')
    .style('border-style', 'groove')
    .style('border-width', '1px');

svg.append('g').attr('id','gMap');

var div = d3.select('body')
    .append('svg')
    .attr('id','rightContainer')
    .style('margin-left','20px')
    .style('background-color','#F5F5F5')
    .style("border-style", "groove")
    .style('border-width', '1px')
    .attr('width',width/2.2)
    .attr('height',height+height2);

var stateInfo = div.append('g')
    .attr('id','stateInfo');

var infoP = div.append('g')
    .attr('id','infoP');

stateInfo.append('text')
    .attr('id','titleDesc')
    .attr('x', 10)
    .attr('y',25)
    .text('Brief Country Description')
    .style('font-weight', 'bold');

stateInfo.append('rect')
    .attr('x',5).attr('y',30)
    .style('visibility', 'visible')
    .attr('width',350)
    .attr('height',height/1.7)
    .attr('fill','#F5F5F5');

stateInfo.append('text')
    .attr('id','description')
    .attr('x',(width/2.2)/2.2)
    .attr('y',10)
    .style('text-anchor','middle')
    .style('font-family','Amiko');

infoP.append('text')
    .attr('id','titleEvent')
    .attr('x',10)
    .attr('y',375)
    .text('Brief Events Description')
    .style('font-weight', 'bold');

infoP.append('rect')
    .attr('x',5).attr('y',height/1.30)
    .style('visibility', 'hidden')
    .attr('width',350).attr('height',height/3.9)
    .attr('fill','#F5F5F5');

infoP.append('text')
    .attr('id','events')
    .attr('x',infoP.select('rect').attr('x')+5)
    .attr('y',infoP.select('rect').attr('y')+2)
    .style('fill','#01579B')
    .style('font-family','Amiko');

var timeline = d3.select('body')
    .append('svg')
    .attr('id','timeline')
    .attr('width', width+50)
    .attr('height', height2*3)
    .style('margin-left', '-0.4%');

stackColor = {
    'Allies':'#FF5C56',
    'Axis':'#3A6367',
    'Axis-occupied':'#34929B'
};

d3.select('body').append('p').attr('id','help').text('Zoom over timeline to navigate through all the months of WWII. Click on a country in the map to show detailed information.').style('font-family','Amiko').style('margin-left','2%').style('margin-top','-1.5%');

var x2 = d3.scaleTime()
    .domain([new Date("1 May, 1939"),new Date("31 May, 1945")])
    .range([0,width]);

var xAxis2 = d3.axisBottom(x2);

var context = timeline.append("g")
    .attr("class", "context")
    .call(d3.zoom().scaleExtent([1, 8]).translateExtent([[0,0],[width,height2]]).extent([[0,0],[width,height2]]).on('zoom', zoomed));

d3.select('body').append('div').attr('id','chartContainer');
d3.select('#rightContainer').append('svg').attr('id','bubbleChart').attr('width',400).attr('height', 550).style('margin-right','20px').style('visibility','hidden');
d3.select('#bubbleChart').append('text').attr('x',100).attr('y',400).text('null');


setTimeout(function () {
    d3.select('#help').remove();
},30*1000);
initLegend();
home();

function assignColor(side) {
    switch (side){
        case 'Allies':
            return '#FF5C56';
        case 'Axis':
            return '#3A6367';
        case 'Axis-occupied':
            return '#34929B';
        case 'Other':
            return '#616161';
        default:
            return '#BDBDBD';
    }
}

function wrap(text, width) {
    text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = parseInt(text.attr("y"))+25,
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 20).attr("y", y).attr("dy", 0 + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 10).attr("y", y).attr("dy", lineHeight +  "em").text(word);
                    lineHeight+=1.1;
                }
            }
        }
    )}

function initLegend() {

    if(! d3.select('.Mainlegend').empty())
        return;

    var title = ['Allies','Axis','Axis-aligned','Other','Neutral'];
    var y = 0;
    var colors = ['#FF5C56','#3A6367','#34929B','#616161','#BDBDBD'];
    var mainLegend = svg.append("g")
        .attr("transform", "translate (0,-10)")
        .attr("class", "Mainlegend");

    mainLegend.append('g')
        .attr('id','container')
        .attr('width',60)
        .attr('height',140)
        .attr('fill', 'none');

    mainLegend.select('#container')
        .selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attr('width',20)
        .attr('height',20)
        .attr('x',20)
        .attr('y', function () {
            y+=25;
            return y;
        })
        .attr('fill',function (d) {
            return d;
        });

    y=15;

    mainLegend.select('#container')
        .selectAll('text')
        .data(title)
        .enter()
        .append('text')
        .attr('x',47)
        .style('fill', 'black')
        .attr('y', function () {
            y+=25;
            return y;
        })
        .text(function (d) {
            return d;
        });
}

function load(dd) {

    d3.select('#selectStack').style('visibility','hidden');
    d3.select('#rightContainer').select('svg').style('visibility','visible');
    d3.select("#stateInfo").select('text').style('visibility', 'visible');
    d3.select("#bubbleChart").style('visibility', 'hidden');
    d3.select('#infoP').select('text').style('visibility', 'visible');
    d3.select('#stateInfo').select('text').style('visibility', 'visible');
    d3.select('.Mainlegend').attr('visibility', 'visible');
    d3.select('#stateInfo').select('#description').text(null);

    initLegend();

    var formatTime = d3.timeFormat("%B_%Y");
    var aux = formatTime(new Date(dd));

    d3.select('#homeTitle').text('Europe in ' + aux.replace('_', ', '));

    if (events[aux] !== '') {
        d3.select('#infoP').select('rect').style('visibility', 'visible');
        d3.select('#stateInfo').select('rect');
        d3.select('#infoP').select('#events').text(events[aux]).call(wrap, width / 2.4);
    }
    else {
        d3.select('#infoP').select('rect').text();
        d3.select('#stateInfo').select('rect');
        d3.select('#rightContainer').style('visibility','visible');
        d3.select('#infoP').select('#events').text(null);
    }

    var url = "TopoJsonFinal/"+aux+'.json';

    if(jj) {
        svg.selectAll('path').remove();
        jj = false;
    }

    d3.select('#year').text(aux.replace('_',', '));
    d3.json(url, function(error, topology) {
        if (error) throw error;

        var geojson = topojson.feature(topology,topology.objects[aux]);
        d3.select('#legend').remove();
        var svg = d3.select('#gMap').selectAll("path").data(geojson.features);
        svg.data(geojson.features)
            .style('fill',function (d) {
                return assignColor(d['properties']['status']);
            })
            .attr("d", path)
            .attr('id', function (d) {
                return d.properties['name'];
            });

        svg.enter().append('path')
            .style('fill',function (d) {
                return assignColor(d['properties']['status']);
            })
            .attr("d", path)
            .attr('id', function (d) {
                return d.properties['name'];
            });

        svg.exit().remove();
        initTooltip();
    });
}

function initTooltip() {
    var tooltip = d3.select('#tooltip');

    d3.select("#map")
        .selectAll("path")
        .on("click", function(d){
            d3.select('#stateInfo').style('visibility', 'visible');
            d3.select('#stateInfo').select('rect').style('visibility', 'visible');
            writeInfo(d['properties']['name']);
        })
        .style('cursor','pointer')
        .on("mouseover", function(d){ tooltip.text(d.properties['name'].replace('_',' ')); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){ return tooltip.style("visibility", "hidden");});
}

function zoomed() {
    d3.select('.axis').call(xAxis2.scale(d3.event.transform.rescaleX(x2)));

    context.selectAll("g")
        .selectAll('text')
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.5em")
        .style('cursor','pointer')
        .on('click', function (d) {
            load(d);
        });
}

function pair(array) {
    return array.slice(1).map(function(b, i) {
        return [array[i], b];
    });
}

function jewish() {

    d3.select('#stacked').style('visibility','hidden');
    d3.select('#gMap').style('visibility', 'visible');
    d3.select('#help').remove();
    d3.select('#rightContainer').select('svg').style('visibility','visible');
    d3.select('#rightContainer').style('visibility','visible');
    d3.select('#legend').style('visibility','visible');
    d3.select('#container').style('visibility', 'hidden');
    d3.select('#infoP').select('*').style('visibility', 'hidden');
    d3.select('#stateInfo').select('*').style('visibility', 'hidden');
    d3.select('#stateText').text(null);
    d3.select('#timeline').style('visibility', 'hidden');

    if (Object.keys(dict).length === 0) {
        for (var line in csv)
            if (csv[line]['Tags'] === 'holocaust-jewish')
                dict[csv[line]['Nationality']] = +csv[line]['DeathsFinal'];
        for (var k in dict)
            keys.push(k);
    }

    d3.select('#homeTitle').text('Distribution Of Deaths By Country');
    d3.json('TopoJsonFinal/February_1938.json', function(error, topology) {
        if (error) throw error;

        var colorScale = d3.scaleLog().domain([88,3000000]).interpolate(d3.interpolateHcl).range([d3.rgb('#D1C4E9'),d3.rgb('#4527A0')]);
        var geojson = topojson.feature(topology, topology.objects.February_1938);
        var svg = d3.select('#map').select('#gMap');

        svg.selectAll('path').remove();
        svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append('path')
            .style('fill','#BDBDBD')
            .attr("d", path)
            .attr('id', function (d) {
                return d.properties['name'];
            })
            .on('mouseover',function (d) {
                d3.select('#bubbleChart').select('#'+d.properties.name).style('stroke','red').style('stroke-width', '5px');
                d3.select('#bubbleChart').select('text').attr('x', 30).attr('y', 450).text('Total Deaths in ' + d.properties.name.replace('_', ' ')+ ' : ' + ( dict[d.properties.name]===undefined?'Missing Value':dict[d.properties.name] ));
                d3.select(this).style('stroke','cc0000').style('stroke-width', '3px');
            })
            .on('mouseout',function (d) {
                d3.select('#bubbleChart').select('#'+d.properties.name).style('stroke','none');
                d3.select(this).style('stroke','white').style('stroke-width', '0.25px');
            });

        svg.selectAll('path')
            .transition()
            .duration(3000)
            .style('fill',function (d) {
                if (keys.indexOf(d.properties['name']) === -1)
                    return '#BDBDBD';
                else
                    return colorScale(dict[d.properties['name']]);
            })
    });
    BubbleChart('jewish');
    jj=true;
}

function home() {
    d3.select('#titleDesc').style('visibility','visible');
    d3.select('#selectStack').style('visibility','hidden');
    d3.select('#stacked').style('visibility','hidden');
    d3.select('#rightContainer').select('svg').style('visibility','visible');
    d3.select('#rightContainer').style('visibility','visible');
    d3.select('#bubbleChart').style('visibility', 'hidden');
    d3.select('#legend').style('visibility','hidden');
    d3.select('#container').style('visibility', 'visible');
    d3.select('#gMap').style('visibility', 'visible');
    d3.select('#map').style('background-color', 'rgb(245,245,245)');
    d3.select('#homeTitleSpan').style('margin-right','2%');
    d3.select('#timeline').style('visibility', 'visible');
    d3.select('#events').style('visibility', 'visible');
    d3.select('#infoP').select('#titleEvent').style('visibility', 'visible');
    d3.select('#stateInfo').selectAll('text').remove();

    if (d3.select('#stateInfo').select('text').empty())
        d3.select('#stateInfo').append('text').attr('id','titleDesc')
            .attr('x', 10).attr('y',25)
            .text('Brief Country Description')
            .style('font-weight', 'bold');
    else
        d3.select('#stateInfo').select('text').text('Brief Country Description');

    d3.select('#homeTitle').text('Europe in May, 1939');
    var url = "TopoJsonFinal/May_1939.json";
    d3.json(url, function(error, topology) {
        if (error) throw error;
        var geojson = topojson.feature(topology, topology.objects.May_1939);

        svg.select('#gMap').selectAll('path').remove();
        svg.select('#gMap')
            .selectAll("path")
            .data(geojson.features)
            .enter()
            .append('path')
            .style('fill',function (d) {
                return assignColor(d['properties']['status']);
            })
            .attr("d", path)
            .attr('id', function (d) {
                return d.properties['name'];
            });

        if ( d3.select('.context').select('g').empty() ) {
            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(30," + (height2 - 5) + ")")
                .call(xAxis2.tickSize(-height2))
                .selectAll('text')
                .attr("transform", "rotate(-60)")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", "-.5em");
        }

        context.selectAll('text')
            .style('cursor','pointer')
            .on('click', function (d) {
                load(d);
            });
        initTooltip();
    });
}

function loadEvents() {
    d3.json('events.json', function(error, list) {
        if (error) throw error;
        events=list;
    });
}

function stacked(key) {

    d3.select('#titleDesc').style('visibility','hidden');
    d3.select('#help').remove();
    d3.select('#bubbleChart').style('visibility', 'hidden');
    d3.select('#infoP').select('#titleEvent').style('visibility', 'hidden');
    d3.select('#infoP').select('#events').text(null).style('visibility', 'hidden');
    d3.select('#infoP').select('rect').style('visibility', 'hidden');
    d3.select('#stateInfo').select('#description').text(null).style('visibility', 'hidden');
    d3.select('#stateInfo').select('rect').style('visibility', 'hidden');
    d3.select('#gMap').style('visibility','hidden');
    d3.select('.mainLegend').style('visibility','hidden');
    d3.select('#container').style('visibility','hidden');
    d3.select('#legend').style('visibility','hidden');
    d3.select('#timeline').style('visibility','hidden');
    d3.select('#rightContainer').style('visibility', 'visible');
    d3.select('#selectStack').style('visibility','visible');
    d3.select('#homeTitle').select('#title').remove();
    d3.select('#stateText').style('visibility','hidden');
    d3.select('#homeTitleSpan').style('margin-right','18%');
    d3.select('#homeTitle').text('Faction Composition');

    var svg = d3.select('#map');

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    if(d3.select('#stacked').empty())
        g = svg.append("g").attr('id','stacked').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    else
        g = d3.select('#stacked').style('visibility','visible');

    var x = d3.scaleBand().rangeRound([0,width]);
    var y = d3.scaleLinear().domain([1,72]).range([height,0]);
    var colors = ['#FF5C56','#3A6367','#34929B'];
    var z = d3.scaleOrdinal().range(colors);

    d3.csv("sides.csv",function (d, i, columns) {
        for (i = 1, t = 0; i < columns.length; ++i)
            t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    },function (error, data) {
        if (error)
            throw error;

        if(key===undefined)
            key='Allies';

        var keys = data.columns.slice(1);

        data.sort(function(a, b) { return b[key] - a[key]; });
        x.domain(data.map(function(d) { return d.Country.replace('_',' '); }));
        g.selectAll('g').remove();

        if (g.select('g').empty()) {
            g.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))
                .enter().append("g").attr('transform','translate(5,0)')
                .attr("fill", function(d) { return z(d.key); })
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("rect")
                .attr("x", function(d) { return x(d.data.Country.replace('_',' ')); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", 30);

            g.append("g")
                .attr("class", "axis2")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(0,-5)')
                .attr('transform', 'rotate(-60)')
                .style("text-anchor", "end");

            g.append("g")
                .attr("class", "axis2")
                .call(d3.axisLeft(y)
                    .ticks(6)
                    .tickFormat(function (d) {
                        return parseInt( ((d - 1) / 71)*100) + '%';
                    }));
        }

        d3.select('#stacked')
            .selectAll('rect')
            .on('mouseover', function () {
                var extg = d3.select(this.parentElement.parentElement);
                var parentg = d3.select(this.parentElement);
                extg.selectAll('g')
                    .selectAll('rect')
                    .style('opacity',function (d) {
                        if (d3.select(this.parentElement).attr('fill') === parentg.attr('fill'))
                            return '1';
                        return '0.3';
                    });
            })
            .on('mouseout', function () {
                d3.select(this.parentElement.parentElement).selectAll('g').selectAll('rect').attr('style',null)
            });

        var list = [];
        for(var line in data) {
            list.push({
                key: data[line].Country,
                value: data[line][key]
            });
        }

        list.splice(list.length-1);
        list.sort(function(a,b){return b.value - a.value;});

        d3.select('#stateInfo').selectAll('text').remove();
        var aux = d3.select('#stateInfo');
        var incY=70;

        aux.append('text').text(key + " composition").style('fill',stackColor[key]).style("font-weight","bold").attr('x', 30).attr('y', incY-25);

        for(var xx in list) {
            aux.append('text').text(list[xx].key.replace('_',' ') + ' : ' + parseFloat( ((list[xx].value)*100)/72).toFixed(1)+'%' ).attr('x', 30).attr('y', incY);
            incY+=25;
        }
    });
}

function BubbleChart(type) {

    d3.select('#titleDesc').style('visibility','hidden');
    d3.select('#help').remove();
    d3.select('#selectStack').style('visibility','hidden');
    d3.select('#stateText').text(null);
    d3.select('#rightContainer').select('svg').style('visibility','visible');
    d3.select('#rightContainer').style('visibility','visible');
    d3.select('#gMap').style('visibility', 'visible');
    d3.select('#stacked').style('visibility','hidden');
    d3.select('#infoP').select('rect').style('visibility', 'hidden');
    d3.select('#infoP').select('#titleEvent').style('visibility', 'hidden');
    d3.select('#infoP').select('#events').text(null).style('visibility', 'hidden');
    d3.select('#stateInfo').select('rect').style('visibility', 'hidden');
    d3.select('#stateInfo').select('#description').style('visibility', 'hidden');
    d3.select('#stateInfo').selectAll('text').style('visibility','hidden');
    d3.select('#bubbleChart').selectAll('g').remove();
    d3.select('#bubbleChart').style('visibility','visible');
    d3.select('#bubbleChart').select('text').text(null);
    d3.select('.mainLegend').style('visibility','hidden');
    d3.select('#timeline').style('visibility','hidden');
    d3.select('#container').style('visibility', 'hidden');
    d3.select('#homeTitleSpan').style('margin-right','2%');

    var svg = d3.select('#map');

    if(type===undefined) {
        var x1 = d3.scaleLinear()
            .domain([0, 12000000])
            .range([0, width / 3]);
        var fill = d3.scaleLinear()
            .domain([1, 12000000])
            .range([d3.rgb('#CFF09E'), d3.rgb('#0B486B')]);
    }
    else {
        var x1 = d3.scaleLinear()
            .domain([0, 3000000])
            .range([0,width/3]);
        var fill = d3.scaleLinear()
            .domain([0, 3000000])
            .range(['#D1C4E9','#4527A0']);
    }

    var legendAxis = d3.axisBottom()
        .ticks(3)
        .scale(x1)
        .tickSize(22);

    if(! d3.select('#legend').empty())
        var legend = d3.select('#legend').style('visibility','visible');
    else
        var legend = svg.append('g').attr('id','legend').attr("transform", "translate(10,20)")
            .attr('width','300px').style('visibility','visible');

    var data = legend.selectAll("rect").data(pair(x1.ticks(10)));

    data.attr("height", 20)
        .attr("x", function(d) { return x1(d[0]); })
        .attr("width", function(d) { return x1(d[1]) - x1(d[0]); })
        .style("fill", function(d) { return fill(d[0]); })
        .style('opacity',1);

    data.enter()
        .append("rect")
        .attr("height", 20)
        .attr("x", function(d) { return x1(d[0]); })
        .attr("width", function(d) { return x1(d[1]) - x1(d[0]); })
        .style("fill", function(d) { return fill(d[0]); })
        .style('opacity',1);

    data.exit().remove();

    legend.call(legendAxis);
    legend.select('path').remove();

    var dictionary = {
        "children": []
    };
    var dictDeath = [];

    if (type==='jewish') {
        for (var line in csv)
            if (csv[line]['Tags'] === 'holocaust-jewish')
                dictionary['children'].push({key: csv[line]['Nationality'], value: csv[line]['DeathsFinal']});
    }else
        for (var line in csv)
            dictionary['children'].push({key: csv[line]['Nationality'], value: csv[line]['DeathsFinal']});

    var groups = {};

    for (var i = 0; i < Object.values(dictionary)[0].length; i++) {
        var groupName = Object.values(dictionary)[0][i].key;
        if (!groups[groupName])
            groups[groupName] = [];
        else
            groups[groupName].push(Object.values(dictionary)[0][i].value)
    }

    var tt = [];
    for (var groupName in groups)
        tt.push({key: groupName, value: groups[groupName]})


    for (var groupName in tt)
        if (d3.sum(tt[groupName].value) > 0)
            dictDeath.push({key: tt[groupName].key, value: d3.sum(tt[groupName].value)});


    dict2 = {'children': dictDeath};
    var diameter = 350;

    if (type===undefined) {

        d3.select('#homeTitle').select('#title').remove();
        d3.select('#homeTitle').text('Distribution Of Deaths By Country');
        d3.json('TopoJsonFinal/February_1938.json', function (error, topology) {
            if (error) throw error;

            var colorScale = d3.scaleLog().domain([1100,12000000]).range([d3.rgb('#CFF09E'),d3.rgb('#0B486B')]);
            var geojson = topojson.feature(topology, topology.objects.February_1938);
            var svg = d3.select('#map').select('#gMap');

            svg.selectAll('path').remove();
            svg.selectAll("path")
                .data(geojson.features)
                .enter()
                .append('path')
                .style('fill', '#BDBDBD')
                .attr("d", path)
                .attr('id', function (d) {
                    return d.properties['name'];
                })
                .on('mouseover',function (d) {
                    d3.select('#bubbleChart').select('#'+d.properties.name).style('stroke','red').style('stroke-width', '5px');
                    d3.select('#bubbleChart').select('text').attr('x',30).attr('y',450).text('Total Deaths in '+d.properties.name.replace('_', ' ')+ ' : ' + ( ll[d.properties.name]===undefined?'Missing Value':ll[d.properties.name] ) );
                    d3.select(this).style('stroke','red').style('stroke-width', '3px');
                })
                .on('mouseout',function (d) {
                    d3.select('#bubbleChart').select('#'+d.properties.name).style('stroke','none');
                    d3.select(this).style('stroke','white').style('stroke-width', '0.25px');
                });

            let ll = {};
            dict2['children'].map(x => ll[x.key] = x.value);

            svg.selectAll('path')
                .transition()
                .duration(3000)
                .style('fill', function (d) {
                    if (Object.keys(ll).indexOf(d.properties['name']) === -1)
                        return '#BDBDBD';
                    else
                        return colorScale(ll[d.properties['name']]);
                });
        });
    }

    svg = d3.select('#bubbleChart')
        .attr('width', diameter)
        .attr('height', diameter*1.5)
        .append('g')
        .attr("transform", "translate(25, 50)");

    var bubble = d3.pack()
        .size([diameter, diameter])
        .padding(1.5);

    if (type === 'jewish') {
        var color = d3.scaleLog()
            .domain([800, 3000000]).range([d3.rgb('#D1C4E9'), d3.rgb('#4527A0')]);
        var nodes = d3.hierarchy(dictionary)
            .sum(function (d) {
                return d.value;
            });
    }
    else {
        var color = d3.scaleLog().domain([1100, 12000000]).range([d3.rgb('#CFF09E'), d3.rgb('#0B486B')]);
        var nodes = d3.hierarchy(dict2)
            .sum(function (d) {
                return d.value;
            });
    }
    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d) {
            return color(d.data.value);
        })
        .attr('id',function (d) {
            return d.data.key;
        });

    d3.select(self.frameElement)
        .style("height", diameter + "px");

    d3.select('#bubbleChart')
        .selectAll('circle')
        .on('mouseover',function (d) {console.log(d);tooltip.style("visibility", "visible"); tooltip.text(d.data.key+ ": " + d.data.value) })
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
}

function loadCSV() {
    d3.csv('WW2 Casualties - Incidents.csv', function (error, csvLines) {
        if (error)
            throw  error;
        csv = csvLines;
    });
}

function writeInfo(country) {

    var stinfo = d3.select('#stateInfo');
    if (stinfo.select('#stateText').empty())
        stinfo.append('text').attr('id','stateText').text(infos[country]).attr('x',10).attr('y', 70).call(wrap, 300);
    else
        d3.select('#stateText').text(infos[country]).attr('x',10).attr('y', 70).call(wrap, 320);
}

function loadStateInfo() {
    d3.json('stateInfos.json', function(error, list) {
        if (error) throw error;
        infos=list;
    });
}
