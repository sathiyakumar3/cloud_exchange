var domainsets = [];
var adminset = [];
var currentuserid;
var table;
var getOptions = {
    //  source: 'cache'
};
if (unsubscribe) {
    document.getElementById("subcripText").innerHTML = "";
    unsubscribe();
    unsubscribe = null;
}

function loadtable1(adminset)
{
    $(document).ready(function ()
    {
        $('#subscriptions_modal_table').DataTable({
            destroy: true,
            data: adminset,
            columns: [
                { title: "Name" },
                { title: "Role" },
                { title: "E-mail" },
                { title: "Phone" },
                { title: "" },
            ]
        });
    });
}


function loadtable(domainsets)
{
    $(document).ready(function ()
    {
        $('#subscriptions_table').DataTable({
            data: domainsets,
            destroy: true,
            columns: [
                { title: "Name" },
                { title: "Description" },
                { title: "Owner" },
                { title: "Email" },
                { title: "Phone." },
                { title: "Created On" },
                { title: "" },
            ]
        });
    });
}

db.collection("domains").get(getOptions)
    .then(snapshot =>
    {
        snapshot.forEach(doc =>
        {
            if (doc.id != "Cloud_Exchange") {
                var devname = doc.data().name || "---";

                var devdesc = doc.data().description || "---";
                var devownerid = doc.data().owner;
                var devownername = doc.data().owner_name || "---";;
                var devownerphon = doc.data().owner_phone || "---";
                var devowneremail = doc.data().owner_email || "---";

                var devcreatedon = (doc.data().created_on).toDate().getDate() + "-" + ((doc.data().created_on).toDate().getMonth() + 1) + "-" + (doc.data().created_on).toDate().getFullYear() + " " + (doc.data().created_on).toDate().getHours() + ":" + (doc.data().created_on).toDate().getMinutes() + ":" + (doc.data().created_on).toDate().getSeconds() || "---";
                var currentuserid = firebase.auth().currentUser.uid;
                if (currentuserid == devownerid) {
                    var button = "<a href='#' data-toggle='modal' class='btn btn-success' data-book-id='" + doc.id + "' data-dname='" + devname + "' disabled> Subscribe </a>";
                    //  var button = "<a href='#my_modal' data-toggle='modal' class='btn btn-success' data-book-id='" + doc.id + "' data-dname='" + devname + "' > Subscribe </a>";

                } else {
                    var button = "<a href='#my_modal' data-toggle='modal' class='btn btn-success' data-book-id='" + doc.id + "' data-dname='" + devname + "' > Subscribe </a>";
                }

                loadwidgetts("dynamicInput", devname, devdesc, devownername, devowneremail, devownerphon, button, devcreatedon);
                domainsets.push(
                    [devname, devdesc, devownername, devowneremail, devownerphon, devcreatedon, button],
                );
                //console.log(devname + devownerid);

                // .catch(function (error){
                //     swal({
                //         title: "Warning",
                //         text: "Error, loading available subscribtion1: " + error,
                //         icon: "warning",
                //         buttons: true,
                //         dangerMode: true,
                //     })
                // });
            }

        })
    }).then(function ()
    {
        loadtable(domainsets);
        //console.log(domainsets);
        document.getElementById('addSubscriptions').innerHTML = "Request Site";
    }).catch(function (error)
    {
        swal({
            title: "Warning",
            text: "Error, loading available subscribtion: " + error,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
    });




//

$(document).ready(function ()
{
    $("#my_modal").on("hidden.bs.modal", function ()
    {
        // put your default event here
        adminset = [];
        document.getElementById('subscribe_modal_title').innerHTML = "loading...";
    });

    $('#my_modal').on('show.bs.modal', function (e)
    {
        tableloadflag = true;
        var domainid = $(e.relatedTarget).data('book-id');
        var devname = $(e.relatedTarget).data('dname');
        var currentuserid = firebase.auth().currentUser.uid;

        db.collection("domains").doc(domainid).get(getOptions).then(function (doc)
        {
            document.getElementById('subscribe_modal_title').innerHTML = doc.data().name + " | Select the user to request subscription.";
        })

        //finding adminstrators in the selected domain
        db.collection("domains").doc(domainid).collection("requests").where("roles.admin", "==", true).where("approval", "==", true)
            .get(getOptions).then(function (querySnapshot)
            {
                querySnapshot.forEach(function (doc)
                {
                    db.collection("users").doc(doc.id).get(getOptions).then(function (doc)
                    {

                        var adname = doc.data().name || "---";
                        var buttonrole = "<span class='label label-danger'>Admin</span>";
                        var ademail = doc.data().email || "---";;
                        var adphone = doc.data().phone || "---";;
                        if (doc.id != currentuserid) {
                            var subtr = "<a href='#my_modal3' data-toggle='modal' class='btn btn-success btn-xs' data-username='" + adname + "' data-userid='" + doc.id + "'' data-domainname='" + devname + "' data-domainid='" + domainid + "'> Request </a>";
                        } else {
                            //              console.log("Same user found:" + currentuserid);
                            var subtr = " ";
                        }
                        adminset.push(
                            [adname, buttonrole, ademail, adphone, subtr],
                        );
                    }).then(function ()
                    {
                        loadtable1(adminset);
                    })
                        .catch(function (error)
                        {
                            swal({
                                title: "Warning",
                                text: "Error, loading administrators: " + error,
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                        });




                });
            })

        //finding owners in the selected domain
        db.collection("domains").doc(domainid).collection("requests").where("roles.owner", "==", true).where("approval", "==", true)
            .get(getOptions).then(function (querySnapshot)
            {
                querySnapshot.forEach(function (doc)
                {
                    db.collection("users").doc(doc.id).get(getOptions).then(function (doc)
                    {
                        var adname = doc.data().name || "---";;
                        var ademail = doc.data().email || "---";;
                        var adphone = doc.data().phone || "---";;
                        var button = "<span class='label label-warning'>Owner</span>";
                        if (doc.id != currentuserid) {
                            var subtr = "<a href='#my_modal3' data-toggle='modal' class='btn btn-success btn-xs' data-username='" + adname + "' data-userid='" + doc.id + "'' data-domainname='" + devname + "' data-domainid='" + domainid + "'> Request </a>";
                        } else {
                            //      console.log("Same user found:" + currentuserid);
                            var subtr = " ";
                        }

                        adminset.push(
                            [adname, button, ademail, adphone, subtr],
                        );
                    }).then(function ()
                    {
                        loadtable1(adminset);
                    })
                        .catch(function (error)
                        {
                            swal({
                                title: "Warning",
                                text: "Error, loading owners: " + error,
                                icon: "warning",
                                buttons: true,
                                dangerMode: true,
                            })
                        });

                });
            })
    });
});


$(document).ready(function ()
{
    $('#my_modal3').on('show.bs.modal', function (e)
    {
        $('#my_modal').modal('hide');
        var userid = $(e.relatedTarget).data('userid');
        var username = $(e.relatedTarget).data('username');
        var domainname = $(e.relatedTarget).data('domainname');
        var domainid = $(e.relatedTarget).data('domainid');
        document.getElementById('subscribe_modal_title2').innerHTML = "What role do you like to play?";
        document.getElementById('community_text').innerHTML = domainname;
        document.getElementById('requesting_text').innerHTML = username;
        document.getElementById('userid').value = userid;
        document.getElementById('domainid').value = domainid;
    });
});





//


function subscription_bt()
{
    var admincheked = document.getElementById("admincheked").checked;
    var developercheked = document.getElementById("developercheked").checked;
    var membercheked = document.getElementById("membercheked").checked;
    var domainid = document.getElementById("domainid").value;
    var adminid = document.getElementById("userid").value;
    var currentuserid = firebase.auth().currentUser.uid;
    var roles = { admin: admincheked, developer: developercheked, member: membercheked, owner: false };

    db.collection("users").doc(currentuserid).collection('requests').doc(domainid).delete().then(function ()
    {
        db.collection("users").doc(currentuserid).collection('requests').doc(domainid).set({

            roles: roles,
            requested_from: adminid,
            approval: false
        }).then(function ()
        {
            swal("Your Subscription request has been set successfully!");
        })
            .catch(function (error)
            {
                swal({
                    title: "Warning",
                    text: "Sorry, the request has failed." + error,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
            });
    }).catch(function (error)
    {
        console.error("Error removing previous Requests: ", error);
    });
}


function loadwidgetts(divName, name, description, ownername, email, number, button, created_on)
{
    var newdiv = document.createElement('div');
    hectoralamaka =
        '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">';
    var r = Math.floor(Math.random() * 4);
    switch (r) {
        case 0:
            hectoralamaka = hectoralamaka + '<div class="panel panel-warning  contact-card card-view">';
            break;
        case 1:
            hectoralamaka = hectoralamaka + '<div class="panel panel-primary  contact-card card-view">';
            break;
        case 2:
            hectoralamaka = hectoralamaka + '<div class="panel panel-info  contact-card card-view">';
            break;
        case 3:
            hectoralamaka = hectoralamaka + '<div class="panel panel-success  contact-card card-view">';
            break;
    }
    var path = "image/" + r + ".png"
    hectoralamaka = hectoralamaka +
        '<div class="panel-heading">' +
        '<div class="pull-left">' +
        '<div class="pull-left user-img-wrap mr-15">' +
        '<img class="card-user-img  pull-left" src=' + path + ' alt="user"/>' +
        '</div>' +
        '<div class="pull-right user-detail-wrap">' +
        '<span class="block card-user-name">' +
        name +
        '</span>' +
        '<span class="block card-user-desn">' +
        description +
        '</span>' +
        '</div>' +
        '</div>' +
        '<div class="pull-right">' +

        '</div>' +
        '<div class="clearfix"></div>' +
        '</div>' +
        '<div class="panel-wrapper collapse in">' +
        '<div class="panel-body row">' +
        '<div class="user-others-details pl-15 pr-15">' +
        '<div class="mb-15">' +
        '<i class="fa fa-user inline-block mr-10"></i>' +
        '<span class="inline-block txt-dark">' + ownername + '</span>' +
        '</div>' +
        '<div class="mb-15">' +
        '<i class="zmdi zmdi-email-open inline-block mr-10"></i>' +
        '<span class="inline-block txt-dark">' + email + '</span>' +
        '</div>' +
        '<div class="mb-15">' +
        '<i class="zmdi zmdi-smartphone inline-block mr-10"></i>' +
        '<span class="inline-block txt-dark">' + number + '</span>' +
        '</div>' +
        '<hr class="light-grey-hr mt-20 mb-20"/>' +
        '<div class="mb-15">' +
        '<i class="fa fa-calendar inline-block mr-10"></i>' +
        '<span class="inline-block txt-dark">' + created_on + '</span>' +
        '<span class= "pull-right">' + button + '</span>' +
        '</div>' +
        '</div>' +

        '</div>' +
        '</div>' +
        '</div>' +
        '</div>	';
    newdiv.innerHTML = hectoralamaka;
    document.getElementById(divName).appendChild(newdiv);
    counter++;
}

////////////////////////////////////////////////

//

var counter = 0;
var limit = 6;

function addInput(divName)
{
    if (counter == limit) {
        alert("You have reached the limit of adding " + counter + " inputs");
    } else {
        var newdiv = document.createElement('div');
        newdiv.innerHTML =
            '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">' +
            '<div class="panel panel-success contact-card card-view">' +
            '<div class="panel-heading">' +
            '<div class="pull-left">' +
            '<div class="pull-left user-detail-wrap">' +
            '<span class="block card-user-name">' +
            'Evie Ono' +
            '</span>' +
            '<span class="block card-user-desn">' +
            'developer' +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="pull-right">' +
            '<a class="pull-left inline-block mr-15" href="#">' +
            '<i class="zmdi zmdi-edit txt-light"></i>' +
            '</a>' +
            '<a class="pull-left inline-block mr-15" href="#">' +
            '<i class="zmdi zmdi-delete txt-light"></i>' +
            '</a>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '</div>' +
            '<div class="panel-wrapper collapse in">' +
            '<div class="panel-body row">' +
            '<div class="user-others-details pl-15 pr-15">' +
            '<div class="mb-15">' +
            '<i class="zmdi zmdi-email-open inline-block mr-10"></i>' +
            '<span class="inline-block txt-dark">' + 'markh@gmail.com' + '</span>' +
            '</div>' +
            '<div class="mb-15">' +
            '<i class="zmdi zmdi-smartphone inline-block mr-10"></i>' +
            '<span class="inline-block txt-dark">' + '9192372533' + '</span>' +
            '</div>' +


            '</div>' +
            '<hr class="light-grey-hr mt-20 mb-20"/>' +

            '</div>' +
            '</div>' +
            '</div>' +
            '</div>	';

        document.getElementById(divName).appendChild(newdiv);
        counter++;

    }

}
