const margin = {top: 40, right: 90, bottom: 30, left: 40};
const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const data = [
    {
        time: "2024-08-01 12:00",
        open: 110,
        close: 114,
        prices: [
            { price: 110, bidVolume: 30, askVolume: 25, keepVolume: 15 },
            { price: 111, bidVolume: 20, askVolume: 15, keepVolume: 15 },
            { price: 112, bidVolume: 10, askVolume: 10, keepVolume: 10 },
            { price: 113, bidVolume: 30, askVolume: 20, keepVolume: 10 },
            { price: 114, bidVolume: 40, askVolume: 25, keepVolume: 15 }
        ]
        
    },
    {
        time: "2024-08-01 12:05",
        open: 105,
        close: 118,
        prices: [
            { price: 105, bidVolume: 15, askVolume: 15, keepVolume: 15 },
            { price: 106, bidVolume: 15, askVolume: 10, keepVolume: 10 },
            { price: 107, bidVolume: 25, askVolume: 15, keepVolume: 15 },
            { price: 108, bidVolume: 10, askVolume: 10, keepVolume: 5 },
            { price: 109, bidVolume: 35, askVolume: 20, keepVolume: 10 }
        ]
    },
    {
        time: "2024-08-01 12:10",
        open: 100,
        close: 104,
        prices: [
            { price: 100, bidVolume: 20, askVolume: 15, keepVolume: 15 },
            { price: 101, bidVolume: 10, askVolume: 10, keepVolume: 10 },
            { price: 102, bidVolume: 5, askVolume: 10, keepVolume: 5 },
            { price: 103, bidVolume: 15, askVolume: 15, keepVolume: 10 },
            { price: 104, bidVolume: 25, askVolume: 20, keepVolume: 15 }
        ]
    },
    {
        time: "2024-08-01 12:15",
        open: 125,
        close: 129,
        prices: [
            { price: 125, bidVolume: 30, askVolume: 20, keepVolume: 15 },
            { price: 126, bidVolume: 25, askVolume: 15, keepVolume: 15 },
            { price: 127, bidVolume: 15, askVolume: 10, keepVolume: 10 },
            { price: 128, bidVolume: 20, askVolume: 15, keepVolume: 10 },
            { price: 129, bidVolume: 35, askVolume: 25, keepVolume: 15 }
        ]
    },
    {
        time: "2024-08-01 12:20",
        open: 120,
        close: 124,
        prices: [
            { price: 120, bidVolume: 15, askVolume: 10, keepVolume: 15 },
            { price: 121, bidVolume: 20, askVolume: 20, keepVolume: 10 },
            { price: 122, bidVolume: 30, askVolume: 20, keepVolume: 10 },
            { price: 123, bidVolume: 15, askVolume: 15, keepVolume: 15 },
            { price: 124, bidVolume: 35, askVolume: 20, keepVolume: 15 }
        ]
    }
];


const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add title to the chart
svg.append("text")
    .attr("x", width / 2) 
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle") 
    .attr("font-size", "1.2em")
    .attr("font-weight", "bold") 
    .attr("fill", "white") 
    .text("Footprint Chart");

// Adjust the xScale and yScale
const xScale = d3.scaleBand()
    .domain(data.map(d => d.time))
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d3.min(d.prices, p => p.price)), d3.max(data, d => d3.max(d.prices, p => p.price))])
    .range([height, 0]);

const volumeScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(d.prices, p => p.bidVolume + p.askVolume + p.keepVolume))])
    .range([0, xScale.bandwidth()]);

const footprintGroups = svg.selectAll(".footprint-group")
    .data(data)
    .enter().append("g")
    .attr("class", "footprint-group")
    .attr("transform", d => `translate(${xScale(d.time)}, 0)`);

footprintGroups.selectAll(".bar")
    .data(d => d.prices)
    .enter().append("rect")
    .attr("class", "bid-bar")
    .attr("x", 0)
    .attr("y", d => yScale(d.price))
    .attr("width", d => volumeScale(d.bidVolume))
    .attr("height", 10)
    .attr("fill", "#1A77B8");

footprintGroups.selectAll(".bar")
    .data(d => d.prices)
    .enter().append("rect")
    .attr("class", "ask-bar")
    .attr("x", d => volumeScale(d.bidVolume))
    .attr("y", d => yScale(d.price))
    .attr("width", d => volumeScale(d.askVolume))
    .attr("height", 10)
    .attr("fill", "#C13C37");

// Optional: Uncomment these if needed
// footprintGroups.selectAll(".bar")
//     .data(d => d.prices)
//     .enter().append("rect")
//     .attr("class", "keep-bar")
//     .attr("x", d => volumeScale(d.bidVolume + d.askVolume))
//     .attr("y", d => yScale(d.price))
//     .attr("width", d => volumeScale(d.keepVolume))
//     .attr("height", 10)
//     .attr("fill", "gray");

// footprintGroups.selectAll(".bar")
//     .data(d => d.prices.filter(p => p.price >= d.open && p.price <= d.close))
//     .enter().append("rect")
//     .attr("class", "highlight-bar")
//     .attr("x", 0)
//     .attr("y", d => yScale(d.price) - 15)
//     .attr("width", d => volumeScale(d.bidVolume + d.askVolume + d.keepVolume))
//     .attr("height", 5)
//     .attr("fill", "green");

// Append text for bidVolume
footprintGroups.selectAll(".bid-text")
    .data(d => d.prices)
    .enter().append("text")
    .attr("class", "bid-text")
    .attr("x", d => volumeScale(d.bidVolume) / 2)
    .attr("y", d => yScale(d.price) + 5)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(d => d.bidVolume)
    .style("font-size", "0.675em");

// Append text for askVolume
footprintGroups.selectAll(".ask-text")
    .data(d => d.prices)
    .enter().append("text")
    .attr("class", "ask-text")
    .attr("x", d => volumeScale(d.bidVolume) + volumeScale(d.askVolume) / 2)
    .attr("y", d => yScale(d.price) + 5)
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(d => d.askVolume)
    .style("font-size", "0.675em");

// Add x-axis and y-axis
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .attr("class", "x-axis");

svg.append("g")
    .attr("transform", `translate(${width}, 0)`)
    .call(d3.axisRight(yScale))
    .attr("class", "y-axis");

// Style the axes and labels
svg.selectAll(".x-axis path, .x-axis line")
    .attr("stroke", "gray");

svg.selectAll(".x-axis text")
    .attr("fill", "gray");

svg.selectAll(".y-axis path, .y-axis line")
    .attr("stroke", "gray");

svg.selectAll(".y-axis text")
    .attr("fill", "gray");

// Add horizontal crosshair line
const crosshair = svg.append("line")
    .attr("class", "crosshair")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height / 2)
    .attr("y2", height / 2)
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4,4")
    .style("opacity", 0);

// Add tooltip div
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("padding", "5px")
    .style("border-radius", "0.5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

// Mouseover and mousemove event handlers
svg.on("mousemove", function(event) {
    const [x, y] = d3.pointer(event);
    const yValue = yScale.invert(y);

    // Update the crosshair and tooltip position
    crosshair
        .attr("y1", y)
        .attr("y2", y)
        .style("opacity", 1);

    tooltip
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .style("opacity", 1)
        .html(`${yValue.toFixed(2)}`);
});

svg.on("mouseleave", function() {
    crosshair.style("opacity", 0);
    tooltip.style("opacity", 0);
});















































            //   const data = [
            //     {
            //         time: "2024-08-01 12:00",
            //         open: 100,
            //         close: 104,
            //         prices: [
            //             { price: 100, volume: 50 },
            //             { price: 101, volume: 30 },
            //             { price: 102, volume: 20 },
            //             { price: 103, volume: 40 },
            //             { price: 104, volume: 60 }
            //         ]
            //     },
            //     {
            //         time: "2024-08-01 12:05",
            //         open: 105,
            //         close: 118,
            //         prices: [
            //             { price: 105, volume: 45 },
            //             { price: 106, volume: 35 },
            //             { price: 107, volume: 55 },
            //             { price: 108, volume: 25 },
            //             { price: 109, volume: 65 }
            //         ]
            //     },
            //     {
            //         time: "2024-08-01 12:10",
            //         open: 110,
            //         close: 114,
            //         prices: [
            //             { price: 110, volume: 70 },
            //             { price: 111, volume: 50 },
            //             { price: 112, volume: 30 },
            //             { price: 113, volume: 60 },
            //             { price: 114, volume: 80 }
            //         ]
            //     },
            //     {
            //         time: "2024-08-01 12:15",
            //         open: 120,
            //         close: 124,
            //         prices: [
            //             { price: 120, volume: 40 },
            //             { price: 121, volume: 50 },
            //             { price: 122, volume: 60 },
            //             { price: 123, volume: 45 },
            //             { price: 124, volume: 70 }
            //         ]
            //     },
            //     {
            //         time: "2024-08-01 12:20",
            //         open: 125,
            //         close: 129,
            //         prices: [
            //             { price: 125, volume: 65 },
            //             { price: 126, volume: 55 },
            //             { price: 127, volume: 35 },
            //             { price: 128, volume: 45 },
            //             { price: 129, volume: 75 }
            //         ]
            //     }
            // ];
            
            
            
            // const xScale = d3.scaleBand()
            //     .domain(data.map(d => d.time))
            //     .range([0, width])
            //     .padding(0.1);
            
            // const yScale = d3.scaleLinear()
            //     .domain([d3.min(data, d => d3.min(d.prices, p => p.price)), d3.max(data, d => d3.max(d.prices, p => p.price))])
            //     .range([height, 0]);
            
            // const volumeScale = d3.scaleLinear()
            //     .domain([0, d3.max(data, d => d3.max(d.prices, p => p.volume))])
            //     .range([0, xScale.bandwidth()]);
            
            
            //  const footprintGroups = svg.selectAll(".footprint-group")
            //     .data(data)
            //     .enter().append("g")
            //     .attr("class", "footprint-group")
            //     .attr("transform", d => `translate(${xScale(d.time)}, 0)`);
            
            // footprintGroups.selectAll(".bar")
            //     .data(d => d.prices)
            //     .enter().append("rect")
            //     .attr("class", "bar")
            //    // .attr("x", d => xScale.bandwidth() / 2 - volumeScale(d.volume) / 2)
            //    .attr("x", 0)
            //     .attr("y", d => yScale(d.price))
            //     .attr("width", d => volumeScale(d.volume))
            //    // .attr("height", yScale.bandwidth())
            //    .attr("height",  10)
            //     .attr("fill", "steelblue");
            
            // footprintGroups.selectAll(".bar")
            //     .data(d => d.prices.filter(p => p.price >= d.open && p.price <= d.close))
            //     .enter().append("rect")
            //     .attr("class", "bar")
            //    //.attr("x", d => xScale.bandwidth() / 2 - volumeScale(d.volume) / 2)
            //    .attr("x", 0)
            //     .attr("y", d => yScale(d.price))
            //    .attr("width", d => volumeScale(d.volume))
            //     //.attr("height", yScale.bandwidth())
            //    .attr("height", 15)
            //     .attr("fill", d => d.price >= d.open && d.price <= d.close ? "green" : "red");
            
            //     svg.append("g")
            //     .attr("transform", `translate(0, ${height})`)
            //     .call(d3.axisBottom(xScale));
            
            // svg.append("g")
            //     .call(d3.axisLeft(yScale));
            
            
            