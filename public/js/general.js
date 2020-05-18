
function askmore()
{
    Swal.fire({ title: "Hi, ", text: "Do you mind telling us more about you?", icon: 'warning', })
        .then((willDelete) => { if (willDelete) { $('#editprofilemodal').modal('show') } })
}
function getsiteicon(temptype)
{
    switch (temptype) { case 'Airport': tempicon = "fas fa-plane-departure"; break; case 'Agriculture': tempicon = "fas fa-seedling"; break; case 'Apartment': tempicon = "far fa-building"; break; case 'Automobile': tempicon = "fa fa-car"; break; case 'Bank': tempicon = "fas fa-landmark"; break; case 'Church': tempicon = "fas fa-church"; break; case 'City': tempicon = "fas fa-city"; break; case 'Industry': tempicon = "fas fa-industry"; break; case 'Home': tempicon = "fas fa-home"; break; case 'Hotel': tempicon = "fas fa-hotel"; break; case 'Hospital': tempicon = "fas fa-hospital-alt"; break; case 'Kovil': tempicon = "fas fa-gopuram"; break; case 'School/College': tempicon = "fas fa-school"; break; case 'public': tempicon = "fa fa-cloud "; break; case 'Medical Clinic': tempicon = "fas fa-clinic-medical"; break; case 'Mosque': tempicon = "fas fa-mosque"; break; case 'Vihara': tempicon = "fas fa-vihara"; break; case 'Office': tempicon = "fas fa-briefcase"; break; case 'Supermarket': tempicon = "fas fa-store-alt"; break; case 'University': tempicon = "fas fa-university"; break; default: tempicon = "far fa-building" }
    return tempicon
}
function getdeviceicon(type2)
{
    var devicon = "fas fa-qrcode"; switch (type2) { case 'power_meter': devicon = "fas fa-bolt"; break; case 'vavnawh': devicon = "fas fa-fan"; break; case 'smardtchiller': devicon = "fas fa-snowflake"; break; case 'smardtchiller_v2': devicon = "fas fa-snowflake"; break; case 'ahu': devicon = "fas fa-wind"; break; default: devicon = "fas fa-qrcode" }
    return devicon
}

function open_page(pagename)
{
    document.getElementById("content").style.display = "block";
    document.getElementById("content_home_page").style.display = "none";
    document.getElementById("content_devices").style.display = "none";
    document.getElementById("content_chat").style.display = "none";
    document.getElementById("content_todo").style.display = "none";
    $('#content').load("content/" + pagename + ".html");
}


function uma(t)
{ $("#content").load("content/uma.html?id=" + t), document.getElementById("idtest").value = t }
function dma(t)
{ $("#content").load("content/dma.html?id=" + t), document.getElementById("idtest").value = t }
function chat(t)
{ $("#content").load("content/chat.html?id=" + t), document.getElementById("idtest").value = t }
function site(domainid, roler)
{
    document.getElementById("content").style.display = "block";
    document.getElementById("content_home_page").style.display = "none";
    $('#content').load("content/site.html" + "?id=" + domainid, function (responseTxt, statusTxt, xhr)
    {
        if (statusTxt == "success")
            console.log("External content loaded successfully!");
        if (statusTxt == "error")
            console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });




    document.getElementById("idtest").value = domainid; document.getElementById("role1").value = roler
}
function open_item(e, n, t, s, l)
{
    document.getElementById("content").style.display = "block";
    document.getElementById("content_home_page").style.display = "none";
    document.getElementById("content_devices").style.display = "none";
    document.getElementById("content_chat").style.display = "none";
    document.getElementById("content_todo").style.display = "none";
    $("#content").load("content/" + e + ".html?id=" + n + "?domain=" + t, function (responseTxt, statusTxt, xhr)
    {
        if (statusTxt == "success")
            //  console.log("External content loaded successfully!");
            if (statusTxt == "error")
                console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });
    null != prev_selec && (document.getElementById(prev_selec).className = "sub-nvi-itm") && (document.getElementById(prev_selec).innerHTML = document.getElementById(prev_selec).innerHTML.replace('<i class="fas fa-spinner fa-spin"></i>', '')), unsubscribe && (unsubscribe(), unsubscribe = null), unsubscribe2 && (unsubscribe2(), unsubscribe2 = null), document.getElementById("idtest").value = n, document.getElementById("domainname").value = t, document.getElementById("role1").value = s, document.getElementById("devname").value = l, document.getElementById("subcripText").innerHTML = l + " - " + " <font color='Orange'>[LOADING]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + t + "  &nbsp;&nbsp;&nbsp;"; document.getElementById("li_" + n).className = "navi-selection", prev_selec = "li_" + n; var name = document.getElementById("li_" + n).innerHTML; document.getElementById("li_" + n).innerHTML = name + "&nbsp;&nbsp;<i class='fas fa-spinner fa-spin'></i>"
}

function open_home_page()
{

    document.getElementById("content_home_page").style.display = "block";
    document.getElementById("content").style.display = "none";
    document.getElementById("content_devices").style.display = "none";
    document.getElementById("content_chat").style.display = "none";
    document.getElementById("content_todo").style.display = "none";


}

function open_devices()
{
    //  init_table();
    document.getElementById("content_devices").style.display = "block";
    document.getElementById("content").style.display = "none";
    document.getElementById("content_home_page").style.display = "none";
    document.getElementById("content_chat").style.display = "none";
    document.getElementById("content_todo").style.display = "none";
}
function open_chat()
{


    fetch_chat(total_op);
    document.getElementById("content_chat").style.display = "block";
    document.getElementById("content_devices").style.display = "none";
    document.getElementById("content").style.display = "none";
    document.getElementById("content_home_page").style.display = "none";
    document.getElementById("content_todo").style.display = "none";
}

function open_todo()
{
    fetch_tickets(total_op);


    document.getElementById("content_chat").style.display = "none";
    document.getElementById("content_devices").style.display = "none";
    document.getElementById("content").style.display = "none";
    document.getElementById("content_home_page").style.display = "none";
    document.getElementById("content_todo").style.display = "block";
}

$('#content_home_page').load("content/home_page.html");
$('#content_devices').load("content/device_table.html");
$('#content_chat').load("content/chat.html");
$('#content_todo').load("content/todo.html");
function badnews(error)
{ Swal.fire("Warning", String(error), 'error'); }
function goodnews(text)
{ Swal.fire('Success', text, 'success'); }
function datetimeformat(t)
{ var e = t.toDate().getDate() + "-" + (t.toDate().getMonth() + 1) + "-" + t.toDate().getFullYear() + "  " + t.toDate().getHours() + ":" + t.toDate().getMinutes() + ":" + t.toDate().getSeconds(); return e }
function numberWithCommas(x)
{ x = Math.round(x); return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }

function datetimeshortformat(t)
{

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    var n = month[t.toDate().getMonth()];
    var e = t.toDate().getDate()
        + " " +
        n
        + ", " +
        t.toDate().getFullYear();
    return e
}

function adDevice()
{
    var DeviceName = document.getElementById("DeviceName").value; var DeviceId = document.getElementById("DeviceId").value; var dDescription = document.getElementById("dDescription").value; var dType = document.getElementById("dType").value; var domain = document.getElementById("changeDomain2").value; var publickey = document.getElementById("Pkey").value; var publickey_format = document.getElementById("pKey_format").value; var dlogint = document.getElementById("range").value * 60; var dminlog = document.getElementById("range2").value; var today = new Date(); var user = firebase.auth().currentUser; db.collection("devices").doc(DeviceId).get().then(function (doc)
    {
        if (doc.exists) { Swal.fire({ title: "\"" + DeviceId + "\" is already used.", text: "Please use a different ID", dangerMode: !0, }).then((willDelete) => { if (willDelete) { $('#exampleModal').modal('show') } }) } else {
            db.collection("types").doc(dType).collection('datasets').doc('live').get().then(function (doc)
            {
                var nio = doc.data();
                db.collection("devices").doc(DeviceId).set({
                    name: DeviceName, description: dDescription, publickey: publickey, format: publickey_format, type: dType, created_on: today, delete_flag: !1, owner: user.uid,

                    domain: domain, verdict: "You can use this field to note the status of the unit.", verdict_created_on: today, verdict_user: displayName, cloud_status: "", image: 'default'
                }, { merge: !0 })
                db.collection("devices").doc(DeviceId).collection('datasets').doc('config').set({
                    log_interval: dlogint,
                    log_minimum_points: dminlog,
                    max: nio,
                    live: nio,
                    min: nio,
                    log_size: 0,
                    raw_update: true,
                    live_update: true,
                    log_update: true,
                    alarm_update: true,
                    live_timestamp: created_on
                });

                db.collection("devices").doc(DeviceId).collection('datasets').doc('live').set(nio);
                db.collection("devices").doc(DeviceId).collection('datasets').doc('design').set(nio);
                var i; Object.keys(nio).forEach((name) => { for (i = 0; i < 10; i++) { var nower = new Date(); db.collection("devices").doc(DeviceId).collection('alarms').doc().set({ timestamp: nower, parameter: name }) } })
            }).then(function ()
            {
                Swal.fire({ title: "Please wait.", text: "We are setting up the device for you.", timer: 60000, html: '<h6></h6>.', onBeforeOpen: () => { Swal.showLoading(); Swal.getContent().querySelector('h6').textContent = "We are setting up the device for you." }, })
                unsubscribetemp = db.collection("devices").doc(DeviceId).onSnapshot(function (doc)
                {
                    var status = doc.data().cloud_status; Swal.getContent().querySelector('h6').textContent = "Creating device in the cloud."
                    if (status != "") {
                        unsubscribetemp(); if (status == 'success') { rebuildtree("Congrates!, " + DeviceId + " was created successfully.") } else {
                            db.collection("devices").doc(DeviceId).delete().then(function ()
                            { Swal.fire({ type: 'error', title: 'Oops...', text: status, }); Swal.fire("Error!", status, "error").then((willDelete) => { if (willDelete) { $('#exampleModal').modal('show') } }) })
                        }
                    }
                })
            }).catch(function (error)
            { badnews(error); })
        }
    }).catch(function (error)
    { badnews(error); })
}
function CreateSite()
{
    var site_name = document.getElementById("site_name").value; var site_location = document.getElementById("site_location").value; var site_description = document.getElementById("site_description").value; var site_Type = document.getElementById("site_Type").value
    var today = new Date(); var user = firebase.auth().currentUser; var roles = { admin: !1, developer: !1, member: !1, owner: !0 }; if (/\s/.test(site_name)) { Swal.fire({ title: "Invalid Site Name.", text: "No Spaces allowed in the site name.", buttons: !0, dangerMode: !0, }).then((willDelete) => { if (willDelete) { $('#CreateSitemodal').modal('show') } }) } else {
        db.collection("domains").doc(site_name).set({ name: site_name, created_on: today, description: site_description, location: site_location, owner: user.uid, owner_email: user.email, owner_name: user.displayName, type: site_Type, cloud_status: "" }).then(function ()
        {
            Swal.fire({
                title: "Please wait.", text: "We are setting up the site for you.", timer: 60000, html: '<h6></h6>.', buttons: !1, showLoaderOnConfirm: !0, preConfirm: !0, onBeforeOpen: () =>
                {
                    unsubscribetemp = db.collection("domains").doc(site_name).onSnapshot(function (doc)
                    {
                        var status = doc.data().cloud_status; Swal.getContent().querySelector('h6').textContent = "Request Sent for new site."; if (status != "") {
                            unsubscribetemp(); if (status == 'success') {
                                db.collection("users").doc(user.uid).collection('requests').doc(site_name).set({ created_on: today, roles: roles, requested_from: user.uid, approval: !0 }).then(function ()
                                { rebuildtree(site_name + " was created successfully") }).catch(function (error)
                                { badnews(error); })
                            } else {
                                db.collection("domains").doc(site_name).delete().then(function ()
                                { Swal.fire("Error!", status, "error").then((willDelete) => { if (willDelete) { $('#CreateSitemodal').modal('show') } }) })
                            }
                        }
                    })
                }
            })
        }).catch(function (error)
        { })
    }
};
function deleteSite()
{
    var sName = document.getElementById("sName").value; var sid = document.getElementById("sid").value; Swal.fire({ title: "You are about to delete : " + sName, text: "All devices in the site will be moved to the owner's sandbox.", icon: 'warning', }).then((willDelete) =>
    {
        if (willDelete) {
            db.collection("domains").doc(sid).delete().then(function ()
            { rebuildtree(sName + " was deleted successfully. ") }).catch(function (error)
            { badnews(error); })
        }
    })
}

function resetdevice()
{
    var device_id = document.getElementById("idtest").value; Swal.fire({ title: 'Do you want to proceed?', text: "[" + device_id + "] will get reset.", icon: 'warning', showCancelButton: !0, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, proceed.' }).then((result) =>
    {
        if (result.value) {
            document.getElementById("DeviceName").value = document.getElementById('formdName').value; document.getElementById("DeviceId").value = device_id; document.getElementById("dDescription").value = document.getElementById('formdescription').value;
            document.getElementById("dType").value = document.getElementById('formdvtype').value; document.getElementById("changeDomain2").value = document.getElementById('changeDomain3').value; document.getElementById("Pkey").value = document.getElementById('Pkey2').value; document.getElementById("pKey_format").value = document.getElementById('formdvformat').value; document.getElementById("range").value = document.getElementById('formintevl').value; document.getElementById("range2").value = document.getElementById('mmlog').value; console.log(document.getElementById("changeDomain2").value); console.log(document.getElementById("Pkey").value); console.log(document.getElementById("pKey_format").value); console.log(document.getElementById("DeviceName").value); console.log(document.getElementById("dDescription").value); console.log(document.getElementById("DeviceId").value);

            db.collection("devices").doc(device_id).delete().then(function ()
            { adDevice() }).catch(function (error)
            { badnews(error); })
        } else { Swal.fire({ title: 'Cancelled!', icon: 'warning', text: 'No changes were made.', showConfirmButton: !0, }) }
    })
}

function googleupdate()
{
    firebase.auth().onAuthStateChanged(function (e)
    { null != e.displayName && null != e.email && null != e.photoURL && db.collection("users").doc(e.uid).set({ name: e.displayName, email: e.email, photoUrl: e.photoURL, emailVerified: e.emailVerified }, { merge: !0 }).then(function () { swal("Synced Successfully!", { icon: "success" }) }).catch(function (e) { swal({ title: "Warning", text: e, icon: "warning", buttons: !0, dangerMode: !0 }) }) })
}

function reset_user()
{

    var user = firebase.auth().currentUser;
    var today = new Date();
    var obj = {
        "as_options": false,
        "available_docs": 0,
        "country": "Sri Lanka",
        "designation": "Visitor",
        "devicecount": 0,
        "devicesum": [],
        "domaincount": 1,
        "dp_options": false,
        "email": user.email,
        "emailVerified": user.emailVerified,
        "gender": "Male",
        "live_timestamp": today,
        "name": user.displayName,
        "navi": false,
        "navi_status": "success",
        "phone": "0877920132",
        "photoUrl": user.photoURL,
        "sandboxcount": 0,
        "sessions_available": 100,
        "sessions_used": 0,
        "used_docs": 0,
        "user_snippet": [
            {
                "children": [
                    {
                        "children": [],
                        "id": "cloud_exchange_id",
                        "name": "Cloud_Exchange",
                        "type": "public",
                        "user_list": [
                            user.uid
                        ]
                    }
                ],
                "name": user.displayName
            }
        ]
    };
    db.collection("users").doc(user.uid).set(obj)
        .then(function ()
        {
            goodnews("User has been reset!")
        })
        .catch(function (error)
        {
            badnews(error);
        });

    // db.collection("users").doc(user.uid).get().then(function (doc)
    // {
    //     console.log(doc.data());
    //     /*  db.collection("users").doc(user.uid).set(doc.data())
    //          .then(function ()
    //          {
    //              console.log("Document successfully written!");
    //          })
    //          .catch(function (error)
    //          {
    //              console.error("Error writing document: ", error);
    //          }); */
    // }).catch(function (error)
    // {
    //     console.log("Error getting document:", error);
    // });
}
function ProfileUpdate()
{
    var e = document.getElementById("UserEmailUpdte").value, t = document.getElementById("UserNameUpdte").value, n = document.getElementById("Userphonnumber").value,
        l = document.getElementById("UserGender").value, d = document.getElementById("UserCountry").value, o = document.getElementById("UserDesignation").value,
        s = document.getElementById("dpoption").checked,
        b = document.getElementById("asoption").checked,
        y = firebase.auth().currentUser;


    db.collection("users").doc(y.uid).set({
        name: t, email: e, phone: n, gender: l,
        country: d, designation: o, dp_options: s, as_options: b
    }, { merge: !0 }).then(function () { goodnews('Saved successfully!'); }).then(function ()
    { s ? (document.getElementById("dp_op_list_title").style.display = "block", document.getElementById("dp_op_list_1").style.display = "block", document.getElementById("dp_op_list_2").style.display = "block", document.getElementById("dp_op_list_3").style.display = "block", document.getElementById("dp_op_line").style.display = "block") : (document.getElementById("dp_op_list_title").style.display = "none", document.getElementById("dp_op_list_1").style.display = "none", document.getElementById("dp_op_list_2").style.display = "none", document.getElementById("dp_op_list_3").style.display = "none", document.getElementById("dp_op_line").style.display = "none") }).catch(function (e) { badnews(e); })
}


var offline_indi = setInterval(function ()
{
    1 != navigator.onLine && (clearInterval(offline_indi),
        Swal.fire({ type: "error", title: "You are Offline...", text: "Check the internet connection." }))
}, 5e3);


// db.collection("users")
//     .get()
//     .then(function (querySnapshot)
//     {
//         querySnapshot.forEach(function (data)
//         {
//             var live_timestamp = new Date();

//             db.collection("users").doc(data.id).set({
//                 available_docs: 5000,
//                 sessions_available: 100,
//                 sessions_used: 21,
//                 used_docs: 2000,
//                 live_timestamp: live_timestamp,
//                 devicecount: 0,
//                 domaincount: 0,
//                 dp_options: false,
//                 navi: false,
//                 navi_status: "success",
//                 sandboxcount: 0,
//             }, { merge: !0 })
//                 .then(function ()
//                 {
//                     console.log("Document successfully written!");
//                 })
//                 .catch(function (error)
//                 {
//                     console.error("Error writing document: ", error);
//                 });




//             /*    db.collection("devices").doc(id).collection("datasets").doc("max").get()
//                    .then(function (doc)
//                    {
//                        var max3 = doc.data();
//                        db.collection("devices").doc(id).collection("datasets").doc("min").get()
//                            .then(function (doc)
//                            {

//                                var min3 = doc.data();
//                                db.collection("devices").doc(id).collection("datasets").doc("config").set({
//                                    log_minimum_points: log_minimum_points,
//                                    log_size: log_size,
//                                    log_interval: log_interval,
//                                    raw_update: raw_update,
//                                    live_update: live_update,
//                                    log_update: log_update,
//                                    alarm_update: alarm_update,
//                                    live_timestamp: live_timestamp,
//                                    live: max3,
//                                    max: max3,
//                                    min: min3
//                                }, { merge: !0 })
//                                    .then(function ()
//                                    {
//                                        console.log("Document successfully written!");
//                                    })
//                                    .catch(function (error)
//                                    {
//                                        console.error("Error writing document: ", error);
//                                    });
//                            }).catch(function (error)
//                            {
//                                console.log("Error getting document:", error);
//                            });
//                    }).catch(function (error)
//                    {
//                        console.log("Error getting document:", error);
//                    });
//                // Add a new document in collection "cities"

//     */




//             // doc.data() is never undefined for query doc snapshots

//         });
//     })
//     .catch(function (error)
//     {
//         console.log("Error getting documents: ", error);
//     });