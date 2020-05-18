function singgOut() {
  firebase.auth().signOut().then(function() {
      window.location = "index.html";
  }, function(n) {
      console.error("Sign Out Error", n);
  });
}