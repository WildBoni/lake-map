var splashPage = document.getElementById('page-splash');
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
    // Loop through places in Firebase Database
    var place = firebase.database().ref("places").orderByKey();
    place.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var placeName = childSnapshot.key;
          var id = childSnapshot.val().id;
          // Use Google Maps APIS to create infoWindows
          var infowindow = new google.maps.InfoWindow();
          var service = new google.maps.places.PlacesService(map);
          // Retrieve Place details from Google Maps using the id stored in Firebase
          service.getDetails({
            placeId: id
          }, function(place, status) {
            // check if everything is ok, then create marker and append its infowindow
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
