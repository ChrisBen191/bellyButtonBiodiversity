function buildMetadata(sample) {
  d3.json(`metadata/${sample}`).then(function (data) {
    // console.log(data);
    let myHtmlBlock = d3.select('#sample-metadata').html(" ");
    Object.keys(data).forEach(key => {
      myHtmlBlock.append('p').text(key + ": " + data[key]);
      // console.log(key);
    });
  })
}
////////////////////////////////////////////////////////////////////////////////
function buildCharts(sample) {
  // console.log(sample);
  let url = `samples/${sample}`; // this is really the ID of the person
  d3.json(url).then(function (data) {

    // pie chart values
    let myValues = data.sample_values.slice(0, 10);
    let myLabels = data.otu_ids.slice(0, 10);
    let myHoverText = data.otu_labels.slice(0, 10);

    // bubble chart values 
    let xValues = data.otu_ids;
    let yValues = data.sample_values;
    let textValues = data.otu_labels;

    // Plotly Pie Chart
    var data = [{
      values: myValues,
      labels: myLabels,
      hovertext: myHoverText,
      type: 'pie'
    }, ];
    Plotly.newPlot('pie', data);

    // Plotly Bubble Chart
    var trace1 = {
      x: xValues,
      y: yValues,
      text: textValues,
      mode: 'markers',
      marker: {
        color: xValues,
        size: yValues
      }
    };
    var data = [trace1];
    Plotly.newPlot('bubble', data);
  })
    // // Plotly Guage
    // let metadata = `metadata/${sample}`;
    // let wfreq = d3.json(metadata);
    // let wFreq = (wfreq["WFREQ"]);
    // console.log(wFreq);
    // var level = parseInt(wFreq) * 20;

    // // Trig to calc meter point
    // var degrees = 180 - level,
    //     radius = .5;
    // var radians = degrees * Math.PI / 180;
    // var x = radius * Math.cos(radians);
    // var y = radius * Math.sin(radians);

    // // Path: may have to change to create a better triangle
    // var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    //     pathX = String(x),
    //     space = ' ',
    //     pathY = String(y),
    //     pathEnd = ' Z';
    // var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // var data = [{ type: 'scatter',
    //   x: [0], y:[0],
    //     marker: {size: 28, color:'850000'},
    //     showlegend: false,
    //     name: 'Wash Frequency',
    //     text: level,
    //     hoverinfo: 'text+name'},
    //   { values: [50/9,50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9, 50],
    //   rotation: 90,
    //   text: ['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '1-0', ''],
    //   textinfo: 'text',
    //   textposition:'inside',
    //   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
    //                         'rgba(255, 255, 255, 0)']},
    //   labels: ['9-8', '8-7', '7-6', '6-5', '5-4', '4-3', '3-2', '2-1', '1-0', ''],
    //   hoverinfo: 'label',
    //   hole: .5,
    //   type: 'pie',
    //   showlegend: false
    // }];

    // var layout = {
    //   shapes:[{
    //       type: 'path',
    //       path: path,
    //       fillcolor: '850000',
    //       line: {
    //         color: '850000'
    //       }
    //     }],
    //   title: 'Gauge',
    //   height: 1000,
    //   width: 1000,
    //   xaxis: {zeroline:false, showticklabels:false,
    //             showgrid: false, range: [-1, 1]},
    //   yaxis: {zeroline:false, showticklabels:false,
    //             showgrid: false, range: [-1, 1]}
    // };

    // Plotly.newPlot('gauge', data, layout);





}
////////////////////////////////////////////////////////////////////////////////
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
//////////////////////////////////////////////////////////////////////////////// 
function optionChanged(newSample) {
  // receives the Id of the pesron who gave the sample
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
////////////////////////////////////////////////////////////////////////////////
// Initialize the dashboard
init();