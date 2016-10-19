var places = [
    { name: "isola_bella", category: "panorama", id: "ChIJI_225H91hkcRVKb21p-agns"},
    { name: "mottarone", category: "panorama", id: "ChIJ8UByCb4KhkcR0E2nV37mBR0"},
    { name: "san_carlone", category: "architecture", id: "ChIJhQvajYRxhkcRwvU6dVVjF5M"}
];

var infowindow = new google.maps.InfoWindow();
var service = new google.maps.places.PlacesService(map);

var i;

for (i = 0; i < places.length; i++) {
  service.getDetails({
    placeId: places[i].id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      marker = new google.maps.Marker({
        map: map,
        catgr: category,
        position: place.geometry.location
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Category: ' + category + '<br>' +
        place.formatted_address + '</div>');
        infowindow.open(map, this);
      });
    }
  });
}

/*    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infowindow.setContent(locations[i][0]);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }
*/
