function glogIn()
{
  var e = new firebase.auth.GoogleAuthProvider(); firebase.auth().signInWithPopup(e).then(function (e)
  { opensiter(e) }).catch(function (e)
  { posterror(e.message) })
}
function posterror(e)
{ Swal.fire("Warning", String(e), 'error'); }
function opensiter()
{
  document.getElementById("submitbtn").value = "✓";
  window.location = "CloudExchange.html", document.getElementById("submitbtn").className = "btn btn-primary  btn-rounded";


}
function flogIn()
{
  var e = new firebase.auth.FacebookAuthProvider(); firebase.auth().signInWithPopup(e).then(function (e)
  { opensiter(e) }).catch(function (e)
  { posterror(e.message) })
}

function login()
{
  document.getElementById("submitbtn").className = "btn btn-default btn-icon left-icon", document.getElementById("submitbtn").value = "Wait..."; var e = document.getElementById("email").value, t = document.getElementById("password").value; firebase.auth().signInWithEmailAndPassword(e, t).then(function ()
  { firebase.auth().currentUser.emailVerified ? opensiter(!0) : (posterror("Your email address has not been verified."), document.getElementById("submitbtn").className = "btn btn-primary  btn-rounded", document.getElementById("submitbtn").value = "Log in") }).catch(function (e)
  { document.getElementById("submitbtn").className = "btn btn-primary  btn-rounded", document.getElementById("submitbtn").value = "Log in"; var t = e.message; posterror(t) })
}
function pwReset()
{
  var e = document.getElementById("email").value; firebase.auth().sendPasswordResetEmail(e).then(function ()
  { window.alert("Email reset link sent : " + email.value) }).catch(function (e)
  { var t = e.message; posterror(t) })
}



function singUp()
{

  var e = document.getElementById("uemail").value;
  var t = document.getElementById("upassword").value;

  firebase.auth().createUserWithEmailAndPassword(e, t).catch(function (error)
  {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    Swal.fire("Warning", String(errorCode + " : " + errorMessage), 'error');
  }).then(function ()
  {

    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function ()
    {
      Swal.fire('Success', "Email Verification has been successfully sent!", 'success');
    }).catch(function (error)
    {
      Swal.fire("Warning", String(error), 'error');
      // An error happened.
    });

  });



};

