function initMap(filter) {
  let manhattan = new google.maps.LatLng(40.763826, -73.979285);
  let map;
  map = new google.maps.Map(document.getElementById('map'), {
    center: manhattan,
    zoom: 12,
    mapTypeId: 'satellite'
  });

  let heatmapData = [];
    dataPoints(filter).forEach((coord) => {
    heatmapData.push(
      {
        location: new google.maps.LatLng(coord[0], coord[1]), weight: coord[2]
      }
    );
  });
  let heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });

  heatmap.setMap(map);

}

window.initMap = initMap;
