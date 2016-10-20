var places = [
    { name: "isola_bella", category: "panorama", id: "ChIJI_225H91hkcRVKb21p-agns"},
    { name: "mottarone", category: "panorama", id: "ChIJ8UByCb4KhkcR0E2nV37mBR0"},
    { name: "san_carlone", category: "architecture", id: "ChIJhQvajYRxhkcRwvU6dVVjF5M"}
];

var catFilter = "";
var thisCategory = "";
var Place = function(data) {
  this.name = ko.observable(data.name);
  this.category = ko.observable(data.category);
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
    thisCategory = this.category;
    myFunction();
  };

  /*function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      console.log(markers);
      markers[i].setMap(null);
    }
  }*/

/*  function checkCategory(filteredCategory) {
      return filteredCategory == thisCategory;
  }*/

  function myFunction() {
    console.log(places.category);
      catFilter = places.filter (function (checkCategory) {
        return checkCategory.category == thisCategory;
      });
      console.log(catFilter);
  }

  /*  function filterMarkers(cat) {
      console.log(cat);
      item.addEventListener('click', function(){
        var thcat = cat;
        if (marker.catgr == thcat || category.length === 0) {
          marker.setVisible(false);
        }
        // Categories don't match
        else {
        }
      });
    };*/

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

  var i, marker;

  for (i = 0; i < places.length; i++) {
    var thisPlace = places[i];
    var thisCategory = thisPlace.category;
    service.getDetails({
      placeId: thisPlace.id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          catgr: thisCategory
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
