d3.json("data/samples.json").then((importedData) => {
    
    console.log(importedData);

    var data = importedData;

    var names = data.names;

    names.forEach((name) => {
        d3.select("#selDataset").append("option").text(name);

    });
});