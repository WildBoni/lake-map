var places = [
    { name: "isola_bella", category: "panorama", id: "ChIJI_225H91hkcRVKb21p-agns"},
    { name: "mottarone", category: "panorama", id: "ChIJ8UByCb4KhkcR0E2nV37mBR0"},
    { name: "san_carlone", category: "architecture", id: "ChIJhQvajYRxhkcRwvU6dVVjF5M"}
];
var markers = [];
var thisCategory = "";
var name = "";
var Place = function(data) {
  this.name = ko.observable(data.name);
  this.category = ko.observable(data.category);
};

var ViewModel = function() {
  var self = this;

  this.radioCat = ko.observable(true);
  this.catFilter = ko.observable("all");
  console.log(this.catFilter());
  this.placesList = ko.observableArray([]);
  places.forEach(function(placeItem) {
    self.placesList.push( new Place(placeItem) );
  });
  this.currentPlace = ko.observable( this.placesList()[0] );
  this.placeSelect = function(place){
    self.currentPlace();
    toggleStatus(place);
  };
  //http://stackoverflow.com/questions/14867906/knockoutjs-value-toggling-in-data-bind
  self.status = ko.observable(true);
  self.status = true;
  toggleStatus = function (place) {
    if(self.status == true) {
      hideListings(place);
    } else {
      showListings(place);
    }
    self.status = !self.status;
  };

  self.DiscountLevel = ko.computed(function () {
      return self.catFilter();
  });

};

var i, marker;
marker = "";
marker.ctgr = "";
marker.name = "";

ko.applyBindings(new ViewModel());

var map;

function showListings(place) {
  var result = places.filter(function( cat ) {
    return cat.name == place.name;
  });
  console.log(result);
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < result.length; i++) {
    markers[i].setMap(map);
  }
}
// This function will loop through the listings and hide them all.
function hideListings(place) {
  var result = places.filter(function( cat ) {
    return cat.name == place.name;
  });
  for (var i = 0; i < result.length; i++) {
    markers[i].setMap(null);
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.924453, lng: 8.556276},
    zoom: 11
  });

/*  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);*/

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  for (i = 0; i < places.length; i++) {
    var thisPlace = places[i];
    var thisCategory = thisPlace.category;
    var thisName = thisPlace.name;
    service.getDetails({
      placeId: thisPlace.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          catgr: thisCategory,
          name: thisName
        });
        console.log(catgr);
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>' + marker.name + '</strong><br>' +
          'Category: ' +  thisPlace.category + '<br>' +
          place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
      }
    });
  }
}
