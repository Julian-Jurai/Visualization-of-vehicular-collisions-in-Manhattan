function causationData (filter) {
  //grab coordinates from json

  let dataPoints = [];
  let excessiveDataPoints = [];

  vcData.forEach((item) => {
    let coord = [item["LATITUDE"], item["LONGITUDE"]]

    if ( item["CONTRIBUTING FACTOR VEHICLE 1"] === "Driver Inattention/Distraction"){
      excessiveDataPoints.push(coord);
    }

    if (item["CONTRIBUTING FACTOR VEHICLE 1"] !== "Driver Inattention/Distraction"){
      if (filter && item["CONTRIBUTING FACTOR VEHICLE 1"] === filter)
      {
        dataPoints.push(coord);
      } else if ( Boolean(filter)  === false ) {
        dataPoints.push(coord);
      }
    }

    if (excessiveDataPoints.length > 500){
      let randIndex = Math.floor(Math.random()*excessiveDataPoints.length);
      while (excessiveDataPoints.length > 500){
        excessiveDataPoints.splice(randIndex,1);
      }
    }

    dataPoints = dataPoints.concat(excessiveDataPoints);

  });





  //Sort based on LATITUDE
  dataPoints = dataPoints.sort((coord1, coord2) => {
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

  //iterate
  //if lat1 - lat2 <= 0.02  && lng1 - lng2 <= 0.02 DELETE
  let weight;
  for (let i = 0; i < dataPoints.length; i++) {
    weight = 1;
    for (let j = i + 1; j < dataPoints.length - 1; j++) {
      let lat1 = dataPoints[i][0];
      let lat2 = dataPoints[j][0];
      let long1 = dataPoints[i][1];
      let long2 = dataPoints[j][1];

      //if the difference isnt great enough reject that point and add a weight
      if (lat2 - lat1 <= 0.002 && long2 - long1 <= 0.002){
        dataPoints.splice(j,1);
        weight += 1;
      } 
    }
    //each coordinate has a weight
    dataPoints[i].push(weight);
  }
  return dataPoints;
}



window.dataPoints = causationData;
