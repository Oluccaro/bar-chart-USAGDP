const projectName = 'Bar-chart-USA-GDP';

/*Here we're going to get the dataset to use on our datachart */
//Here is our data URL;

const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// This will fetch the data as soon as the the document load;

async function getData(url){
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function main(){
  
  //set the data and choose size, scale and padding
  
  let gdpData = await getData(dataURL);
  gdpData = gdpData.data;
  const w = 1000 ;
  const h = 480;
  const p = 50; // padding
  //This function transform a date string in the format YYYY/MM/DD and return the year and the month, then convert in the year form
  const yearRgx = /^\d{4}-\d{2}/
  function getYear(strYear){
    let year = strYear.match(yearRgx);
    year = year[0].replace('-01','00').replace('-04','25').replace('-07','50').replace('-10','75');
    year = parseInt(year)/100;
    return year;
  }  

  //___________________________________________
  
 let firstYear = getYear(gdpData[0][0]);
 let lastYear = getYear(gdpData[gdpData.length-1][0]);
 const scale = d3.max(gdpData, (d)=>d[1])/h;
 const xScale = d3.scaleLinear()
                  .domain([firstYear, lastYear])
                  .range([p,w-p])
  const yScale = d3.scaleLinear()
                   .domain([0,d3.max(gdpData,(d)=>d[1])])
                   .range([h,p]) 
  //append a body element
  
  const svg = d3.select("#chart")
                .append("svg")
                .attr("width", w+50)
                .attr("height", h+30)
                .attr("id", "bar-chart");
  
  var tooltip = d3.select("#chart").append("div")
                    .attr("class", "tooltip-class")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
        
  
  
  //put the bars on the screen
  
  svg.selectAll("rect")
     .data(gdpData)
     .enter()
     .append("rect")
     .attr("x", (d,i) => 50+xScale(getYear(d[0])))
     .attr("y", (d,i) => yScale(d[1]))
     .attr("width", (d,i) => w/gdpData.length)
     .attr("height", (d,i) => d[1]/42)
     .attr("fill", "steelblue")
     .attr("class", "bar")
     .attr("id", (d,i)=>`bar-${i}`)
     .attr("data-date",(d)=>d[0])
     .attr("data-gdp", (d)=>d[1])
     .on("mouseover", (event, d)=>{
        tooltip.attr("data-date",d[0])
        tooltip.transition()
               .duration(200)
               .style("opacity", 0.9)
               .style("background-color", "steelblue")
        tooltip.html("<p id='data-text'>" + d[0].substring(0,7).replace('-01', " 1st Quarter").replace("-04"," 2nd Quarter").replace("-07"," 3rd Quarter").replace("-10", " 4th Quarter") + "<br />" + "$ " + d[1] + " Billions" + "</p>" )})
     .on("mouseout", ()=>{
        tooltip.transition()
               .duration(200)
               .style("opacity", 0)
  });
  
  //put the x amd y axis;
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
  svg.append("g")
     .attr("transform", "translate(50," +h + ")")
     .attr("id", "x-axis")
     .call(xAxis)
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
     .attr("transform", "translate("+(p+50)+",3)")
     .attr("id","y-axis")
     .call(yAxis)
  
}

main();