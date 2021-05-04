firebase.auth().onAuthStateChanged(function(n) {
    var user = firebase.auth().currentUser;
    if (user != null) {
        db.collection("users").doc(user.uid).get().then(function(doc) {

            doc.exists ? null != n ? buildnavitree() : window.location = "index.html" : reset_user();
            if (doc.data().name === "") {

                $('#editprofilemodal').modal('show');
            }


        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    } else {
        window.location = "index.html";
    }




});


function cleanusers() {

    db.collection('domains').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var domain_id = doc.id;

            db.collection('domains').doc(domain_id).collection('requests').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    var user_id = doc.id;


                    //  db.collection('domains').doc(doc.id).collection('tickets').doc(user_id).delete();



                    db.collection('users').doc(user_id).get().then(function(doc2) {
                        if (!doc2.exists) {
                            db.collection('domains').doc(domain_id).collection('requests').doc(doc2.id).delete().then(function() {
                                goodnews("Successfully removed stay entries.");
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                            });
                        } else {
                            // console.log(user_id + "all good");
                        }
                    }).catch(function(error) {
                        console.log("Error getting document:", error);
                    });

                    //  console.log(doc.id, ' => ', doc.data());
                });
            });
        });
    });


}


function live_update_refresh() {
    document.getElementById("session_status").innerHTML = '<div class="spinner" id="loading_nava">' + '<div class="bounce1"></div>' + '<div class="bounce2"></div>' + '<div class="bounce3"></div>' + '</div>';
    var user = firebase.auth().currentUser;
    var date = new Date();
    live_update(user, user_devices, date)
}

function check_live_update(e, t, s, n, name) {
    var i = new Date(),
        a = Date.now(),
        r = (a - s) / 1e3,
        u = 600 - r;
    if (r >= 600)
        if (n) live_update(e, t, i);
        else {
            var c = firebase.auth().currentUser;
            document.getElementById("session_status").innerText = "[EXPIRED]", document.getElementById("session_status").className = "cus-sat-stat weight-500 txt-warning text-center mt-5",
                document.getElementById("subcripText").innerHTML = "   <font color='Orange'>[Session Expired]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + name + "  &nbsp;&nbsp;&nbsp;";
        }
    else {
        document.getElementById("session_status").innerText = "[LIVE]", run_timer(u);
    }
    checkstatus(dp_options, user_devices);
}

function live_update(b, t, live_timestamp) {
    var n = 0;
    Swal.fire({
        title: "Please wait.",
        text: "We are initiating the platform.",
        timer: 60000,
        html: '<h6></h6>.',
        onBeforeOpen: () => {
            Swal.showLoading();
            Swal.getContent().querySelector('h6').textContent = "Initiating Cloud Services...";

            var sess_usage = Number(document.getElementById('sessions_usg').innerText) + 1;

            sessions_rem
            db.collection('users').doc(b.uid).set({
                live_timestamp: live_timestamp,
                sessions_used: sess_usage
            }, {
                merge: !0
            }).then(function() {
                Swal.getContent().querySelector('h6').textContent = "Devices Located.";
                t.forEach(function(m) {
                    db.collection('devices').doc(m).collection('datasets').doc('config').set({
                            live_timestamp: live_timestamp,
                            live_update: !0,
                            blocked: false
                        }, {
                            merge: !0
                        })
                        .then(function() {

                            // Set the "capital" field of the city 'DC'
                            db.collection('devices').doc(m).update({
                                    blocked: false
                                })
                                .then(function() {
                                    n++;
                                    Swal.getContent().querySelector('h6').textContent = "Initiating device : " + m;
                                    if (n == t.length) {
                                        run_timer(600);
                                        call_search();
                                        document.getElementById('sessions_usg').innerText = sess_usage;
                                        document.getElementById('sessions_rem').innerText = Number(document.getElementById('sessions_rem').innerText) - 1;
                                        Swal.fire({
                                            type: 'success',
                                            title: 'Success',
                                            text: 'All devices have been reinitialized.',
                                            footer: 'Please allow few more minutes for the live information.'
                                        });
                                        document.getElementById("session_status").innerText = "[LIVE]";
                                        document.getElementById("session_status").className = "cus-sat-stat weight-500 txt-success text-center mt-5";
                                        document.getElementById("subcripText").innerHTML = b.displayName + "&nbsp;&nbsp;&nbsp |   ";
                                    }

                                })
                                .catch(function(error) {
                                    // The document probably doesn't exist.
                                    console.error("Error updating document: ", error);
                                });



                        }).catch(function(error) {
                            console.error("Error writing document: ", error)
                        })
                })
            }).catch(function(error) {
                console.error("Error writing document: ", error)
            })
        }
    })
}

function request_extend() {
    var user = firebase.auth().currentUser;
    document.getElementById("session_status").innerText = "[EXPIRED]";
    document.getElementById("session_status").className = "cus-sat-stat weight-500 txt-warning text-center mt-5";
    document.getElementById("subcripText").innerHTML = "   <font color='Orange'>[Session Expired]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + user.displayName + "  &nbsp;&nbsp;&nbsp;";
    Swal.fire({

        title: "Live Session Expired",
        html: "Do you want to extend the session?</br> Auto close in <strong><b></b></strong> seconds.",
        showCancelButton: !0,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        timer: 10000,

        confirmButtonText: 'Extend',
        onBeforeOpen: () => {

            timerInterval = setInterval(() => {
                Swal.getContent().querySelector('b')
                    .textContent = Math.floor(Swal.getTimerLeft() / 1000)
            }, 100)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.value) {
            live_update_refresh()
        }
    })
}

function run_timer(ava) {
    clearInterval(interval), interval = setInterval(function() {
        var min = Math.floor(ava / 60);
        document.getElementById("min_remain").innerText = min, document.getElementById("sec_remain").innerText = Math.floor(ava - 60 * min);
        var e = (600 - ava) / 600 * 100;
        e > 99 && (unsubscribe && (unsubscribe(), unsubscribe = null), clearInterval(interval),
            timer = !1, request_extend());
        var t = document.getElementById("time_left_bar");
        t.style.width = e + "%", ava--;
    }, 1e3);
}

function call_search() {
    document.getElementById("pie_chart_4_text").className = "percent block txt-light weight-500";
    document.getElementById("status_de").innerText = "Search Initiated.";
    var teste = setInterval(function() {
        timer = timer + 5;
        if (timer >= 100) {
            clearInterval(teste);
            document.getElementById("status_de").innerText = "Devices Online";
            checkstatus(dp_options, user_devices);
            timer = 0;
        } else {
            $("#pie_chart_4").data("easyPieChart").update(timer);
            document.getElementById("num_online").innerText = "Scanning...";
        }
    }, 1000);
}

var p = 0;
var dataset_timeline = [];
var dp_options = !1;
var user_devices = [];
var live_timestamp;
var search = document.getElementById("myDropdown"),
    unsubscribe, unsubscribe2, unsubscribetemp, startDate = new Date()
var prev_selec = null;
var type2;
var timer = 0;
var interval;

function setup_networkchart(e) {
    am4core.ready(function() {
        var a;
        am4core.useTheme(am4themes_animated), a = am4core.create("chartdiv22", am4plugins_forceDirected.ForceDirectedTree);
        var t = a.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
        t.dataFields.value = "value", t.dataFields.name = "name", t.dataFields.children = "children",
            t.nodes.template.fillOpacity = 1, t.manyBodyStrength = -40, t.links.template.strength = .1,
            t.links.template.strokeOpacity = .5, t.minRadius = am4core.percent(2), t.nodes.template.label.text = "{name}",
            t.fontSize = 16, t.fontColor = "#000", t.urlField = "url", a.zoomControl = new am4maps.ZoomControl(),
            a.data = e;
    });
}



var total_op = [];
var tabledata = [];
var user_profiles = [];
var site_profile = [];
var temp = [];

function buildnavitree() {
    gg = " active in";
    bb = "active";
    var Promises_ = [];
    var new_tab = "";
    var new_tab_pro = "";
    var new_tab2 = "";
    var new_tab_pro2 = "";
    var devicesum = [];
    var new_guy_flag = !1;
    var children = [];
    var typearray = [];
    var cloud_exchange_colour = "text-primary";
    var user = firebase.auth().currentUser;
    var total_devices = 0;
    var used_docs2 = 0;
    var available_docs2 = 0;
    var sys_opt = 'IoT';

    var promise2 = new Promise(function(resolve, reject) {

        db.collection("users").doc(user.uid).get().then(function(doc) {
            displayName = doc.data().name || "", phoneno = doc.data().phone || "", gender = doc.data().gender || "",
                country = doc.data().country || "", UserDesignation = doc.data().designation || "",
                dp_options = doc.data().dp_options || !1, as_options = doc.data().as_options || !1,

                sys_opt = doc.data().sys_opt;

            document.getElementById("topProImg").src = doc.data().photoUrl || "",

                used_docs2 = doc.data().used_docs || 0, available_docs2 = doc.data().available_docs || 0;
            var res = doc.data().name.split(" ", 3);

            document.getElementById("UserEmailUpdte").value = doc.data().email || "",

                document.getElementById("UserNameUpdte").value = displayName,
                document.getElementById("Userphonnumber").value = phoneno,
                document.getElementById("sys_use").value = sys_opt,
                document.getElementById("UserGender").value = gender, document.getElementById("UserCountry").value = country,
                document.getElementById("UserDesignation").value = UserDesignation,





                document.getElementById("myDropdown").innerHTML = doc.data().searchopt;


            live_timestamp = doc.data().live_timestamp.toMillis(),


                total_op = doc.data().user_snippet;
            total_op = total_op[0].children;
            var application = '';

            switch (sys_opt) {
                case 'Tickets':
                    add_ticket_menu();
                    document.getElementById("domainload").innerHTML = "- Ticketing System";
                    application = 'Ticketing System';
                    break;
                case 'Jobsheets':
                    document.getElementById("domainload").innerHTML = "- Job Sheet System";
                    application = 'Jobsheets System';
                    break;
                case 'IoT':
                    document.getElementById("content_home_page").style.display = "block";

                    add_iot_menu();
                    document.getElementById("domainload").innerHTML = "- Internet of Things";

                    document.getElementById("main_page_name").innerText = res[1] || "",
                        document.getElementById("main_page_desig").innerText = doc.data().designation || ""
                    document.getElementById("main_page_pic").src = doc.data().photoUrl || "",
                        document.getElementById("httpDevices1").innerHTML = doc.data().devicecount, document.getElementById("httSuscription").innerHTML = doc.data().domaincount,
                        document.getElementById("httSandbox").innerHTML = doc.data().sandboxcount, document.getElementById("httpTdevices").innerHTML = doc.data().sandboxcount + doc.data().devicecount,
                        document.getElementById("numofdvs").innerHTML = doc.data().sandboxcount + doc.data().devicecount;

                    document.getElementById("used_docs").innerText = numberWithCommas(used_docs2),
                        document.getElementById("sessions_usg").innerText = doc.data().sessions_used || 0,
                        document.getElementById("sessions_ava").innerText = doc.data().sessions_available || 0,
                        document.getElementById("sessions_rem").innerText = doc.data().sessions_available - doc.data().sessions_used || 0;
                    application = 'Internet of Things';
                    break;
                default:
                    document.getElementById("content_home_page").style.display = "block";
                    add_iot_menu();
                    document.getElementById("domainload").innerHTML = "- Internet of Things";

                    document.getElementById("main_page_name").innerText = res[1] || "",
                        document.getElementById("main_page_desig").innerText = doc.data().designation || ""
                    document.getElementById("main_page_pic").src = doc.data().photoUrl || "",
                        document.getElementById("httpDevices1").innerHTML = doc.data().devicecount, document.getElementById("httSuscription").innerHTML = doc.data().domaincount,
                        document.getElementById("httSandbox").innerHTML = doc.data().sandboxcount, document.getElementById("httpTdevices").innerHTML = doc.data().sandboxcount + doc.data().devicecount,
                        document.getElementById("numofdvs").innerHTML = doc.data().sandboxcount + doc.data().devicecount;

                    document.getElementById("used_docs").innerText = numberWithCommas(used_docs2),
                        document.getElementById("sessions_usg").innerText = doc.data().sessions_used || 0,
                        document.getElementById("sessions_ava").innerText = doc.data().sessions_available || 0,
                        document.getElementById("sessions_rem").innerText = doc.data().sessions_available - doc.data().sessions_used || 0;
                    application = 'Internet of Things';
            }

            if (total_op.length == undefined) {
                new_guy_flag = !0
            };
            for (i in total_op) {
                children = total_op[i].children;

                var tempname = total_op[i].name,
                    tempid = total_op[i].id,
                    temptype = total_op[i].type,
                    role = total_op[i].role,
                    option1 = document.createElement("option");

                site_profile.push({
                    name: tempname,
                    id: tempid,
                    type: temptype,
                    role: role
                });
                option1.text = tempname, option1.value = tempname, document.getElementById("changeDomain2").add(option1);
                var rest = [];
                rest = total_op[i].user_list;
                if (0 != rest.length) {

                    rest.forEach(function(entry) {

                        const promise3 = new Promise((resolve, reject) => {

                            temp.includes(entry) || db.collection("users").doc(entry).get().then(function(doc) {

                                    if (doc.exists) {
                                        var name2 = doc.data().name || "default",
                                            photoUrl2 = doc.data().photoUrl || "image/blank_profile_pic.jpg",
                                            email2 = doc.data().email || "default";
                                        user_profiles.push({
                                            id: entry,
                                            name: name2,
                                            photoUrl: photoUrl2,
                                            email: email2
                                        });

                                    }
                                    resolve('success');
                                }).catch(function(error) {
                                    badnews("Error getting document:", error);
                                    reject('error');
                                }),
                                temp.push(entry);
                        });
                        Promises_.push(promise3);

                    });
                }

                tempicon = getsiteicon(temptype);
                if (tempname != "Cloud_Exchange") {
                    new_tab = new_tab + '<li role="presentation" class="' + bb + ' margin-top-tkt"><a data-toggle="tab"id="' + tempname + '1_tab" role="tab"href="#' + tempname + '_tab"aria-expanded="true"><i class="' +
                        tempicon + '"></i> &nbsp;&nbsp' + tempname + ' &nbsp; &nbsp; <div class="pull-right"><span class="label label-primary" id="' + tempname + '_label">0</span></div></a></li>',
                        new_tab_pro = new_tab_pro + '<div id="' + tempname + '_tab" class="tab-pane fade' + gg + '" role="tabpanel"><div class="panel-body"><div class="streamline user-activity"id="' +
                        tempname + '_chat"></div></div><input type="text" class="form-control  rounded-outline-input rounded-input" id="add_' + tempname +
                        '" placeholder="add a comment..."><br/><button class="btn btn-success btn-anim  btn-rounded" onclick="verdict_saver(\'' + tempname +
                        '\')"><i class="fas fa-plus"></i><span class="btn-text">Add</span></button></div>';

                    var hidden_tags =
                        '<div class="form-control tkt-opt-hide" id="currentusers_' + tempname + '"></div>' +
                        '<div class="form-control tkt-opt-hide" id="currentticket_' + tempname + '"></div>' +
                        '<div class="form-control tkt-opt-hide" id="description_' + tempname + '"></div>' +
                        '<div class="form-control tkt-opt-hide" id="title_' + tempname + '"></div>' +
                        '<div class="form-control tkt-opt-hide" id="icon_' + tempname + '"></div>';

                    /*               var top_essentials = '<div class="row">'+
                                    '<div class="col-sm-8 pull-right tkt-btn"><div class="pull-right pull-right-mg">&nbsp;&nbsp;' +
              '<button class="btn btn-success tkt-btn btn-anim btn-rounded " onclick="call_ticket_modal(\'' + tempname + "','" + tempicon + '\',\'123\')"  data-toggle="modal" data-target="#open_ticket_modal">' +
              '<i class="fas fa-ticket-alt"></i><span class="btn-text">Open Ticket</span></button>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                                                  '<button class="btn btn-rounded btn-primary btn-anim"'+ 'onclick="call_report_modal(\'' + tempname + "','" + tempicon + '\',\'123\')"'+
                                                                  'data-toggle="modal" data-target="#reportModal"><iclass="fas fa-file-medical-alt"></i>'+
                                                                      '<spanclass="btn-text">Report</span>'+
                                                              '</button>'+
                                      '</div></div>'+
                                      '</div>';     */

                    var tests = '<div class="table-responsive col-sm-12" id="div_tic_table_' + tempname + '">' +
                        '<table id="edit_tic_table_' + tempname + '" class="table table-hover display compact  mb-30 dataTable no-footer" width="100%" style="cursor: pointer;" role="grid" ">' +
                        '</table>' +
                        '</div><select class="form-control tkt-opt-hide" id="combo_' + tempname + '"></select>' + hidden_tags + '<div class="table-responsive col-sm-12" id="div_jobs_table_' + tempname + '">' +
                        '<table id="edit_jobs_table_' + tempname + '" class="table table-hover display compact  mb-30 dataTable no-footer" width="100%" style="cursor: pointer;" role="grid" ">' +
                        '</table>' +
                        '</div>';



                    /* 
                                        var myvar = '<table  id="edit_datable_' + tempname + '" class="table table-hover display  wrap mb-30 dataTable no-footer" width="100%" style="cursor: pointer;" role="grid" aria-describedby="edit_datable_2_info"></table>  <select class="form-control tkt-opt-hide" id="combo_' + tempname + '"></select ></div>'; */


                    new_tab2 = new_tab2 + '<li role="presentation" class="' + bb + ' margin-top-tkt"><a data-toggle="tab"' + 'id="' + tempname + '1_tab2' + '"  onclick = "reload_table(\'' + tempname + '\')" role="tab"' + 'href="#' + tempname + '_tab2' + '"' +
                        'aria-expanded="true"><i class="' + tempicon + '"></i> &nbsp;&nbsp' + tempname.substring(0, 12) + ' &nbsp; &nbsp; <div class="pull-right"><span class="label label-primary" id="' + tempname +
                        '_label277' + '">0</span></div></a></li>';
                    new_tab_pro2 = new_tab_pro2 + '<div id="' + tempname + '_tab2' + '" class="tab-pane fade' + gg + '" role="tabpanel">' +
                        tests + '</div>';
                    gg = "", bb = "";





                    var lable_tmp = '';
                    var tree = document.createDocumentFragment();
                    var a = document.createElement("a");
                    if (sys_opt == 'Tickets' || sys_opt == 'Jobsheets') {
                        a.setAttribute("href", "javascript:void(0)");
                        //   a.setAttribute("id", tempname+"1_tab2");
                        a.setAttribute("data-toggle", "tab");
                        a.setAttribute("onclick", "clickthis('" + tempname + "1_tab2" + "'),clickthis('home_tab_7')");
                        //  a.setAttribute("role", "tab");                    
                        //  a.setAttribute("aria-expanded", false);
                        lable_tmp = tempname + "_label2";
                        // lable_tmp = tempname + "_count";
                    } else {
                        a.setAttribute("href", "javascript:void(0);");
                        a.setAttribute("data-toggle", "collapse");
                        a.setAttribute("data-target", "#" + tempname);
                        lable_tmp = tempname + "_count";
                    }

                    //  a.setAttribute("class", cloud_exchange_colour);
                    cloud_exchange_colour = "";
                    var div0 = document.createElement("div");
                    div0.setAttribute("class", "pull-left");
                    var i = document.createElement("i");
                    i.setAttribute("class", tempicon + " mr-20");
                    div0.appendChild(i);
                    var span = document.createElement("span");
                    span.setAttribute("class", "right-nav-text");
                    span.setAttribute("id", "title");
                    div0.appendChild(span);
                    a.appendChild(div0);
                    var div2 = document.createElement("div");
                    div2.setAttribute("class", "pull-right");
                    var i2 = document.createElement("span");
                    i2.setAttribute("class", "badge");
                    i2.setAttribute("id", lable_tmp);
                    div2.appendChild(i2);
                    a.appendChild(div2);
                    var div3 = document.createElement("div");
                    div3.setAttribute("class", "clearfix");
                    a.appendChild(document.createTextNode(tempname.substring(0, 12)));
                    a.appendChild(div3);
                    tree.appendChild(a);
                    document.getElementById("dsa").appendChild(tree);
                    var ul = document.createElement("ul");
                    ul.setAttribute("id", tempname);
                    ul.setAttribute("class", "collapse collapse-level-1 ");
                    tree.appendChild(ul);
                    document.getElementById("dsa").appendChild(tree);
                    document.getElementById(lable_tmp).appendChild(document.createTextNode(children.length));
                    var newdiv = document.createElement('li');
                    var temk = '<li align="left">' + '<a href="javascript:site(\'' + tempid + '\',\'' + role + '\')" class="txt-grey font-12 mb-5">' + '<i class="fas fa-cog mr-10"></i>';
                    temk = temk + 'Settings';
                    var colour = "warning";
                    switch (role) {
                        case 'Owner':
                            colour = "warning";
                            break;
                        case 'Admin':
                            colour = "primary";
                            break;
                        case 'Developer':
                            colour = "primary";
                            break;
                        default:
                            colour = "success"
                    }
                    var role_label = '<span class="label label-' + colour + '">' + role + '</span>';
                    temk = temk + '<div class="pull-right">' + role_label + '</div>' + '<div class="clearfix"></div>' + '</a>';
                    temk = temk + '</li>';
                    if (sys_opt == 'IoT' || sys_opt == '') {

                        for (i in children) {

                            var name2 = children[i].name || "",
                                domain2 = children[i].domain || "",
                                id2 = children[i].id || "",
                                description2 = children[i].description || "",
                                role2 = children[i].role || "",
                                created_on2 = children[i].created_on || "",
                                log_minimum_points2 = children[i].log_minimum_points || 0;
                            total_devices++;
                            var logsize2 = children[i].log_size;
                            type2 = children[i].type, devicesum[type2] = (devicesum[type2] || 0) + 1;
                            var percentage = Math.round(logsize2 / log_minimum_points2 * 100),
                                progress_bar = '	<div class="row"><span class="font-12 head-font txt-dark">' + numberWithCommas(logsize2) + " / " + numberWithCommas(log_minimum_points2) + '<span class="pull-right">' + percentage + ' %</span></span><div class="progress progress-xs mb-0 "><div class="progress-bar progress-bar-primary" style="width: ' + percentage + '%"></div></div></div>',
                                hyperlink = "javascript:open_item('" + type2 + "','" + id2 + "','" + domain2 + "','" + role2 + "','" + name2 + "')",
                                hyperlink2 = "javascript:get_device('" + id2 + "')",
                                test = '&nbsp;&nbsp;<td class="text-nowrap"><a  href="' + hyperlink2 + '" class="mr-25" data-original-title="Edit"> <i class="fa fa-pencil text-inverse m-r-10"></i> </a> <a href="' + hyperlink + '" data-toggle="tooltip" data-original-title="Close"> <i class="far fa-eye"></i> </a> </td>';
                            tabledata.push([total_devices, '<i class="' + getdeviceicon(type2) + '"></i> ', id2, name2, description2, domain2, role_label, '<i class="fa fa-clock-o"></i> ' + created_on2, progress_bar, test]),
                                void 0 == typearray[type2] ? typearray[type2] = 0 : typearray[type2]++;
                            var devicon = getdeviceicon(type2),
                                iyu = document.createElement("i");
                            iyu.setAttribute("class", devicon + " mr-20 pull-right txt-grey"), user_devices.push(id2);
                            var ul = document.createElement("ul");
                            document.getElementById(tempname).appendChild(ul);
                            var li = document.createElement("li");
                            li.id = "li_" + id2;
                            var a = document.createElement("a");
                            a.href = "javascript:open_item('" + type2 + "','" + id2 + "','" + domain2 + "','" + role2 + "','" + name2 + "')",
                                a.className = "navi-sub mb-5 text-muted", a.innerHTML = role2 ? +i + 1 + "&nbsp;. &nbsp;" + name2 + " *" : +i + 1 + "&nbsp;. &nbsp;" + name2,
                                li.className = "sub-nvi-itm", a.id = id2, ul.appendChild(li), li.appendChild(a),
                                a.appendChild(iyu), a = document.createElement("a"), a.href = hyperlink, a.innerHTML = domain2 + " : " + name2;
                        }
                    }
                    newdiv.innerHTML = temk
                    document.getElementById("loading_nava").style.display = "none";
                    document.getElementById(tempname).appendChild(newdiv);
                }
            }
            var endDate = new Date(),
                seconds = (endDate.getTime() - startDate.getTime()) / 1e3;
            $.toast().reset("all"), $("body").removeAttr("class").addClass("bottom-center-fullwidth"),
                $.toast({
                    heading: "Welcome back," + displayName,
                    text: "Time taken to load: " + seconds + " seconds",
                    position: "bottom-right",
                    loaderBg: "#878787",
                    hideAfter: 3500,
                    stack: 6
                }), document.getElementById("subcripText").innerHTML = application + "&nbsp;&nbsp;&nbsp |  &nbsp;&nbsp;&nbsp" + displayName + "&nbsp;&nbsp;&nbsp |   ",
                dp_options ? (document.getElementById("dp_op_list_title").style.display = "block",
                    document.getElementById("dp_op_list_1").style.display = "block", document.getElementById("dp_op_list_2").style.display = "block",
                    document.getElementById("dp_op_list_3").style.display = "block", document.getElementById("dp_op_line").style.display = "block") : document.getElementById("dpoption").click(),
                as_options || document.getElementById("asoption").click();
        }).then(function() {

            if (sys_opt == 'IoT' || sys_opt == '') {
                document.getElementById("total_dvs").innerText = total_devices;
                var percentage = Math.round(used_docs2 / available_docs2 * 100),
                    progress_bar = '<div class="row"><span class="font-12 head-font txt-dark">' + numberWithCommas(used_docs2) + " / " + numberWithCommas(available_docs2) + '<span class="pull-right">' + percentage + ' %</span></span><div class="progress progress-xs mb-0 "><div class="progress-bar progress-bar-success" style="width: ' + percentage + '%"></div></div></div>';
                tabledata.push(["", "", "", "", "", "", "", "Total", progress_bar, ""]);
                check_new_sites_added(user, total_op);
                check_live_update(user, user_devices, live_timestamp, as_options, displayName);
            }

            document.getElementById("changeDomain3").innerHTML = document.getElementById("changeDomain2").innerHTML;
            document.getElementById("sel1").innerHTML = document.getElementById("changeDomain2").innerHTML;
            document.getElementById("domain_case2").innerHTML = document.getElementById("changeDomain2").innerHTML;

            return resolve(devicesum)
        }).catch(function(error) {
            if (new_guy_flag) {
                document.getElementById("subcripText").innerHTML = displayName + "&nbsp;&nbsp;&nbsp; |   ";
                document.getElementById('domainload').innerHTML = " - Available Sites"
            } else {
                console.log(error);
                Swal.fire({
                    title: error,
                    text: "Error Loading user information, Do you want to rebuild your navigation tree?",
                    icon: 'warning',
                }).then((willDelete) => {
                    if (willDelete) {
                        rebuildtree()
                    } else {
                        Swal.fire("You might be able to correct the error by rebuilding the navigation tree. Profile -> Rebuild.")
                    }
                })
            }
        })



    });
    return promise2.then(function() {
        document.getElementById('myTabs_11').innerHTML = new_tab;
        //   document.getElementById('myTabs_11').style.display = "block",
        document.getElementById('myTabContent_11').innerHTML = new_tab_pro;
        document.getElementById('myTabs_12').innerHTML = new_tab2;


        document.getElementById('myTabContent_12').innerHTML = new_tab_pro2;
        switch (sys_opt) {
            case 'Tickets':
                /*     console.log('...');
                    Promise.all([Promises_]).then(values => {
                        console.log('came');
                       
                      })
                      .catch(error => {
                        console.error(error.message)
                      }); */
                setTimeout(function() { open_todo(); }, 1000);
                break;
            case 'Jobsheets':
                setTimeout(function() { open_jobsheets(); }, 1000);

                break;
            case 'IoT':
                things();
                setup_echart(devicesum);
                setup_networkchart(total_op);



                //  document.getElementById("domainload").innerHTML = "- Internet of Things";
                break;
            default:

                things();
                setup_echart(devicesum);
                setup_networkchart(total_op);



                //  document.getElementById("domainload").innerHTML = "- Internet of Things";
        }

        add_devices_types();
        checknoti();
    })
}



function things() {
    $('#devices_table').DataTable({
        destroy: !0,
        data: tabledata,
        columns: [{
            title: "No."
        }, {
            title: "Device ID",
            "width": "1px"
        }, {
            title: "Name",
            "width": "1px"
        }, {
            title: "Description",
            "width": "1px"
        }, {
            title: "Site",
            "width": "1px"
        }, {
            title: "Role",
            "width": "1px"
        }, {
            title: "Type",
            "width": "1px"
        }, {
            title: "Created",
            "width": "1px"
        }, {
            title: "Logs",
            "width": "1px"
        }, {
            title: "Action",
            "width": "1px"
        }],

        paging: false,
    });
}




function checkstatus_redo() {
    checkstatus(dp_options, user_devices)
}

function add_devices_types() {
    db.collection("types").get().then(function(t) {
        var counter_types = 0;
        var length_types = t.size;
        var e = document.getElementById("dType");
        t.forEach(function(t) {
            counter_types++;
            var n = document.createElement("option");
            n.text = t.data().name + " - " + t.data().type, n.value = t.id, e.add(n)
            if (counter_types == length_types) {
                document.getElementById('formdvtype').innerHTML = document.getElementById('dType').innerHTML;
            }

        })
    }).catch(function(t) {
        badnews(t);
    })
}

function check_new_sites_added(e, s) {
    db.collection("users").doc(e.uid).collection("requests").where("approval", "==", !0).get().then(function(e) {
        e.size >= s.length && rebuildtree("We have added new sites, as one or more requests has been approved.")
    })
}

function init_site_settings() {
    $("#addsitemodal").on("show.bs.modal", function(t) {
        var e = $(t.relatedTarget).data("id");
        db.collection("domains").doc(e).get().then(function(t) {
            document.getElementById("sName").value = t.data().name || "-", document.getElementById("sDescription").value = t.data().description || "-", document.getElementById("sLocation").value = t.data().location || "-", document.getElementById("sid").value = e
        }).then(function() {
            document.getElementById("addSite").innerHTML = "Site Settings"
        }).catch(function(t) {
            badnews(t);
        })
    })
}

function setup_echart(e) {
    /*     document.getElementById("numofpms").innerText = e.power_meter,
            document.getElementById("numofscs").innerText = e.smardtchiller,
            document.getElementById("numoftds").innerText = e.vavnawh,
            document.getElementById("numoftds").innerText = e.rc;
        var t = echarts.init(document.getElementById("e_chart_123")),
            n = {
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)", backgroundColor: "rgba(33,33,33,1)", borderRadius: 0, padding: 10, textStyle: { color: "#fff", fontStyle: "normal", fontWeight: "normal", fontFamily: "'Roboto', sans-serif", fontSize: 12 }
                },
                legend: {
                    show: !1
                },
                toolbox:
                    { show: !1 },
                calculable: !0,
                itemStyle: {
                    normal: { shadowBlur: 5, shadowColor: "rgba(0, 0, 0, 0.5)" }
                }, series: [{
                    name: "Devices", type: "pie", radius: "80%",
                    center: ["50%", "50%"],
                    roseType: "radius", color: ["#119dd2", "#d36ee8", "#667add"],
                    label: { normal: { fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
                    data: [{ value: e.power_meter, name: "Power Meters" },
                    { value: e.smardtchiller, name: "Smardt Chillers" },
                    { value: e.vavnawh, name: "VAVs" },
                    { value: e.rc, name: "Test Devices" }].sort(function (e, t)
                    { return e.value - t.value })
                }], animationType: "scale", animationEasing: "elasticOut", animationDelay: function ()
                { return 1e3 * Math.random() }
            }; t.setOption(n), t.resize() */
}

function checkstatus(e, t) {
    var d = [];
    void 0 == e && (e = !1), d = [], d.offline = 0, d.online = 0, d.total = 0;

    t.forEach(function(t) {
        var element = document.getElementById("li_" + t),
            m = t;
        db.collection("devices").doc(m).get().then(function(t) {
            blocked = t.data().blocked;
            //   console.log(blocked);
            var element = document.getElementById(m);
            if (blocked) {
                //     console.log("making blocked");
                d.offline = (d.offline) + 1;
                element.className = "navi-sub mb-5 text-danger";
            } else {
                element.className = "navi-sub mb-5 text-muted";
            }

            // console.log("Device :" + m + "  blocked :" + blocked);
            db.collection("devices").doc(m).collection("datasets").doc("live").get().then(function(t) {


                d.total = (d.total) + 1, oldtimestamp = t.data().timestamp, newtimestamp = Date.now(),
                    difference = (newtimestamp - oldtimestamp.toMillis()) / 1e3 || 0;


                if (difference > 60) {
                    d.offline = (d.offline) + 1;
                    element.classList.remove("text-muted");
                    element.classList.add("txt-dark");
                } else {
                    d.online = (d.online) + 1;

                    element.classList.remove("text-muted");
                    element.classList.add("text-success")
                }

            }).then(function() {
                document.getElementById("pie_chart_4_text").className = "percent block txt-dark weight-500";
                $("#pie_chart_4").data("easyPieChart").update(e), document.getElementById("num_online").innerText = d.online + "/" + d.total;
            }).catch(function() {
                d.not_connected = (d.not_connected || 0) + 1;
                // element.classList.add("text-muted");
            });

        });

    });
}

function rebuildtree(message_text) {
    if (message_text == undefined) {
        message_text = "You navigation tree has been rebuilt successfully."
    }
    Swal.fire({
        title: "Please wait.",
        text: "We are rebuilding your navigation tree for you.",
        timer: 60000,
        html: '<h6></h6>.',
        onBeforeOpen: () => {
            Swal.showLoading();
            Swal.getContent().querySelector('h6').textContent = "Initiating Cloud Services...";
            document.getElementById('domainload').innerHTML = " Rebuilding...";
            document.getElementById("dsa").innerHTML = "";
            document.getElementById('myDropdown').innerHTML = "";
            var user = firebase.auth().currentUser;
            var counter = 0;
            const rawdatapath = db.collection("users").doc(user.uid);
            rawdatapath.update({
                navi: !0
            }).then(function() {}).then(function() {
                Swal.getContent().querySelector('h6').textContent = "Initaiating L";
                document.getElementById("subcripText").innerHTML = "<i class='fas fa-sync fa-spin'></i>" + "&nbsp;&nbsp;&nbsp Rebuilding Navaigation...";
                googlefunctions();
                Swal.getContent().querySelector('h6').textContent = "Awaiting reply from Cloud Services.";
                unsubscribe3 = rawdatapath.onSnapshot(function(doc) {
                    counter++;
                    if (counter == 2) {
                        document.getElementById("subcripText").innerHTML = user.displayName + "&nbsp;&nbsp;&nbsp |   ";
                        unsubscribe3();
                        if (doc.data().navi_status == "success") {
                            Swal.fire({
                                type: 'success',
                                title: 'Success',
                                text: 'Your navigation has been rebuilt.',
                            });
                            buildnavitree()
                        } else {
                            Swal.fire({
                                type: 'error',
                                title: 'Oops...',
                                text: doc.data().navi_status,
                            });
                            document.getElementById("subcripText").innerHTML = user.displayName + "&nbsp;&nbsp;&nbsp |   ";
                            document.getElementById('domainload').innerHTML = " - Available Sites"
                        }
                    }
                })
            }).catch(function(error) {
                badnews(error);
            })
        },
    })
}

function googlefunctions() {
    var userlist = [],
        userjson = [];
    var devicesum = [];
    var userjson = [];
    var user = firebase.auth().currentUser;
    var total_do = [];
    var ob_do = [];
    var ob_de = [];
    var used_docs = 0;
    var available_docs = 0;
    var counter = 0;
    var devicecount = 0;
    var domaincount = 0;
    var sandboxcount = 0;
    var promise2 = new Promise(function(resolve, reject) {
        db.collection("devices").where("owner", "==", user.uid).where("domain", "==", "Cloud_Exchange").get().then(function(querySnapshot) {
            sandboxcount = querySnapshot.size;
            querySnapshot.forEach(function(doc) {
                ob_de.push({
                    name: doc.data().name,
                    value: 1,
                    description: doc.data().description,
                    type: doc.data().type,
                    id: doc.id,
                    domain: "Cloud_Exchange",
                    role: "Owner",
                })
            })
        }).then(function() {
            userlist.push(user.uid);
            userjson.push({
                name: user.displayName,
                id: user.uid,
                photoUrl: user.photoUrl
            });
            ob_do.push({
                name: "Cloud_Exchange",
                children: ob_de,
                id: 'cloud_exchange_id',
                type: 'public',
                user_list: userlist
            });
            ob_de = [];
            userlist = [];

            //   console.log(userlist);
            db.collection("users").doc(user.uid).collection('requests').where("approval", "==", !0).get().then(function(querySnapshot) {
                domaincount = querySnapshot.size;
                if (domaincount == 0) {
                    resolve({
                        "navi_status": 'success',
                        "devicecount": 0,
                        "domaincount": 0,
                        "sandboxcount": 0,
                        "user_snippet": total_do,
                        "navi": !1,
                        "used_docs": 0,
                        "available_docs": 0
                    });
                }
                querySnapshot.forEach(function(doc) {
                    var user_req_id = doc.id;
                    var owner = doc.data().roles.owner || !1;
                    var admin = doc.data().roles.admin || !1;
                    var developer = doc.data().roles.developer || !1;
                    var member = doc.data().roles.member || !1;
                    var domainid = doc.id;
                    var roler = "---";
                    if (owner) {
                        roler = "Owner"
                    } else if (admin) {
                        roler = "Admin"
                    } else if (developer) {
                        roler = "Developer"
                    } else {
                        roler = "Member"
                    }
                    db.collection("domains").doc(domainid).get().then((doc) => {
                        if (doc.exists) {
                            var tempname = doc.data().name || "s";
                            var temptype = doc.data().type;
                            var descrip = doc.data().description;
                            db.collection("domains").doc(domainid).collection('requests').where("approval", "==", !0).get().then(function(querySnapshot) {
                                userlist = [];
                                0 != querySnapshot.size && querySnapshot.forEach(function(doc) {
                                    userlist.includes(doc.id) || userlist.push(doc.id);
                                });

                            }).then(function() {

                                var io = userlist;
                                db.collection("devices").where("domain", "==", domainid).get().then(function(querySnapshot) {
                                    devicecount += querySnapshot.size, querySnapshot.forEach(function(doc) {
                                        var log_size = doc.data().log_size || 0,
                                            log_minimum_points = Number(doc.data().log_minimum_points || 0);
                                        devicesum[doc.data().type] = (devicesum[type2] || 0) + 1, available_docs = log_minimum_points + available_docs,
                                            used_docs = log_size + used_docs,
                                            ob_de.push({
                                                name: doc.data().name,
                                                description: doc.data().description,
                                                type: doc.data().type,
                                                id: doc.id,
                                                domain: tempname,
                                                role: roler,
                                                log_size: log_size,
                                                created_on: datetimeshortformat(doc.data().created_on),
                                                log_minimum_points: log_minimum_points
                                            });
                                    });
                                }).then(function() {
                                    // console.log("doamin =" + domainid + "   userlist+" + userlist);
                                    ob_do.push({
                                        name: tempname,
                                        children: ob_de,
                                        type: temptype,
                                        description: descrip,
                                        id: domainid,
                                        role: roler,
                                        user_list: io
                                    }), ob_de = [], userlist = [], counter++, domaincount == counter && (total_do.push({
                                            name: user.displayName,
                                            children: ob_do
                                        }),

                                        console.log(total_do),
                                        resolve({
                                            navi_status: "success",
                                            devicecount: devicecount,
                                            domaincount: domaincount,
                                            sandboxcount: sandboxcount,
                                            user_snippet: total_do,
                                            navi: !1,
                                            used_docs: used_docs,
                                            available_docs: available_docs
                                        }));

                                }).catch(function(error) {
                                    resolve({
                                        navi_status: error
                                    });
                                });
                            }).catch(function(error) {
                                resolve({
                                    "navi_status": error
                                })
                            })

                        } else {
                            domaincount--;
                            db.collection("users").doc(user_req_id).collection('requests').where("approval", "==", !0).delete()
                        }
                    }).catch(function(error) {
                        resolve({
                            "navi_status": error
                        })
                    })
                })
            }).catch(function(error) {
                resolve({
                    "navi_status": error
                })
            })
        }).catch(function(error) {
            resolve({
                "navi_status": error
            })
        })
    });
    return promise2.then(function(value) {
        console.log(value);
        value = JSON.stringify(value);
        value = JSON.parse(value);

        db.collection("users").doc(user.uid).set(value, {
            merge: !0
        }).catch(function(error) {
            badnews(error);
        })
    })
}

function loadnotifcation(t, e, i) {
    var n = 0,
        a = '<div class="streamline message-nicescroll-bar">';
    db.collection("domains").doc(t).collection("requests").where("approval", "==", !1).get().then(function(o) {
        o.forEach(function(o) {
            db.collection("users").doc(o.id).get().then(function(o) {
                    n += 1;
                    var s = o.data().name || "---";
                    a = a + '<div class="sl-item sl-item-mg"><a href="javascript:void(0)"><div class="col-sm-9"><div class="icon bg-green"><i class="zmdi zmdi-flag"></i></div><div class="sl-content"><span class="inline-block   pull-left noti-item-text  ">' + s + " has requested access to " + e + '.</span><span class="inline-block font-11   notifications-time">' + i + '</span><div class="clearfix"></div></div></div><div class="col-sm-3"><a href=\'#\' onclick=\'action("' + o.id + '","' + t + '","' + s + "\",true)' class='label label-danger label-xs'> Approve? </a></div></a></div>"
                }).then(function() {
                    document.getElementById("notification").innerHTML = a, document.getElementById("noticounter").innerHTML = n.toString(), $("body").removeAttr("class").addClass("bottom-center-fullwidth"), $.toast({
                        heading: "Your Attention Request.",
                        text: "Check you notifications, you may have messages.",
                        position: "bottom-right",
                        loaderBg: "#878787",
                        icon: "success",
                        hideAfter: 3500,
                        stack: 6
                    })
                })
                .catch(function(t) {
                    badnews(t);
                })
        })
    })
}

function action(userid, domainid, username, setvalue) {
    var errorflag = !0;
    var warningtext = "You are about to revoke " + username + "'s access request";
    var confirmationtext = "The request has been revoked. All devices belonging to the user and the domain will be revoked as well.";
    if (setvalue) {
        warningtext = "You are about to approve " + username + "'s access request";
        confirmationtext = "The request has been approved."
    }
    Swal.fire({
        title: "Are you sure?",
        text: warningtext,
        icon: 'warning',
    }).then((willDelete) => {
        if (willDelete) {
            document.getElementById("notification").innerHTML = "";
            checknoti();
            db.collection('domains').doc(domainid).collection('requests').doc(userid).set({
                approval: setvalue
            }, {
                merge: !0
            }).catch(function(error) {
                errorflag = !1;
                Swal.fire({
                    title: "Warning",
                    text: "Error: " + error,
                    icon: 'warning',
                })
            });
            db.collection('devices').where("owner", "==", userid).where("domain", "==", domainid).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    db.collection('devices').doc(doc.id).set({
                        domain: ""
                    }, {
                        merge: !0
                    })
                })
            }).catch(function(error) {
                errorflag = !1;
                badnews(error);
            });
            if (errorflag) {
                Swal.fire(confirmationtext, {
                    type: "success",
                })
            }
        }
    })
};

function checknoti() {
    var t = firebase.auth().currentUser;
    db.collection("users").doc(t.uid).collection("requests").where("approval", "==", !0).get().then(function(e) {
        e.forEach(function(e) {
            var a = e.id,
                o = e.data().roles.owner || !1,
                n = e.data().roles.admin || !1;
            // console.log(e.data().created_on);
            // console.log(new Date(e.data().created_on));
            var d = (e.data().created_on).toDate();
            //  console.log(ed);
            //  d = datetimeformat(ed);
            db.collection("domains").doc(e.id).get().then(function(e) {
                e.exists ? (o || n) && loadnotifcation(e.id, e.data().name, d) : db.collection("users").doc(t.uid).collection("requests").doc(a).delete().then(function() {
                    rebuildtree()
                })
            }).catch(function(t) {
                badnews(t);
            })
        })
    }).catch(function(t) {
        badnews(t);
    })
}


function myFunction() {
    db.collection('mail').add({
        to: 'sathiya@eco33.com',
        message: {
            subject: 'Hello from Firebase!',
            text: 'This is the plaintext section of the email body.',
            html: 'This is the <code>HTML</code> section of the email body.',
        }
    }).then(() => console.log('Queued email for delivery!'));
}