//Declaring Global variables
//Select random feature from cities array
var citiesLen = cities.features.length;
var citiesIndex = getRandomInt(citiesLen);
var citiesUsed = 0;
//Total Score
var score = 0;
var totalScore = 0;

//totalDist
var tempDist = 0;

//Map Clicks
var mapClicks=0;

//Defining GeoJSON layers to be used
var GMgeoJson;
var revealGeoJSON;

//add the clickable marker
var marker = L.marker();

//adding jquery behaviour for start button
function main(){
  $('#gameButton').on('click.myNameSpace',function(){

    gameMap.on('click', onMapClick);
    gameMap.removeLayer(marker);
    $('#totalDist').text("0");

    if(score!=0){
      score = 0;
    }

    $(this).addClass('btnStyle').removeClass('startBtnStyle');
    $(this).text('Next City');
    citiesUsed++;
    //listener to kill activity at end of game
    if(citiesUsed>=10){
      $('#gameButton').off('click').on('click',function(){
          $(this).attr("onclick","function(){}");
          $(this).addClass('endBtnStyle').removeClass('btnStyle');
          gameMap.off('click', onMapClick);
          $(this).text('End!');
        }
      )
    }
  });
}
$(document).ready(main);

//function for submitting a guess
function submitGuess(){
  totalScore += score;
  score =0;
  gameMap.off('click', onMapClick);
  $("#totalScore").text(totalScore);
  $('#totalDist').text(tempDist);
  revealGeoJSON.addTo(gameMap);
}




var gameMap = L.map('geoGameId').setView([54.05, -96.01], 3);

//adding basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0c2FsZW1iaWVyIiwiYSI6ImNpeHF0YWw5ajBhZG4zM251Y29lNWQ0NXgifQ.HKO4ThXZhlWl2B7MrrSYNQ', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
}).addTo(gameMap);

//Function for getting random integer
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//function to calculate distance distance from a given point to a clicked point
//point: cities.features[citiesIndex]
//click: click event
function calcDist(point, click){
  var num = e.latlng.distanceTo([point.geometry.coordinates[1], point.geometry.coordinates[0]]);
  var distance = num/1000;
  var distance = distance.toFixed(2);
};

//function to calculate score
function calcScore(distance){
  if(distance < 100){
    return 100;
  }else if(distance >= 100 && distance <200){
    return 90;
  }else if(distance >=200 && distance <300){
    return 80;
  }else if(distance >=300 && distance <400){
    return 70;
  }else if(distance >=400 && distance <500){
    return 60;
  }else if(distance >=500 && distance <600){
    return 50;
  }else if(distance >=600 && distance <700){
    return 40;
  }else if(distance >=700 && distance <800){
    return 30;
  }else if(distance >=800 && distance <900){
    return 20;
  }else if(distance >=900 && distance <1000){
    return 10;
  }else{
    return 0;
  }
};

//defining functionality for OnEachFeature
function OnEachFeature (feature, layer) {
  //layer.bindPopup(feature.properties.name + ' long: ' + feature.geometry.coordinates[0]);
};

function onMapClick(e) {

  var num = e.latlng.distanceTo([cities.features[citiesIndex].geometry.coordinates[1], cities.features[citiesIndex].geometry.coordinates[0]]);
  var distance = num/1000;
  var distance = distance.toFixed(2);
  marker.setLatLng(e.latlng).addTo(gameMap);
  tempDist = distance;

  score = calcScore(distance);


}

//Adding function for changing city layer
function change(){
  if(gameMap.hasLayer(revealGeoJSON)){
    gameMap.removeLayer(revealGeoJSON);
  }

  if (gameMap.hasLayer(GMgeoJson)){
    gameMap.removeLayer(GMgeoJson);
    citiesIndex = getRandomInt(citiesLen);
    GMgeoJson = L.geoJSON(cities.features[citiesIndex], {pointToLayer:setGeoJSONstyle, onEachFeature : OnEachFeature});
    revealGeoJSON = L.geoJSON(cities.features[citiesIndex], {pointToLayer:setRevealJSONstyle, onEachFeature : OnEachFeature});
    questionBox.update(cities.features[citiesIndex].properties.name);
    GMgeoJson.addTo(gameMap);
  }else{
    citiesIndex = getRandomInt(citiesLen);
    GMgeoJson = L.geoJSON(cities.features[citiesIndex], {pointToLayer:setGeoJSONstyle, onEachFeature : OnEachFeature});
    revealGeoJSON = L.geoJSON(cities.features[citiesIndex], {pointToLayer:setRevealJSONstyle, onEachFeature : OnEachFeature});
    questionBox.update(cities.features[citiesIndex].properties.name);
    GMgeoJson.addTo(gameMap);
  }
}

//Adding question box
var questionBox = L.control({position: 'topright'});

questionBox.onAdd = function (gameMap){
  this._div = L.DomUtil.create('div', 'info');
  this.update();
  return this._div;
};

//method used to update score based on info passed
questionBox.update = function (name){
  this._div.innerHTML = '<h4>Question: ' + (name ? "Where is " + name + " ?": '') + '</h4>';
};

questionBox.addTo(gameMap);


//adding style to GeoJSON features
var geoJSONstyle = {
  "opacity": "0.0",
  "fillOpacity":"0.0",
};

function setGeoJSONstyle(feature, latlng){
  return L.marker(latlng, geoJSONstyle);
};

//adding style to goal GeoJSON features
var revealJSONstyle = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function setRevealJSONstyle(feature, latlng){
  return L.marker(latlng, {icon:revealJSONstyle});
};

//must be of form onEachFeature : OnEachFeature
gameMap.on('click', onMapClick);
