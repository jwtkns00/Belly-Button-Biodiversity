  // Grab reference to dropdown select element

  var selector = d3.select("#selDataset");

  // Use list of sample names to populate select options

  d3.json("samples.json").then((data) => {

	console.log(data);

	var names = data.names;
	
    names.forEach((sample) => {
        selector
        .append("option")
        .text(sample)
        .attr("value", sample);
	});
	
    // Use first sample from list to build initial plots

    var firstSample = names[0];
    
    buildCharts(firstSample);
    metadata(firstSample);
  });

function metadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
        // Loop through array of objects then each object
		var filtered = metadata.filter((item) => item.id == sample);
		
		console.log(filtered[0]);
		
        // Then, select unordered list element by class name
        var list = d3.select("#sample-metadata");
        // Clear any existing data
        list.html("");

        // Display sample metadata
        // Append id data to dropdown menu

        list.append("li").text(filtered[0].id);
        list.append("li").text(filtered[0].ethnicity);
        list.append("li").text(filtered[0].gender);
        list.append("li").text(filtered[0].age);
        list.append("li").text(filtered[0].location); 
        
  });
}

function buildCharts(sample) {
d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var sample_id = samples.filter(item => item.id == sample);
  var result = sample_id[0];
  
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;
  var sample_values = result.sample_values;
  var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

  // Build BarChart
   
  var trace1 = [
  {
    y: yticks,
    x: sample_values.slice(0, 10).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
	  orientation: "h",
	  marker: {
		color: 'lightblue',
	}
  }
  ];

  var barLayout = {
  title: "Top 10 Bacteria Cultures Found",
  font:{
      family: 'Arial'
  },
  margin: { t: 30, l: 150 },
  xaxis: { 
	  title: "Sample Value",
	},
  yaxis: { 
	  title: "OTU ID",
  }
  };

  // Render plot to div tag with id "bar"
  Plotly.newPlot("bar", trace1, barLayout);

  // Build Bubble Chart
  
  var trace2 = [
  {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
	      color: otu_ids,
        colorscale: "YlGnBu"
      }
  }
];

  var bubbleChartLayout = {
    title: "Bacteria Cultures Per Sample",
    margin: { t: 0 },
    hovermode: "closest",
	  xaxis: { title: "OTU ID" },
    margin: { t: 40 }
    };
 
  Plotly.newPlot("bubble", trace2, bubbleChartLayout);
  
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
metadata(newSample);
}