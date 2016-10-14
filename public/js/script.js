var splashPage = document.getElementById('page-splash');
/**
 * Writes the user's data to the database.
 */
// [START basic_write]
function writeUserData(userId, email) {
  firebase.database().ref('users/' + userId).set({
    email: email
  });
}
// [END basic_write]

/**
 * The ID of the currently signed-in User. We keep track of this to detect Auth state change events that are just
 * programmatic token refresh but not a User status change.
 */
var currentUID;

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
  // We ignore token refresh events.
  if (user && currentUID === user.uid) {
    return;
  }

  if (user) {
    currentUID = user.uid;
    splashPage.style.display = 'none';
    writeUserData(user.uid, user.email);
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
