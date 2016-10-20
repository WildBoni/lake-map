var places = [
    { name: "isola_bella", category: "panorama", id: "ChIJI_225H91hkcRVKb21p-agns"},
    { name: "mottarone", category: "panorama", id: "ChIJ8UByCb4KhkcR0E2nV37mBR0"},
    { name: "san_carlone", category: "architecture", id: "ChIJhQvajYRxhkcRwvU6dVVjF5M"}
];


var Place = function(data) {
  this.name = ko.observable(data.name);
};

var ViewModel = function() {
  var self = this;
  this.placesList = ko.observableArray([]);
  places.forEach(function(placeItem) {
    self.placesList.push( new Place(placeItem) );
  });
  this.currentPlace = ko.observable( this.placesList()[0] );
  this.placeSelect = function(place){
    self.currentPlace(place);
  };
};

ko.applyBindings(new ViewModel());

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.924453, lng: 8.556276},
    zoom: 11
  });

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  var i;

  for (i = 0; i < places.length; i++) {
    var thisPlace = places[i];
    service.getDetails({
      placeId: places[i].id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>' + thisPlace.name + '</strong><br>' +
          'Category: ' +  thisPlace.category + '<br>' +
          place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
      }
    });
  }
}
