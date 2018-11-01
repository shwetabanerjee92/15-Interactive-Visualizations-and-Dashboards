function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample using the flask route
    // Use d3 to select the panel with id of `#sample-metadata`
    // Write function to handle success and error cases

  d3.json("/metadata/" + sample).then(successHandle).catch(errorHandle);


  function successHandle(results){
    console.log(results );
    var resultsObj = Object.entries(results);
    console.log( 'resultsObj :', resultsObj);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    
    Object.entries(results).forEach(function(currentItem , index){
      console.log(`currentItem : index ${index} : `, currentItem);

      // Append new tags for the key-value pairs in the metadata
      panel.append("div").text(`${currentItem[0]}: ${currentItem[1]}`).style("font-size", "12px").style("font-weight", "bold")
    
    })
  };

  function errorHandle(error){
    console.log(error);
  };

}

function buildCharts(sample) {
    //  Use `d3.json` to fetch the sample data for the plots using the flask route
    // Write  function to handle success and error cases
  d3.json("/samples/" + sample).then(successFunction).catch(errorFunction);

  function successFunction(data){
    // print json data returned from the route
    console.log(data)
    console.log(data.otu_ids)
    console.log(data.sample_values)
    console.log(data.otu_labels)

// Declare trace to make bubble chart
    var trace1 = {
      x : data.otu_ids,
      y : data.sample_values,
      type: 'scatter', 
      mode: 'markers',
      marker : { 
        color : data.otu_ids,
        size : data.sample_values,
        colorscale :'Earth'
      },
      hoverinfo :`${data.otu_ids} : ${data.otu_labels} `,
    };
    
    var dataChart = [trace1];
    
    var layout = {
     xaxis: {title: 'OTU ID'}

    };
    
// Use Plotly to make the bubble chart
    Plotly.newPlot("bubbleChart", dataChart, layout);

     // Build a Pie Chart
    // Use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


    // Declare trace to make pie chart
    var trace2 = {
      type : "pie",
      values : data.sample_values.slice(0,10),
      labels : data.otu_ids.slice(0, 10),
      textinfo : "percent",
      text : data.otu_labels.slice(0, 10),
      hoverinfo : "label,text,value,percent"
    }

    var dataPie = [trace2]

    // Use Plotly to make the pie chart
    Plotly.newPlot("pie", dataPie)
    
    }
  
  function errorFunction(error){
    console.log(error)
  }

}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options using the flask route
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
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
