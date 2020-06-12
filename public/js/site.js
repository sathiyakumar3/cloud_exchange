
var adminset = [];
var adminset1 = [];
var table;
var domainname = ""
var getOptions = {
  //  source: 'cache'
};
document.getElementById('add_subs_title').innerHTML = "loading, Please wait...";
document.getElementById('add_subs_title2').innerHTML = "loading";
document.getElementById('add_subs_titledma').innerHTML = "loading, Please wait...";
document.getElementById('add_subs_titledma2').innerHTML = "loading";
var user = null;
$(document).ready(function ()
{
  // domainid = window.location.href.split("id=")[1];
  domainid = document.getElementById("idtest").value;
  document.getElementById("subcripText").innerHTML = domainid + "   &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; Settings  &nbsp;&nbsp;&nbsp;";

  //document.getElementById("subcripText").innerHTML = domainid + "&nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; Settings &nbsp;&nbsp;&nbsp;";
  //var domainid = null;
});


var refreshchart = setInterval(function ()
{
  user = firebase.auth().currentUser;
  if (domainid != null && user != null) {
    db.collection("domains").doc(domainid).get().then(function (doc) { domainname = "User Management - " + doc.data().name }).then(function ()
    {
      document.getElementById('add_subs_title').innerHTML = domainname;
      document.getElementById('add_subs_title2').innerHTML = domainname;
    })

    loaddata1(domainid);
    loaddata2(domainid);
    clearInterval(refreshchart);
  }
}, 0);



function loaddata1(domainid)
{
  adminset = [];
  db.collection("domains").doc(domainid).collection("requests")
    .get(getOptions).then(function (querySnapshot)
    {
      if (querySnapshot.size == 0) {
        loadtable(adminset);
        // document.getElementById('add_subs_title').innerHTML = domainname;
        // document.getElementById('add_subs_title2').innerHTML = domainname;


      }
      querySnapshot.forEach(function (doc)
      {
        var approval = doc.data().approval;
        var ifowner = doc.data().roles.owner;
        var ifdeveloper = doc.data().roles.developer;
        var ifadmin = doc.data().roles.admin;
        db.collection("users").doc(doc.id).get(getOptions).then(function (doc)
        {
          var adname = doc.data().name || "---";
          var ademail = doc.data().email || "---";;
          var adphone = doc.data().phone || "---";;
          //  console.log(approval+ " | "+approval+ " | "+adname+ " | "+ademail+ " | "+adphone+ " | ")
          if (approval == true) {
            var subtr = "<a href='#' onclick='test(\"" + doc.id + "\",\"" + domainid + "\",\"" + adname + "\",false)' class='btn btn-success btn-xs'> Approved </a>";
          } else {
            var subtr = "<a href='#' onclick='test(\"" + doc.id + "\",\"" + domainid + "\",\"" + adname + "\",true)' class='btn btn-danger btn-xs'> Approve? </a>";
          }

          if (ifadmin == true) {
            var subtr = "<a href='#' onclick='test(\"" + doc.id + "\",\"" + domainid + "\",\"" + adname + "\",false)' class='btn btn-success btn-xs'disabled > Approved </a>";
          }

          else {
            var subtr = "<a href='#' onclick='test(\"" + doc.id + "\",\"" + domainid + "\",\"" + adname + "\",false)' class='btn btn-success btn-xs' > Approved </a>";
          }


          ////////////////////////////////
          /*   if (ifowner == true) {
              document.getElementById("siteTableTop").style.backgroundColor="#F55744";
              document.getElementById("siteTableTop").style.border="none";
              document.getElementById("siteTableTop").style.color="#fff";
              document.getElementById("siteTableTop").style.borderRadius="0";
              document.getElementById("siteTableTop").style.margin="-15px -15px 0";
              document.getElementById("siteTableTop").style.padding="20px 15px";
            }
  
            else if (ifadmin == true) {
              document.getElementById("siteTableTop").style.backgroundColor="#F8B32D";
              document.getElementById("siteTableTop").style.border="none";
              document.getElementById("siteTableTop").style.color="#fff";
              document.getElementById("siteTableTop").style.borderRadius="0";
              document.getElementById("siteTableTop").style.margin="-15px -15px 0";
              document.getElementById("siteTableTop").style.padding="20px 15px";
            }
  
            else if (ifdeveloper == true) {
              document.getElementById("siteTableTop").style.backgroundColor="#7D8EE2";
              document.getElementById("siteTableTop").style.border="none";
              document.getElementById("siteTableTop").style.color="#fff";
              document.getElementById("siteTableTop").style.borderRadius="0";
              document.getElementById("siteTableTop").style.margin="-15px -15px 0";
              document.getElementById("siteTableTop").style.padding="20px 15px";
            }
  
            else {
              document.getElementById("siteTableTop").style.backgroundColor="#E9E9E9";
              document.getElementById("siteTableTop").style.border="none";
              document.getElementById("siteTableTop").style.color="#fff";
              document.getElementById("siteTableTop").style.borderRadius="0";
              document.getElementById("siteTableTop").style.margin="-15px -15px 0";
              document.getElementById("siteTableTop").style.padding="20px 15px";
            } */


          ////////////////////////////////
          if (ifadmin == true) {
            document.getElementById("saveDesable").disabled = false;
            document.getElementById("deleteDesable").disabled = false;
          }

          else if (ifdeveloper == true) {
            document.getElementById("saveDesable").disabled = false;
            document.getElementById("deleteDesable").disabled = false;
          }

          else {
            document.getElementById("saveDesable").disabled = true;
            document.getElementById("deleteDesable").disabled = true;
          }

          ////////////////////////////////
          if (ifowner == true) { //yellow <<<<<<<<
            var buttonrole = "<span class='label label-warning'> Owner </span>";
            subtr = " ";
          } else if (ifadmin == true) { // red <<<<<<<<
            var buttonrole = "<span class='label label-danger'> Admin </span>";
          }
          else if (ifdeveloper == true) { // some clour <<<<<<<<
            var buttonrole = "<span class='label label-primary'> Developer </span>";
          } else { //some clour <<<<<<<<
            var buttonrole = "<span class='label label-info'> Member </span>";
          }
          if (doc.id == user.uid) {
            subtr = " ";
          }
          ///////////////////////////
          // if (ifadmin == true) {
          //     subtr = disabled =true;
          //   }
          //
          //   else if (ifdeveloper == true) {
          //       subtr = disabled =true;
          //   }
          //   else{
          //     subtr = disabled = false;
          //   }
          //////////////////////
          adminset.push([adname, buttonrole, ademail, adphone, subtr]);
        }).then(function ()
        {
          loadtable(adminset);
        })
          .catch(function (error)
          {
            swal({
              title: "Warning",
              text: "Error loading users information " + error,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
          });
      })
    })
}



function loadtable(adminset)
{
  table = $(document).ready(function ()
  {
    $('#subscriptions_table').DataTable({
      destroy: true,
      data: adminset,
      columns: [
        { title: "Name" },
        { title: "Role" },
        { title: "E-mail" },
        { title: "Phone" },
        { title: "Approval" },
      ]
    });
  });
}


//

// loads data to the table.
function loaddata2(domainid)
{
  adminset1 = [];
  db.collection("devices").where("domain", "==", domainid)
    .get()
    .then(function (querySnapshot)
    {
      if (querySnapshot.size == 0) {
        loadtablex(adminset1);
        document.getElementById('add_subs_titledma').innerHTML = domainname;
        document.getElementById('add_subs_titledma2').innerHTML = domainname;
      }
      querySnapshot.forEach(function (doc)
      {
        deviceid = doc.id;
        db.collection("devices").doc(deviceid).get(getOptions).then(function (doc)
        {
          var adname = doc.data().name || "---";
          var adeaddesc = doc.data().description || "---";;
          var adowner = doc.data().owner || "---";;
          var adtype = doc.data().type || "---";;
          var adcreatedon = (doc.data().created_on).toDate().getDate() + "-" + ((doc.data().created_on).toDate().getMonth() + 1) + "-" + (doc.data().created_on).toDate().getFullYear() + " " + (doc.data().created_on).toDate().getHours() + ":" + (doc.data().created_on).toDate().getMinutes() + ":" + (doc.data().created_on).toDate().getSeconds() || "---";
          var button = "<a href='#' onclick=dremove(\"" + doc.id + "\") class='btn btn-success btn-xs' > Remove </a>";

          db.collection("users").doc(adowner).get(getOptions).then(function (doc)
          {
            var ususer = doc.data().name || "---";
            var usemail = doc.data().email || "---";;
            db.collection("types").doc(adtype).get(getOptions).then(function (doc)
            {
              var tyuser = doc.data().name || "---";
              adminset1.push([adname, adeaddesc, ususer, usemail, tyuser, adcreatedon, button]);
            }).then(function ()
            {
              loadtablex(adminset1);

            })
              .catch(function (error)
              {
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
    .catch(function (error)
    {
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
function loadtablex(adminset)
{
  table = $(document).ready(function ()
  {
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
function dremove(deviceid)
{
  swal({
    title: "Are you sure?",
    text: "Once deleted from the domain, the device will be available in its owner's sandbox.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) =>
    {
      if (willDelete) {
        db.collection('devices').doc(deviceid).set({
          domain: ""
        }, { merge: true }).then(function ()
        {
          swal({
            title: "The device has been removed successfully.",
            text: "Do you want to rebuild your navigation tree?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          }).then((willDelete) =>
          {
            if (willDelete) {
              rebuildtree();
            } else {
              swal("You might be able to see the changes until you rebuild your navigation tree. Profile -> Rebuild.");
            }
          });
        })
          .catch(function (error)
          {
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



////////////////////////////////////////

$(document).ready(function ()
{

  db.collection("domains").doc(domainid).get().then(function (doc)
  {
    document.getElementById('sName').value = doc.data().name || "-";
    document.getElementById('sDescription').value = doc.data().description || "-";
    document.getElementById('sLocation').value = doc.data().location || "-";
    document.getElementById('createdon').value = (doc.data().created_on).toDate().getDate() + "-" + ((doc.data().created_on).toDate().getMonth() + 1) + "-" + (doc.data().created_on).toDate().getFullYear() + " " + (doc.data().created_on).toDate().getHours() + ":" + (doc.data().created_on).toDate().getMinutes() + ":" + (doc.data().created_on).toDate().getSeconds() || "-";
    document.getElementById('stype').value = doc.data().type || "-";
    document.getElementById('icon_settings').className = getsiteicon(doc.data().type) + " mr-20"

    console.log(getsiteicon(doc.data().type));
    document.getElementById('sownername').value = doc.data().owner_name || "-";
    document.getElementById('sowneremail').value = doc.data().owner_email || "-";
    document.getElementById('sid').value = domainid;
  }).then(function ()
  {
    document.getElementById('addSite').innerHTML = "Site Settings";
  })
    .catch(function (error)
    {
      swal({
        title: "Warning",
        text: "Error, loading site information " + error,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
    });


});

// update site
function updateSite()
{
  /*   var domainid = document.getElementById("idtest").value;
    var sdescription = document.getElementById('sDescription').value;
    var slocation = document.getElementById('sLocation').value;
    var sType = document.getElementById('stype').value;
  
    db.collection("domains").doc(domainid).update({
  
      description: sdescription,
      location: slocation,
      type: sType
  
    })
      .then(function ()
      {
        goodnews("The changes has been made successfully!");
  
      })
      .catch(function (error)
      {
        badnews(error);
  
      }); */
}


function timeamp()
{

}
// delete site

function deleteSite()
{

  db.collection("domains").doc(domainid).delete().then(function ()
  {
    console.log("Document successfully deleted!");
  }).catch(function (error)
  {
    console.error("Error removing document: ", error);
  });
}
