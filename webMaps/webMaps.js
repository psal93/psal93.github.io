var geoJson;

var myMap = L.map('mapid').setView([52.0, -99.49219], 3);

//adding basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0c2FsZW1iaWVyIiwiYSI6ImNpeHF0YWw5ajBhZG4zM251Y29lNWQ0NXgifQ.HKO4ThXZhlWl2B7MrrSYNQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
}).addTo(myMap);

//**** Adding Legend ****
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(myMap){
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = '<i style="background:' + getColor(1) + ' "></i> Pro-Trump' + '<br></br>' +
                  '<i style="background:' + getColor(2) + ' "></i> Pro-Clinton' + '<br></br>' +
                  '<i style="background:' + getColor(0) + ' "></i> Neutral';
  return div;
}

legend.addTo(myMap);
//**** Adding custom info control ****
var info = L.control();

info.onAdd = function (myMap){
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

//method used to update control based on info passed
info.update = function (props){
  this._div.innerHTML = '<h4>Tweeting Breakdown</h4>' + (props ?
        '<b>' + props.NAME + '</b><br />' + "Trump Tweets: " + props.trumpTweet + "<br></br>" + "Clinton Tweets: " + props.hillaryTwe + "<br></br>" + "Neutral Tweets: " + props.neutralTwe
        : 'Hover over a state');
};

info.addTo(myMap);

//***** starting to mess with GeoJSON polygons ******
//GeoJSON color function
function getColor(d){
  return d==1 ? 'red' :
         d==2 ? 'blue' :
                'grey';
}
//styling function
function style(feature){
  return {
    fillColor: getColor(feature.properties.alignment),
    fillOpacity : 1,
    color: 'black'
  };
}
//highlight function
function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: ''
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
  }

  info.update(layer.feature.properties);

}
//reset highlight after mouse leaves polygon
function resetHighlight(e){
  geoJson.resetStyle(e.target);
  info.update();
}
//zoom to polygon on click
function zoomToFeature(e){
  myMap.fitBounds(e.target.getBounds());
}
//defining functionality for each function
function onEachFeature(feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
}
//add the geoJSON
geoJson = L.geoJSON(electionMap, {
  style: style,
  onEachFeature : onEachFeature
}).addTo(myMap);
