function setScale() {

  let scale = document.getElementById("scale-values");
  let scaleName = document.getElementById("scale-name");
  let values = [1];
  let range = window.maxWeight - 1;


  for (let i = 0; i < 5; i++) {
    let nextInt = Math.floor(values[values.length-1] + (range / 3));
    if (nextInt < maxWeight && !values.includes(nextInt)) values.push(nextInt);
  }

  if (window.maxWeight === 3) values.push(2);
  if (!values.includes(window.maxWeight)) values.push(window.maxWeight);
  if (values.length === 1) values.unshift(" ");


  scale.innerHTML = "";
  values.forEach(int => {
    let div1 = document.createElement("div");
    let textnode = document.createTextNode(int);
    div1.appendChild(textnode);
    scale.appendChild(div1);
  });

  scaleName.innerHTML = "";
  let div2 = document.createElement("div");
  let scaleNameNode = document.createTextNode(window.name);
  div2.appendChild(scaleNameNode);
  scaleName.appendChild(div2);

}

window.setScale = setScale;


function initMap(filter) {

  let heatmapData = [];
  let map;

  if (filter === undefined) filter = "Driver Inattention/Distraction";
  causationData(filter).forEach((coord) => {
    heatmapData.push(coord);
  });

  // setScale(); //adjust scale based on weighted value found in casuationData()

  let manhattan = new google.maps.LatLng(
    40.76265583125568, -73.95353579345702
  );

  styledMapType = new google.maps.StyledMapType ([
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "road.local",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ],{name: 'Night Mode'});

  map = new google.maps.Map(document.getElementById('map'), {
    center: manhattan,
    zoom: 13,
    mapTypeId: 'styled_map',
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite','styled_map']
    }
  });

  map.mapTypes.set('styled_map', styledMapType);

  window.map = map;

  createHeatmap(heatmapData);

}



function createHeatmap(heatmapData,options = {}){

  setScale();

  let parsedHeatmapData = [];
  heatmapData.forEach(coord => {
    parsedHeatmapData.push(
    {location: new google.maps.LatLng(coord[0], coord[1]), weight: coord[2]}

  );
  });


  let heatmap =  new google.maps.visualization.HeatmapLayer({
    data: parsedHeatmapData
  });

  window.heatmap = heatmap;




  let gradient = [
    "rgba(102, 255, 0, 0)",
    "rgba(102, 255, 0, 1)",
    "rgba(147, 255, 0, 1)",
    "rgba(193, 255, 0, 1)",
    "rgba(238, 255, 0, 1)",
    "rgba(244, 227, 0, 1)",
    "rgba(249, 198, 0, 1)",
    "rgba(255, 170, 0, 1)",
    "rgba(255, 113, 0, 1)",
    "rgba(255, 57, 0, 1)",
    "rgba(255, 0, 0, 1)"
  ];

  let gradient2= [
    "rgba(102, 255, 0, 0)",
    "rgba(102, 255, 0, 1)",
    "rgba(147, 255, 0, 1)",
    "rgba(193, 255, 0, 1)",
    "rgba(238, 255, 0, 1)",

    "rgba(244, 227, 0, 1)",
    "rgba(249, 198, 0, 1)",


    "rgba(255, 113, 0, 1)",
    "rgba(255, 57, 0, 1)",
    "rgba(255, 57, 0, 1)",
    "rgba(255, 0, 0, 1)",
    "rgba(255, 0, 0, 1)"
  ];
  // let gradient2= [
  //   "rgba(102, 255, 0, 0)",
  //   "rgba(102, 255, 0, 1)",
  //   "rgba(255, 113, 0, 1)",
  //   "rgba(255, 57, 0, 1)",
  //   "rgba(255, 0, 0, 1)"
  // ];


  heatmap.setOptions({
         gradient: gradient, //from window
         // set other options
         maxIntensity: maxWeight, //from window
        //  opacity: 0.8, //The opacity of the heatmap
        //  radius: 10, //The radius of influence for each data point, in pixels.
        //  dissipating: false    //Specifies whether heatmaps dissipate on zoom
     });

  heatmap.setMap(window.map); //map from window

  function toggleGradients(){
    let newGradient;
    if (heatmap.get('gradient').length === 11) {
      heatmap.set('gradient',gradient2);
    } else heatmap.set('gradient',gradient);
  }

  //test
  window.toggleGradients = toggleGradients;
  //test


  if (options["pulsate"] ){
    setInterval(()=>{
      toggleGradients();
    },500);
  }
}


function clearHeatmap () {
  heatmap.setMap(null);
}

window.createHeatmap = createHeatmap;
window.clearHeatmap = clearHeatmap;
window.initMap = initMap;
