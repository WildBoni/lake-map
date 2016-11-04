var places = [
    { name: "isola_bella", category: "panorama", id: "4bb5f9ff1344b7139acb9c04", lat: "45.89644639999999", lng: "8.526133099999999", address: "Isola Bella, 28838 Stresa VB, Italia"},
    { name: "mottarone", category: "panorama", id: "4c274f81905a0f47eca56460", lat: "45.8833333", lng: "8.449999999999999", address: "Mottarone, 28838 Stresa VB, Italia"},
    { name: "san_carlone", category: "architecture", id: "4da166849aa4721e1e61fa19", lat: "45.7702621", lng: "8.5431992", address: "Statua di San Carlo Borromeo, Piazzale San Carlo, 28041 Arona NO, Italia"},
    { name: "da_Aldo", category: "restaurant", id: "4d04d10a9d33a1432e5bbd78", lat: "45.763473", lng: "8.5564403", address: "Piazza del Popolo, 26, 28041 Arona NO"},
    { name: "scurone", category: "bar", id: "55d992b8498e8e67796eaf3e", lat: "46.0627611", lng: "8.6976934", address: "Traversa Scurone, 7, 28822 Cannobio VB"}
];

// custom markers http://map-icons.com/
// assign custom icon to each category
var createIcons = function(category) {
  switch(category) {
    case "architecture":
      path = SQUARE_PIN;
      fillColor = '#b94545';
      map_icon_label = '<span class="map-icon map-icon-point-of-interest"></span>';
    break;
    case "panorama":
      path = MAP_PIN;
      fillColor = '#2e8234';
      map_icon_label = '<span class="map-icon map-icon-local-government"></span>';
    break;
    case "restaurant":
      path = MAP_PIN;
      fillColor = '#80822e';
      map_icon_label = '<span class="map-icon map-icon-restaurant"></span>';
    break;
    case "bar":
      path = MAP_PIN;
      fillColor = '#80822e';
      map_icon_label = '<span class="map-icon map-bar"></span>';
    break;
    default:
      path = ROUTE;
      fillColor = '#602e82';
      map_icon_label = '<span class="map-icon map-icon-food"></span>';
    break;
  }
};



// Google maps basic settings
var map;
var infowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

// FourSquare credentials
var clientId = 'CEE3OEEHN1QL2SS1MWKVTAH5L0MYPWFQFSGI2NZWKWMSEXIL';
var clientSecret = '4NPFBTCE53TLCTJ5DSGEHHVKYXWTE5X5ZDIHP35SE1N0UABR';

// manage everything with konckout.js
var ViewModel = function() {
  var venues = 'Waiting for input';
  var self = this;
  self.placesList = ko.observableArray([]);
  self.filteredCats = ko.observableArray([]);
  self.catFilter = ko.observable();
  self.fsName = ko.observable(venues);
  self.fsRating = ko.observable(venues);

  // Event Listener for initializing map
  // http://stackoverflow.com/questions/36267158/uncaught-referenceerror-google-is-not-defined
  self.initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.924453, lng: 8.556276},
      zoom: 11
    });
  };

  // Adding a listener on each marker
  self.createMarkersClick = function(){
    self.placesList().forEach(function(place){
      google.maps.event.addListener(place.marker(), 'click', function(){
        self.clickPlace(place);
      });
    });
  };

  // A click on the marker or on the list view opens up infowindow
  // And animates the pin
  self.clickPlace = function(place){
    infowindow.setContent(place.marker().details);
    infowindow.open(map, place.marker());
    // http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
    place.marker().setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ place.marker().setAnimation(null); }, 700);
    self.fourSquareDetails(place.element().url);
    /*// Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.place.marker() = null;
    });*/
  };

  // https://developer.foursquare.com/overview/tutorial
  self.fourSquareDetails = function(url){
    var foursquareRequestTimeout = setTimeout(function(){
      $('#foursquare').text("Uh Oh... FourSquare is not responding!");
    }, 4000);

    $.ajax( {
        url: url,
        dataType: 'jsonp',
    }).done(function( data ) {
      var venue = data.response.venue.name;
      var rating = data.response.venue.rating;
      self.fsName(venue);
      self.fsRating(rating);
      clearTimeout(foursquareRequestTimeout);
    });
  };

  // Populate the observable array with places data
  self.loadPlaces = function() {
    places.forEach(function(placeItem) {
      self.placesList.push( new Place(placeItem) );
    });
  };

  // Filtering markers by chosen category
  // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  self.filterCats = function(category) {
    self.catFilter(category);
    // Empty the observable array
    self.filteredCats([]);

    var len = self.placesList().length;
    // Filter placesList array based on selected catagory
    var selected = ko.utils.arrayFilter(self.placesList(), function (place) {
      return place.category() == self.catFilter();
    });
    // Loop through the places list
    for(var i = 0; i < len; i++) {
      // Matching category filter
      if (self.placesList()[i].category().indexOf(category) > -1) {
        self.filteredCats.push(self.placesList()[i]);
        self.placesList()[i].marker().setMap(map);
        map.fitBounds(bounds);

      // Hide other markers
      } else {
        self.placesList()[i].marker().setMap(null);
        map.fitBounds(bounds);
      }
    }
  };

  self.filter = function (category) {
    self.filterCats(category);
  };

  self.selectedPlace = function(place){
    map.panTo(new google.maps.LatLng(place.marker().position.lat(), place.marker().position.lng()));
    map.setZoom(12);
    self.clickPlace(place);
    // FourSquareDetails(place.marker().url);
  };

  // https://developers.google.com/maps/documentation/javascript/examples/event-domListener
  google.maps.event.addDomListener(window, 'load', function(){
    self.initMap();
    self.loadPlaces();
    map.fitBounds(bounds);
    self.filteredCats(self.placesList());
    self.createMarkersClick();
  });

};

var Place = function(data) {
  this.name = ko.observable(data.name);
  this.category = ko.observable(data.category);
  this.id = ko.observable(data.id);
  this.show = ko.observable(data.show);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.address = ko.observable(data.address);

  createIcons(this.category());

  var numlat = parseFloat(this.lat());
  var numlng = parseFloat(this.lng());

  var marker = new Marker({
    map: map,
    position: {lat: numlat, lng: numlng},
    icon: {
      path: path,
      fillColor: fillColor,
      fillOpacity: 1,
      strokeColor: '',
      strokeWeight: 0
    },
    map_icon_label: map_icon_label,
    details: '<div><strong>' + this.name() + '</strong><br>' +
          'Category: ' + this.category()  + '<br>' +
          this.address() + '</div>'
  });

  var element = {
    id: this.id(),
    url: 'https://api.foursquare.com/v2/venues/' + this.id() + '?client_id='+ clientId +
    '&client_secret=' + clientSecret + '&v=20130815'
  };

  bounds.extend(marker.getPosition());

  this.marker = ko.observable(marker);
  this.element = ko.observable(element);
  this.path = ko.observable(this.marker.path);
  this.fillColor = ko.observable(this.marker.fillColor);
  this.map_icon_label = ko.observable(this.marker.map_icon_label);
};

ko.applyBindings(new ViewModel());
