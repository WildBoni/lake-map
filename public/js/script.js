var places = [
    { name: "isola_bella", category: "panorama", id: "ChIJI_225H91hkcRVKb21p-agns", lat: "45.89644639999999", lng: "8.526133099999999", address: "Palazzo Borromeo all'Isola Bella, Isola Bella, 28838 Stresa VB, Italia"},
    { name: "mottarone", category: "panorama", id: "ChIJ8UByCb4KhkcR0E2nV37mBR0", lat: "45.8833333", lng: "8.449999999999999", address: "Mottarone, 28838 Stresa VB, Italia"},
    { name: "san_carlone", category: "architecture", id: "ChIJhQvajYRxhkcRwvU6dVVjF5M", lat: "45.7702621", lng: "8.5431992", address: "Statua di San Carlo Borromeo, Piazzale San Carlo, 28041 Arona NO, Italia"}
];
var markers = [];
var map;
//var infowindow = new google.maps.InfoWindow();

var ViewModel = function() {
  var self = this;
  this.placesList = ko.observableArray([]);
  this.markersList = ko.observableArray([]);
  self.catFilter = ko.observable();

  //Event Listener for initializing map
  //http://stackoverflow.com/questions/36267158/uncaught-referenceerror-google-is-not-defined
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.924453, lng: 8.556276},
      zoom: 11
    });
  }

  places.forEach(function(placeItem) {
    self.placesList.push( new Place(placeItem) );
  });

  self.filterCats = ko.computed(function () {
    if (!self.catFilter()) {
      return self.placesList();
    } else {
      return ko.utils.arrayFilter(self.placesList(), function (place) {
        return place.category() == self.catFilter();
      });
    }
  });

  self.filter = function (category) {
    self.catFilter(category);
  };

  // https://developers.google.com/maps/documentation/javascript/examples/event-domListener
  google.maps.event.addDomListener(window, 'load', function(){
    self.initMap();
  });
};

var Place = function(data) {
  this.name = ko.observable(data.name);
  this.category = ko.observable(data.category);
  this.show = ko.observable(data.show);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.address = ko.observable(data.address);

  var numlat = parseFloat(this.lat);
  var numlng = parseFloat(this.lng);

  var marker = new google.maps.Marker({
    map: map,
    position: {lat: numlat, lng: numlng},
    title: this.name,
    category: this.category,
    address: this.address
  });

  this.marker = ko.observable(marker);

/*  this.marker.addListener('click', function() {
    map.panTo(new google.maps.LatLng(numlat, numlng));
    populateInfoWindow(this, infowindow);
  });*/
};

ko.applyBindings(new ViewModel());

/*
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div><strong>' + marker.title + '</strong><br>' +
      'Category: ' + marker.category  + '<br>' +
      marker.address + '</div>');
    infowindow.open(map, marker);
    // http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 1400);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}*/
