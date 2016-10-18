var splashPage = document.getElementById('page-splash');
var placeName = 'san_carlone';
// Writes the user's data to the database.
function writeUserData(userId, email) {
  firebase.database().ref('users/' + userId).set({
    email: email
  });
}
// The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
// programmatic token refresh but not a User status change.
var currentUID;
// Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  if (user) {
    currentUID = user.uid;
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.email);
    // Retrieve place id from Firebase
    return firebase.database().ref('/places/' + placeName + '/').once('value').then(function(snapshot) {
      var id = snapshot.val().id;
      // Use Google Maps APIS to create infoWindows
      var infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      // Retrieve Place details from Google Maps using the id stored in Firebase
      service.getDetails({
        placeId: id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
          });
          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
              'Place ID: ' + place.place_id + '<br>' +
            place.formatted_address + '</div>');
            infowindow.open(map, this);
          });
        }
      });
    });
  } else {
    // Display the splash page where you can sign-in.
    splashPage.style.display = '';
  }
}
document.getElementById('signOut').addEventListener('click', SignOut, false);
document.getElementById('signOut').textContent = 'Sign out';
function SignOut() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    splashPage.style.display = 'inline';
    // [END signout]
  }
}
window.addEventListener('load', function() {
  // Listen for auth state changes
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
}, false);
