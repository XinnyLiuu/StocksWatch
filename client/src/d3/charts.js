let dataset;
let w = 1000;
let h = 500;
let svg;
let xScale, yScale, cScale;
let xAxis, yAxis;
let xAxisGroup, yAxisGroup;

let parseDate;

let dataURL = './sampledata.json';

// let key = d => d.date;

function initGraph() {
  // use require(dataURL) if building with Parcel
  d3.json(dataURL).then((data) => {
    parseDate = d3.timeParse("%Y-%m-%d");
    const entries = data["Time Series (Daily)"];
    let dataset = [];

    Object.keys(entries).forEach(d => {
        dataset.push({
            date: parseDate(d),
            high: entries[d]["2. high"],
            low: entries[d]["3. low"]
        });
    });
    console.table(dataset);

    svg = d3.select('#chart1')
    .attr('width', w)
    .attr('height', h);

    xScale = d3.scaleTime()
    .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
    .range([30, w-50]);

    yScale = d3.scaleLinear()
    .domain([d3.min(dataset, d => d.high), d3.max(dataset, d => d.high)])
    .range([h, 40]);
    
    cScale = d3.scaleLinear()
    .domain([0, 12])
    .range(['red', 'orange']);

    var lineFunction = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.high); });

    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.high) - 20)
      .attr('r', 2)
      .attr('fill', d => cScale(d.sleep)).append("path")
      .attr("d", lineFunction(dataset))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d"));
    yAxis = d3.axisLeft(yScale);

    xAxisGroup = svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0, ${h - 20})`)
      .call(xAxis);

    yAxisGroup = svg.append('g')
      .attr('class', 'axis-left1')
      .attr('transform', `translate(30,-20)`)
      .call(yAxis);
  })
}

window.onload = initGraph;