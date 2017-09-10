function adjustData(filteredDataPoints) {

  if (filteredDataPoints.length > 4000){
    while (filteredDataPoints.length > 4000){
      randIndex = Math.floor(Math.random()*filteredDataPoints.length);
      filteredDataPoints.splice(randIndex,1);
    }
  }

  //Sort based on LATITUDE
  filteredDataPoints = filteredDataPoints.sort((coord1, coord2) => {
      let lat1 = coord1[0];
      let lat2 = coord2[0];
      let comparison;

      if (lat1 < lat2 ) {
        comparison = -1;
      }
      if (lat1 > lat2 ) {
        comparison = 1;
      }
      if (lat1 === lat2 ) {
        comparison = 0;
      }
      return comparison;
  });

  //if lat1 - lat2 <= 0.02  && lng1 - lng2 <= 0.02 DELETE
  let weight;
  let maxWeight = 0;

  for (let i = 0; i < filteredDataPoints.length; i++) {
    weight = 1;
    for (let j = i + 1; j < filteredDataPoints.length - 1; j++) {
      let lat1 = filteredDataPoints[i][0];
      let lat2 = filteredDataPoints[j][0];
      let long1 = filteredDataPoints[i][1];
      let long2 = filteredDataPoints[j][1];

      //if the difference isnt great enough reject that point and add a weight
      if (lat2 - lat1 <= 0.0001 && long2 - long1 <= 0.0005){
        filteredDataPoints.splice(j,1);
        weight += 1;
      }
    }
    //each coordinate has a weight
    //set max intensity
    if (maxWeight < weight) maxWeight = weight;
    window.maxWeight = maxWeight;
    //add weight to data point to create weighted point
    filteredDataPoints[i].push(weight);
  }

  return filteredDataPoints;
}

function causationData (filter) {

  if (timeLapseRunning()){
    return console.log("A time lapse is already in effect");
  }

  setDisplayValue(filter);

  let totalDataPoints = [];

  let distractionDataPoints = [];
  let cellPhoneDataPoints = [];
  let fellAsleepDataPoints = [];
  let unsafeSpeedsDataPoints = [];

  let excessiveDataPoints = [];
  let randIndex;

  vcData.forEach((item) => {
    let coord = [item["LATITUDE"], item["LONGITUDE"]];

    switch (item["CONTRIBUTING FACTOR VEHICLE 1"]) {
      case "Driver Inattention/Distraction":
        distractionDataPoints.push(coord);
        break;
      case "Cell Phone":
        cellPhoneDataPoints.push(coord);
        break;
      case "Unsafe Speed":
        unsafeSpeedsDataPoints.push(coord);
        break;
      case "Fell Asleep":
        fellAsleepDataPoints.push(coord);
        break;
    }
  });

  casuationDataPoints = {
    "Driver Inattention/Distraction":  distractionDataPoints,
    "Cell Phone":  cellPhoneDataPoints,
    "Unsafe Speed":  fellAsleepDataPoints,
    "Fell Asleep":  unsafeSpeedsDataPoints
  };

  //test
  window.cDP = {
    "Driver Inattention/Distraction": casuationDataPoints["Driver Inattention/Distraction"].length,
    "Cell Phone": casuationDataPoints["Cell Phone"].length,
    "Unsafe Speed": casuationDataPoints["Unsafe Speed"].length,
    "Fell Asleep": casuationDataPoints["Fell Asleep"].length
  };

  //test

  window.name = "Collisions";
  return adjustData(casuationDataPoints[filter]);
}

function dailyData(){

  if (timeLapseRunning()){
    return console.log("A time lapse is already in effect");
  }

  changeTimeLapseRunStatus();

  let heatmapData = [];
  let dailyDataPoints = {};
  let delay = 0;

  vcData.forEach((item) => {
    let coord = [item["LATITUDE"], item["LONGITUDE"]];
    let hr = parseInt(item["TIME"].split(":")[0]);

    if (dailyDataPoints[hr] === undefined){
      dailyDataPoints[hr] = [];
    }

    dailyDataPoints[hr].push(coord);

  });

  for (let time = 0; time < 24; time++) {

    heatmapData = dailyDataPoints[time];
    let displayText = time + ":" + "00";

    heatmapData = adjustData(heatmapData);
    addNewHeatMap(heatmapData,displayText, delay, {"count": time, "maxCount": 23});



    //test
    console.log(timeLapseRunning());
    //test

    delay += 1000;
    heatmapData = [];
  }
  window.name = "Collisions";
}

function annualData (yr) {

  if (timeLapseRunning()){
    return console.log("A time lapse is already in effect");
  }

  changeTimeLapseRunStatus();


  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  let annualDataPoints = [];
  let heatmapData = [];
  let delay = 0;

  vcData.forEach((item) => {
    if (yr === item["DATE"].slice(-4)){
      annualDataPoints.push(item);
    }
  });



  for (let month = 0; month < 12; month++) {
    //test//
    console.log(timeLapseRunning());
    //test//


    annualDataPoints.forEach(item =>{
      let itemMonth = parseInt((item["DATE"]).slice(0,2));
      let coord = [item["LATITUDE"], item["LONGITUDE"]];

      if (itemMonth === month + 1){
        heatmapData.push(coord);
      }
    });

    let displayText = monthNames[month] + " " + yr;
    if (heatmapData.length === 0 ) {
      displayText = "No data availble for" + " " + monthNames[month] + " " + yr;
    }
    heatmapData = adjustData(heatmapData);
    addNewHeatMap(heatmapData,displayText, delay, {"count": month, "maxCount": 11});



    delay += 1000;
    heatmapData = [];
  }//for
  window.name = "Collisions"; //for legend
}//namealData




function casualtyData (){

  if (timeLapseRunning()){
    return console.log("A time lapse is already in effect");
  }

  let casualtyDataPoints = [];
  let heatmapData = [];
  let allCasualites = [];
  let avgCasualties;

  function casualtyCount(item){
    let numCasualties = 0;
    const cases = [
      "NUMBER OF PERSONS INJURED",
      "NUMBER OF PERSONS KILLED",
      "NUMBER OF PEDESTRIANS INJURED",
      "NUMBER OF PEDESTRIANS KILLED",
      "NUMBER OF CYCLIST INJURED",
      "NUMBER OF CYCLIST KILLED",
      "NUMBER OF MOTORIST INJURED",
      "NUMBER OF MOTORIST KILLED"
    ];

    cases.forEach((caseItem)=>{
      numCasualties += parseInt(item[caseItem]);
    });

    return numCasualties;
  }// casualtyCount

    let maxCasaulties = 0;
  vcData.forEach((item) => {
    let coord = [item["LATITUDE"], item["LONGITUDE"]];
    let totalCasaulties = casualtyCount(item);

    if (maxCasaulties < totalCasaulties) maxCasaulties = totalCasaulties;

    if (totalCasaulties > 0) {
      allCasualites.push(totalCasaulties);
      coord.push(totalCasaulties);
      casualtyDataPoints.push(coord);
    }
  });

  let sum = allCasualites.reduce((sum, value) =>(sum + value), 0);

  avgCasualties =  (sum) / allCasualites.length ;
  console.log(avgCasualties);

  casualtyDataPoints.forEach(coord =>{
    // if( coord[2] >= avgCasualties)
    heatmapData.push(coord);
  });

  //test

  //test
  window.name = "Casualties";
  window.maxWeight = maxCasaulties;
  addNewHeatMap(heatmapData,"Total Casualties", 0, {"pulsate": true});

}

function changeTimeLapseRunStatus(){
  if (window.timeLapseStatus !== undefined){
    window.timeLapseStatus = !window.timeLapseStatus;
  } else window.timeLapseStatus = true;
}

function timeLapseRunning(){
  if (window.timeLapseStatus === true){
    return true;
  } else return false;
}



function addNewHeatMap (heatmapData, displayText, delay, options = {}){
  setTimeout(()=>{
    clearHeatmap ();
    setDisplayValue(displayText);
    createHeatmap(heatmapData,options);

    if (options["count"] === options["maxCount"]){
      changeTimeLapseRunStatus();

      //test//
      console.log(timeLapseRunning());
      //test/
    }
  }, delay);
}

function setDisplayValue(displayText){
  let displayTextDiv = document.getElementById("display-text");
  displayTextDiv.innerHTML = displayText;
}





window.dailyData = dailyData;
window.setDisplayValue = setDisplayValue;
window.causationData = causationData;
window.displayText = "";
window.casualtyData = casualtyData;
