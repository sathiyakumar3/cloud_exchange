var adminset = [], table, domainname = "", getOptions = {}; document.getElementById("add_subs_title").innerHTML = "loading, Please wait...", document.getElementById("add_subs_title2").innerHTML = "loading"; var domainid = null, user = null; $(document).ready(function () { domainid = document.getElementById("idtest").value })

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
    clearInterval(refreshchart);
  }
}, 0);

function loaddata1(a)
{
  adminset = [], db.collection("domains").doc(a).collection("requests").get(getOptions).then(function (e)
  {
    0 == e.size && (loadtable(adminset), document.getElementById("add_subs_title").innerHTML = domainname,
      document.getElementById("add_subs_title2").innerHTML = domainname), e.forEach(function (e)
      {
        var n = e.data().approval, t = e.data().roles.owner, s = e.data().roles.developer, l = e.data().roles.admin;
        db.collection("users").doc(e.id).get(getOptions).then(function (e)
        {
          var i = e.data().name || "---", o = e.data().email || "---", d = e.data().phone || "---";
          if (1 == n) var r = "<a href='#' onclick='test(\"" + e.id + '","' + a + '","' + i + "\",false)' class='btn btn-success btn-xs'> Approved </a>"; else var r = "<a href='#' onclick='test(\"" + e.id + '","' + a + '","' + i + "\",true)' class='btn btn-danger btn-xs'> Approve? </a>";
          if (1 == t) {
            var c = "<span class='label label-warning'> Owner </span>";
            r = " ";
          } else if (1 == l) var c = "<span class='label label-danger'> Admin </span>"; else if (1 == s) var c = "<span class='label label-primary'> Developer </span>"; else var c = "<span class='label label-info'> Member </span>";
          e.id == user.uid && (r = " "), adminset.push([i, c, o, d, r]);
        }).then(function ()
        {
          loadtable(adminset);
        }).catch(function (a)
        {
          swal({
            title: "Warning",
            text: "Error loading users information " + a,
            icon: "warning",
            buttons: !0,
            dangerMode: !0
          });
        });
      });
  });
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




//

function test(userid, domainid, username, setvalue)
{
  var errorflag = true;
  var warningtext = "You are about to revoke " + username + "'s subscription request";
  var confirmationtext = "The request has been revoked. All devices belonging to the user and the domain will be revoked as well.";
  if (setvalue) {
    warningtext = "You are about to approve " + username + "'s subscription request";
    confirmationtext = "The request has been approved."
  }
  swal({
    title: "Are you sure?",
    text: warningtext,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
    .then((willDelete) =>
    {
      if (willDelete) {
        db.collection('domains').doc(domainid).collection('requests').doc(userid).set({
          approval: setvalue
        }, { merge: true })
          .catch(function (error)
          {
            errorflag = false;
            swal({
              title: "Warning",
              text: "Error: " + error,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
          });

        db.collection('devices').where("owner", "==", userid).where("domain", "==", domainid).get()
          .then(function (querySnapshot)
          {
            querySnapshot.forEach(function (doc)
            {
              db.collection('devices').doc(doc.id).set({ domain: "" }, { merge: true })
            });
          }).catch(function (error)
          {
            errorflag = false;
            swal({
              title: "Warning",
              text: "Error: " + error,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
          });
        if (errorflag) {
          swal(confirmationtext, {
            icon: "success",
          });
        }
        loaddata1(domainid);
      }
    })
};



////////////////////////////////////////
