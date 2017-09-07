function causationData (filter) {
  //grab coordinates from json

  let totalDataPoints = [];
  let excessiveDataPoints = [];
  let randIndex
  vcData.forEach((item) => {

    let coord = [item["LATITUDE"], item["LONGITUDE"]]

    // if (filter && item["CONTRIBUTING FACTOR VEHICLE 1"] === filter){
    //   totalDataPoints.push(coord);
    // } else if ( Boolean(filter)  === false ) {totalDataPoints.push(coord);}

    if ( item["CONTRIBUTING FACTOR VEHICLE 1"] === "Driver Inattention/Distraction"){
      excessiveDataPoints.push(coord);
    }

    if (item["CONTRIBUTING FACTOR VEHICLE 1"] !== "Driver Inattention/Distraction"){

      if (filter && item["CONTRIBUTING FACTOR VEHICLE 1"] === filter)
      {
        totalDataPoints.push(coord);
      } else if ( Boolean(filter)  === false ) {
        totalDataPoints.push(coord);
      }

    }
  });

  // filter excess
  if (excessiveDataPoints.length > 4000){

    while (excessiveDataPoints.length > 4000){
      randIndex = Math.floor(Math.random()*excessiveDataPoints.length);
      excessiveDataPoints.splice(randIndex,1);
    }
  }

  if ( Boolean(filter)  === false){
    totalDataPoints = totalDataPoints.concat(excessiveDataPoints);
  } else if ( filter  === "Driver Inattention/Distraction" ){
    totalDataPoints = excessiveDataPoints;
  }


  // totalDataPoints = totalDataPoints.concat(excessiveDataPoints);

  //Sort based on LATITUDE
  totalDataPoints = totalDataPoints.sort((coord1, coord2) => {
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
  let maxWeight = 0;

  for (let i = 0; i < totalDataPoints.length; i++) {
    weight = 1;
    for (let j = i + 1; j < totalDataPoints.length - 1; j++) {
      let lat1 = totalDataPoints[i][0];
      let lat2 = totalDataPoints[j][0];
      let long1 = totalDataPoints[i][1];
      let long2 = totalDataPoints[j][1];

      //if the difference isnt great enough reject that point and add a weight
      if (lat2 - lat1 <= 0.0002 && long2 - long1 <= 0.0002){
        totalDataPoints.splice(j,1);
        weight += 1;
      }
    }
    //each coordinate has a weight
    //set max intensity
    if (maxWeight < weight) maxWeight = weight;

    window.maxWeight = maxWeight;
    //add weight to data point to create weighted point
    totalDataPoints[i].push(weight);
  }

  return totalDataPoints;
}



window.dataPoints = causationData;
