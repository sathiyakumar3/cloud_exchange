
var adminset1 = [];
var table;
var domainname = "";
var getOptions = {
  //  source: 'cache'
};

document.getElementById('add_subs_titledma').innerHTML = "loading, Please wait...";
document.getElementById('add_subs_titledma2').innerHTML = "loading";
var domainid = null;
var user = null;

$(document).ready(function () {
 // domainid = window.location.href.split("id=")[1];
   domainid = document.getElementById("idtest").value;
});


var refreshchart = setInterval(function () {
  user = firebase.auth().currentUser;
  if (domainid != null && user != null) {
    db.collection("domains").doc(domainid).get().then(function (doc) { domainname = "Device Management - " + doc.data().name }).then(function () {
      document.getElementById('add_subs_titledma').innerHTML = domainname;
      document.getElementById('add_subs_titledma2').innerHTML = domainname;
  })
    loaddata1(domainid);
    clearInterval(refreshchart);
  }
}, 0);


// loads data to the table.
function loaddata1(domainid) {
  adminset1 = [];
  db.collection("devices").where("domain", "==", domainid)
    .get()
    .then(function (querySnapshot) {
     if (querySnapshot.size==0){
      loadtable(adminset1);
      document.getElementById('add_subs_titledma').innerHTML = domainname;
      document.getElementById('add_subs_titledma2').innerHTML = domainname;
      }
      querySnapshot.forEach(function (doc) {
        deviceid = doc.id;
        db.collection("devices").doc(deviceid).get(getOptions).then(function (doc) {
          var adname = doc.data().name || "---";
          var adeaddesc = doc.data().description || "---";;
          var adowner = doc.data().owner || "---";;
          var adtype = doc.data().type || "---";;
          var adcreatedon = (doc.data().created_on).toDate().getDate() + "-" + ((doc.data().created_on).toDate().getMonth() + 1) + "-" + (doc.data().created_on).toDate().getFullYear() + " " + (doc.data().created_on).toDate().getHours() + ":" + (doc.data().created_on).toDate().getMinutes() + ":" + (doc.data().created_on).toDate().getSeconds() || "---";
          var button = "<a href='#' onclick=dremove(\"" + doc.id + "\") class='btn btn-success btn-xs' > Remove </a>";

          db.collection("users").doc(adowner).get(getOptions).then(function (doc) {
            var ususer = doc.data().name || "---";
            var usemail = doc.data().email || "---";;
            db.collection("types").doc(adtype).get(getOptions).then(function (doc) {
              var tyuser = doc.data().name || "---";
              adminset1.push([adname, adeaddesc, ususer, usemail, tyuser, adcreatedon, button]);
            }).then(function () {
              loadtable(adminset1);

            })
              .catch(function (error) {
                swal({
                  title: "Warning",
                  text: "Error loading devices information " + error,
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                })
              });

          })
        })
      });
    })
    .catch(function (error) {
      swal({
        title: "Warning!",
        text: "Error, While reading devices lists. " + error,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    });
}


// loads the table with new data
function loadtable(adminset) {
  table = $(document).ready(function () {
    $('#subscriptions_table23').DataTable({
      destroy: true,
      data: adminset,
      columns: [
        { title: "Name" },
        { title: "Description" },
        { title: "Owner" },
        { title: "E-mail" },
        { title: "Type" },
        { title: "Created on" },
        { title: "" },
      ]
    });
  });
}


// Removes the device and refreshes the table
function dremove(deviceid) {
  swal({
    title: "Are you sure?",
    text: "Once deleted from the domain, the device will be available in its owner's sandbox.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) => {
      if (willDelete) {
        db.collection('devices').doc(deviceid).set({
          domain: ""
        }, { merge: true }).then(function () {
          swal({
              title: "The device has been removed successfully.",
              text: "Do you want to rebuild your navigation tree?",
              icon: "warning",
              buttons: true,
              dangerMode: true,
          }).then((willDelete) => {
              if (willDelete) {
                  rebuildtree();
              } else {
                  swal("You might be able to see the changes until you rebuild your navigation tree. Profile -> Rebuild.");
              }
          });
        })
          .catch(function (error) {
            swal({
              title: "Erro",
              text: "Sorry, the device can not be removed. : " + error,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
          });
        loaddata1(domainid);
      } else {
        swal("The device has not been removed.");
      }
    });
}
