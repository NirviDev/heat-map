function chartBar(dataset) {
  let month = dataset.monthlyVariance.map((d) => (d.month -= 1));

  let description = d3
    .selectAll("h3")
    .html(
      dataset.monthlyVariance[0].year +
        " - " +
        dataset.monthlyVariance[dataset.monthlyVariance.length - 1].year +
        ": base temperature " +
        dataset.baseTemperature +
        "&#8451;"
    );

  let colors = [
    "#002a7f",
    "#2d4790",
    "#4865a0",
    "#6185b0",
    "#7ba5bf",
    "#99c5cd",
    "#bde5da",
    "#ffffe0",
    "#ffd3bf",
    "#fea59c",
    "#ee7b7d",
    "#d65461",
    "#b63046",
    "#90102e",
    "#640018",
  ];

  let tempBreak = [
    "2.4976",
    "3.3112",
    "4.1248",
    "4.9384",
    "5.752",
    "6.5656",
    "7.3792",
    "8.1928",
    "9.0064",
    "9.82",
    "10.6336",
    "11.4472",
    "12.2608",
    "13.0744",
    "13.888",
  ];

  let width = 5 * Math.ceil(dataset.monthlyVariance.length / 12),
    height = 35 * 12,
    padding = 60;

  let xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset.monthlyVariance, (d) => d.year),
      d3.max(dataset.monthlyVariance, (d) => d.year),
    ])
    .range([0, width]);

  let yScale = d3
    .scaleBand()
    .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    .rangeRound([height, 0])
    .padding(0.1);

  let tooltip = d3
    .select(".diagram-canvas")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  let svg = d3
    .select(".diagram-canvas")
    .append("svg")
    .attr("width", width + padding * 2)
    .attr("height", height + padding * 2);

  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  let yAxis = d3.axisLeft(yScale).tickFormat(function (month) {
    var date = new Date();
    date.setUTCMonth(month);
    return d3.timeFormat("%B")(date);
  });

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr(
      "transform",
      "translate(" + padding * 1.5 + "," + (height + padding / 3) + ")"
    );
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding * 1.5 + "," + padding / 3 + ")");

  svg
    .selectAll("rect")
    .attr("map", true)
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => dataset.baseTemperature + d.variance)
    .attr("x", (d) => xScale(d.year) + padding * 1.5 + 1)
    .attr("y", (d) => yScale(d.month) + padding / 3)
    .attr("width", 5)
    .attr("height", 35)
    .attr("fill", function (d) {
      let temp = d.variance + 8.66;
      switch (true) {
        case temp <= 2.4976:
          return colors[0];
          break;
        case temp <= 3.3112:
          return colors[1];
          break;
        case temp <= 4.1248:
          return colors[2];
          break;
        case temp <= 4.9384:
          return colors[3];
          break;
        case temp <= 5.752:
          return colors[4];
          break;
        case temp <= 6.5656:
          return colors[5];
          break;
        case temp <= 7.3792:
          return colors[6];
          break;
        case temp <= 8.1928:
          return colors[7];
          break;
        case temp <= 9.0064:
          return colors[8];
          break;
        case temp <= 9.82:
          return colors[9];
          break;
        case temp <= 10.6336:
          return colors[10];
          break;
        case temp <= 11.4472:
          return colors[11];
          break;
        case temp <= 12.2608:
          return colors[12];
          break;
        case temp <= 13.0744:
          return colors[13];
          break;
        case temp <= 14:
          return colors[14];
          break;
        default:
          return "black";
      }
    })
    .on("mouseover", function (d, i) {
      let date = new Date(d.year, d.month);
      d3.select(this).attr("border", 1).attr("stroke", "black");
      tooltip.transition().duration(200).style("opacity", 0.8);
      tooltip
        .html(
          d3.timeFormat("%Y - %B")(date) +
            "<br/>" +
            "Temperature: " +
            d3.format(".2f")(dataset.baseTemperature + d.variance) +
            "&#8451;" + "<br/>" +
            "Variance: " +
            d3.format(".2f")(d.variance) +
            "&#8451;"
        )
        .attr("data-year", d.year)
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 100 + "px");
    })
    .on("mouseout", function (d, i) {
      d3.select(this).attr("border", "").attr("stroke", "");
      tooltip.transition().duration(200).style("opacity", 0);
    });

  let legendScale = d3
    .scaleLinear()
    .domain([
      d3.min(
        dataset.monthlyVariance,
        (d) => d.variance + dataset.baseTemperature
      ),
      d3.max(
        dataset.monthlyVariance,
        (d) => d.variance + dataset.baseTemperature
      ),
    ])
    .range([0, tempBreak.length * 35]);

  let legendAxis = d3
    .axisBottom(legendScale)
    .tickValues(tempBreak)
    .tickFormat(d3.format(".1f"));

  let legend = svg.append("g").attr("id", "legend");

  legend
    .selectAll("rect")
    .data(tempBreak)
    .enter()
    .append("rect")
    .attr("x", (d) => legendScale(d))
    .attr("width", 35)
    .attr("height", 30)
    .attr("transform", "translate(" + 55 + "," + (height + padding) + ")")
    .attr("fill", (d, i) => colors[i]);

  legend
    .append("g")
    .attr("id", "legend-axis")
    .call(legendAxis)
    .attr(
      "transform",
      "translate(" +
        (padding + padding / 2) +
        "," +
        (height + padding + padding / 2) +
        ")"
    );
}

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  function (error, data) {
    if (error) throw error;
    let dataset = data;
    chartBar(dataset);
    console.log(dataset);
  }
);
