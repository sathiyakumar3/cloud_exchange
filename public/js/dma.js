var adminset1 = [], table, domainname = "", getOptions = {};

document.getElementById("add_subs_title").innerHTML = "loading, Please wait...", 
document.getElementById("add_subs_title").innerHTML = "loading";

var domainid = null, user = null;

$(document).ready(function() {
    domainid = document.getElementById("idtest").value;
});

$(document).ready(function () {
    domainid = document.getElementById("idtest").value;
});


var refreshchart = setInterval(function () {
  user = firebase.auth().currentUser;
  if (domainid != null && user != null) {
    db.collection("domains").doc(domainid).get().then(function (doc) { domainname = "Device Management - " + doc.data().name }).then(function () {
      document.getElementById('add_subs_title').innerHTML = domainname;
      document.getElementById('add_subs_title').innerHTML = domainname;
  })
    loaddata1(domainid);
    clearInterval(refreshchart);
  }
}, 0);


// loads data to the table.
function loaddata1(t) {
  adminset1 = [], db.collection("devices").where("domain", "==", t).get().then(function(t) {
      0 == t.size && (loadtable(adminset1), document.getElementById("add_subs_title").innerHTML = domainname, 
      document.getElementById("add_subs_title").innerHTML = domainname), t.forEach(function(t) {
          deviceid = t.id, db.collection("devices").doc(deviceid).get(getOptions).then(function(t) {
              var e = t.data().name || "---", n = t.data().description || "---", a = t.data().owner || "---", d = t.data().type || "---", o = t.data().created_on.toDate().getDate() + "-" + (t.data().created_on.toDate().getMonth() + 1) + "-" + t.data().created_on.toDate().getFullYear() + " " + t.data().created_on.toDate().getHours() + ":" + t.data().created_on.toDate().getMinutes() + ":" + t.data().created_on.toDate().getSeconds() || "---", i = "<a href='#' onclick=dremove(\"" + t.id + "\") class='btn btn-success btn-xs' > Remove </a>";
              db.collection("users").doc(a).get(getOptions).then(function(t) {
                  var a = t.data().name || "---", c = t.data().email || "---";
                  db.collection("types").doc(d).get(getOptions).then(function(t) {
                      var d = t.data().name || "---";
                      adminset1.push([ e, n, a, c, d, o, i ]);
                  }).then(function() {
                      loadtable(adminset1);
                  }).catch(function(t) {
                      swal({
                          title: "Warning",
                          text: "Error loading devices information " + t,
                          icon: "warning",
                          buttons: !0,
                          dangerMode: !0
                      });
                  });
              });
          });
      });
  }).catch(function(t) {
      swal({
          title: "Warning!",
          text: "Error, While reading devices lists. " + t,
          icon: "warning",
          buttons: !0,
          dangerMode: !0
      });
  });
}


// loads the table with new data
function loadtable(adminset) {
  table = $(document).ready(function () {
    $('#subscriptions_table2').DataTable({
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
