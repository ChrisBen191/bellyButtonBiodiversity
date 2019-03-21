function buildMetadata(sample) {
  d3.json(`metadata/${sample}`).then(function (data) {
    console.log(data);
    let myHtmlBlock = d3.select('#sample-metadata').html(" ");
    // var wFreq = data.wfreq;
    // console.log(wFreq);
    Object.keys(data).forEach(key => {
      myHtmlBlock.append('p').text(key + ": " + data[key]);
      console.log(key);
    });
  })
}

function buildCharts(sample) {
  console.log(sample);
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
}

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

function optionChanged(newSample) {
  // receives the Id of the pesron who gave the sample


  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();