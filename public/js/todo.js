var dataSet2 = [];
var dataSet3 = [];
var dats = [];
var loaded = false;
function loadtable(id, dataset, reportflag)
{
    for (i = 0; i < dataset.length; i++) {
        processrow(reportflag, dataset[i], i);
    }
    dotable(id, dataset, !1, reportflag),
        document.getElementById("stats_cc").innerText = Number(document.getElementById("stats_tc").innerText) - Number(document.getElementById("stats_oc").innerText);

}

function reload_table(dom_id)
{
    setTimeout(
        function ()
        {
            var table = $('#edit_datable_' + dom_id).DataTable();
            //       console.log(table.rows().data());
            table.columns.adjust().draw();
        }, 175);
}





function stringDivider(str, width, spaceReplacer)
{
    /*  if (str.length > width) {
         var p = width
         for (; p > 0 && str[p] != ' '; p--) {
         }
         if (p > 0) {
             var left = str.substring(0, p);
             var right = str.substring(p + 1);
             return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
         }
     } */
    return str;
}

function processrow(reportflag, row, i) //
{
    //  chartdata["closed"] = chartdata["closed"] + 1;
    var date2 = new Date(),
        user = firebase.auth().currentUser;
    var buttons = '';
    row[5] = "";
    row[6] = "";
    row[7] = "";
    row[8] = "";
    row[9] = "";
    row[10] = "";
    row[2] = row[2].replace(/<\/?[^>]+(>|$)/g, "");
    row[3] = row[3].replace(/<\/?[^>]+(>|$)/g, "");
    row[4] = row[4].replace(/<\/?[^>]+(>|$)/g, "");
    row[2] = row[2].replace(/['"]+/g, "");
    row[3] = row[3].replace(/['"]+/g, "");
    row[4] = row[4].replace(/['"]+/g, "");
    row[23] = row[23].replace(/<\/?[^>]+(>|$)/g, "");
    row[7] = tabletolable(row[11], true),
        row[21] = datetimeshortformat(row[21]);

    row[8] = tabletoimage(row[12], 35), row[9] = tabletoimage(row[13], 35) + tabletoimage(row[14], 35) + tabletoimage(row[15], 35) + tabletoimage(row[16], 35),
        row[18] = tabletoname(row[13]) + tabletoname(row[14]) + tabletoname(row[15]) + tabletoname(row[16]),
        row[19] = tabletoname(row[12]), increment_tag("total_oc_tickets");
    var butns = "'" + row[0] + "','" + row[2] + "','" + i + "','" + row[12] + "','" + row[1] + "','" + row[3] + "','" + row[4] + "'";
    if (user.uid == row[12]) {
        buttons = '<a href="#" onclick=tktedit("' + row[0] + '","' + row[2] + '","' + i + '") class="text-inverse text-success" title="Edit" data-toggle="modal" data-target="#edit_ticket_modal"><i class="fas fa-edit fa-lg"></i></a> &nbsp;&nbsp;<a href="javascript:void(0)" onclick=tktdelete("' + row[0] + '","' + row[2] + '","' + i + '")  class="text-inverse text-danger" title="Delete" data-toggle="tooltip"><i class="fas fa-times fa-lg"></i></a>';
        if ('Solved' == row[11]) {
            buttons = buttons + '&nbsp;&nbsp;<a href="javascript:void(0)" onclick="close_case(' + butns + ')"  class="text-inverse text-sucess" title="" data-toggle="tooltip"><i class="fas fa-check fa-lg"></i></a>&nbsp;&nbsp;';
        }
    } else {
        buttons = buttons + '<i class="fas fa-lock"></i>';
    }



    if (reportflag) {
        if (user.uid == row[12] && 'Closed' == row[11]) {
            buttons = '<a href="javascript:void(0)" onclick=undo_close_case"(' + butns + ')"   class="text-inverse text-sucess" title="" data-toggle="tooltip"><i class="fas fa-undo"></i> Re-Open</a> ';
        } else {
            buttons = "";
        }
    }
    if ('Deleted' == row[11]) {
        buttons = "";
        row[8] = "";
        row[9] = "";
    }
    row[10] = buttons;
    increment_tag(row[2] + "_label2");
    var created_on_date = datetimeshortformat(row[17]),
        date1 = new Date(created_on_date),
        Difference_In_Time = date2.getTime() - date1.getTime(),
        Difference_In_Days = Math.round(Difference_In_Time / 864e5);

    if (Difference_In_Days > 7 && '<span class="label label-danger">Not Started</span>' == row[7]) {
        row[6] = '<span class="inline-block txt-danger weight-500">'
            + Difference_In_Days + ' Days&nbsp;&nbsp;<i class="fas fa-exclamation"></i></span>';
        document.getElementById(row[2] + "_label2").className = "label label-info";
    } else {
        row[6] = '<span class="inline-block txt-success weight-500">' + Difference_In_Days + " Days</span>";
    }

    row[5] = '<i class="far fa-calendar-alt"></i>&nbsp;&nbsp;' + created_on_date,
        row[3] = '<p class="txt-dark weight-500">' + stringDivider(row[3], 30, "<br/>\n") + "</p>";
    row[4] = element_add(row[12], row[4], "", 60);
    increment_tag("lb_allsit");
    row[2] = '<span class="capitalize-font txt-primary mr-5 weight-500">' + row[2] + "</span>",
        row[1] = '<h5 class="capitalize-font txt-primary mr-5 weight-500">' + row[1] + "</h5>",
        ("Urgent Action" == row[11] || "Not Started" == row[11] || "On Progress" == row[11]) && (dataSet3.push(row),
            increment_tag("lb_atten")), "Not Started" == row[11] && increment_tag("stats_aq");
    if (row[23] != "---") {
        row[23] = element_add(row[22], row[23], row[21], 35);
    }

    if (user.uid == row[13] || user.uid == row[14] || user.uid == row[15] || user.uid == row[16]) {
        dataSet2.push(row),
            increment_tag("lb_todo");
    }

    return row
}

function element_add(image_id, message, timetamp, wrap)
{
    var dsa = '<div class="sl-item">' +
        '<a href="javascript:void(0)">' +
        '<div class="sl-avatar">' +
        tabletoimage(image_id, 25) +
        '</div>' +
        '<div class="sl-content">' +
        '<span class="inline-block capitalize-font  pull-left truncate head-notifications">' + stringDivider(message, wrap, "<br/>\n") + '</span>' +

        '<div class="clearfix"></div>' +
        '<span class="inline-block font-11  pull-right notifications-time">' + timetamp + '</span>' +
        '</div>' +
        '</a>' +
        '</div>';
    return dsa
}

function load_atten()
{
    dotable("#tab2", dataSet3, true, false);
    /*     setTimeout(
            function ()
            {
                var table = $("#tab2").DataTable();
                table.columns.adjust().draw();
                 console.log("Readjusted");
            }, 1000); */
}

function todolist()
{
    dotable("#newtb", dataSet2, true, false);

    /*     setTimeout(
            function ()
            {
                var table = $("#newtb").DataTable();
                  table.columns.adjust().draw();
                    console.log("Readjusted");
            }, 1000); */
}

function increment_tag(t)
{
    var item = document.getElementById(t);
    var number = item.innerHTML;
    number++;
    item.innerHTML = number;
}


function decrement_tag(t)
{
    document.getElementById(t).innerText = Number(document.getElementById(t).innerText) - 1;
}

function cleantable(domain, dataset)
{
    for (i = 0; i < dataset.length; i++) domain == dataset[i][2].replace(/<\/?[^>]+(>|$)/g, "") && dataset.splice(i, 1);
}
var loo2p;
var inputOptionsPromise = new Promise(function (resolve)
{
    // get your data and pass it to resolve()
    setTimeout(function ()
    {
        resolve({
            'C': 'Closed',
            'F': 'Follow Up',
            'N': 'Not Started',
            'O': 'On Progress',
            'S': 'Skipped',
            'U': 'Urgent',
        })
    }, 2000)
})

function removefollowup()
{
    fetch_tickets(total_op, 'E');
}
function dotable(id, dataset, domain_flag, report_flag)
{
    var reports_text = "The information is from cloudexchange.lk",
        selection = {
            columns: [2, 3, 4, 5, 7, 18, 19, 21, 23]
        },
        buttons_pack = [{
            extend: "copy",
            className: "btn btn-primary btn-rounded",
            messageTop: reports_text,
            exportOptions: selection,
            background: !1
        }, {
            extend: "csvHtml5",
            className: "btn btn-primary btn-rounded",
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "excelHtml5",
            className: "btn btn-primary btn-rounded",
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "pdfHtml5",
            className: "btn btn-primary btn-rounded",
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "print",
            className: "btn btn-primary btn-rounded",
            messageTop: reports_text,
            exportOptions: selection
        }, {
            text: "Page-Cycle",
            className: "btn btn-success btn-rounded",
            action: function ()
            {

                Swal.fire({
                    title: 'Cycle through pages',
                    text: "Please enter the interval in seconds.",
                    input: 'number',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Enable',
                    cancelButtonText: 'Disable'

                }).then((result) =>
                {
                    if (result.value) {
                        var inter = result.value * 1000;
                        clearInterval(loo2p), loo2p = setInterval(function ()
                        {

                            var table = $(id).DataTable();
                            if (table) {
                                info = table.page.info(),
                                    pageNum = info.page < info.pages ? info.page + 1 : 1;
                                table.page(pageNum).draw(!1);
                                //   table.columns.adjust().draw();
                                //    table.rows.adjust().draw();
                            }

                        }, inter)

                        Swal.fire(
                            'Page Cycle Enabled',
                            'The pages will changed for every ' + result.value + ' seconds',
                            'success'
                        )
                    } else {
                        clearInterval(loo2p);
                        Swal.fire(
                            'Page Cycle Disabled!',
                            'The pages will remain static.',
                            'success'
                        )
                    }
                })



            }
        }]

    var table = $(id).DataTable({
        // sScrollX: true,

        order: [
            [20, "desc"]
        ],
        dom: "frtipB",
        bInfo: !1,
        pageLength: 10,
        buttons: buttons_pack,
        destroy: !0,
        data: dataset,



        createdRow: function (row, data, dataIndex)
        {
            user = firebase.auth().currentUser;
            if ((user.uid == data[13] || user.uid == data[14] || user.uid == data[15] || user.uid == data[16]) && !domain_flag) {
                $(row).addClass('red');
            }
        },


        columns: [
            {
                title: "Doc ID",
                visible: !1
            },
            {
                title: "ID"

            }, {
                title: "Domain",
                visible: domain_flag
            }, {
                title: "Location"
            }, {
                title: "Issue",
                responsivePriority: 1
            }, {
                title: "Date Created."
            }, {
                title: "Pending"
            }, {
                title: "Status"
            }, {
                title: "Created by",
                visible: !1
            }, {
                title: "To"
            }, {
                title: "Actions"
            }, {
                title: "Status",
                visible: !1
            }, {
                title: "Update",
                visible: !1
            }, {
                title: "Assign 1",
                visible: !1
            }, {
                title: "Assign 2",
                visible: !1
            }, {
                title: "Assign 3",
                visible: !1
            }, {
                title: "Assign 4",
                visible: !1
            }, {
                title: "Date",
                visible: !1
            }, {
                title: "Assigned to",
                visible: !1
            }, {
                title: "Created by to",
                visible: !1
            }, {
                title: "Ticket Sorting",
                visible: !1
            }, {
                title: "Last Updated",
                visible: report_flag
            }, {
                title: "Updated by",
                visible: !1
            }, {
                title: "Message",
                visible: true,

            }, {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                visible: !report_flag
            }],
    })


    // Add event listener for opening and closing details
    $(id + ' tbody').on('click', 'td.details-control', function ()
    {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var data = row.data();
        var counter = row.index();
        var doc = data[0].replace(/<\/?[^>]+(>|$)/g, "");
        var dom = data[2].replace(/<\/?[^>]+(>|$)/g, "");
        var loc = data[3].replace(/<\/?[^>]+(>|$)/g, "");
        var iss = data[4].replace(/<\/?[^>]+(>|$)/g, "");
        var user = firebase.auth().currentUser;
        var ass_1 = data[13];
        var ass_2 = data[14];
        var ass_3 = data[15];
        var ass_4 = data[16];
        var owner = data[12];


        iss = iss.replace(/(?:^[\s\u00a0]+)|(?:[\s\u00a0]+$)/g, '');
        data[1] = data[1].replace(/<\/?[^>]+(>|$)/g, "");

        var status = data[11];
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {
            row.child(ter(doc, dom, status, counter, owner, data[1], loc, iss)).show();
            if (user.uid == ass_1 || user.uid == ass_2 || user.uid == ass_3 || user.uid == ass_4 || user.uid == owner) {
                format(doc, dom, status, counter);
            } else {
                format_lock(doc);
            }

            tr.addClass('shown');
        }
    });

}

function format_lock(doc)
{

    document.getElementById("button_" + doc).disabled = true;
    document.getElementById("his_" + doc).disabled = true;
    document.getElementById("his_op_" + doc).disabled = true;
    var c = document.getElementById("his_" + doc);
    var b = document.getElementById("his_op_" + doc);
    c.innerHTML = "<p class='text-center' ><i class='fas fa-lock'></i>&nbsp;&nbsp;You have not been assigned for this job.</br></p>";
    //b.value = "locked";

}


function ter(doc, dom, status, counter, owner, tick_id, location, issue)
{
    console.log(issue);
    var myvar = '<div class="panel-body ">' +
        '									<div class="streamline user-activity" id="his_' + doc + '">' +
        ' <div class="spinner" id="loading_nava"><div class="bounce1" ></div><div class="bounce2"></div><div class="bounce3"></div></div>' +
        '</div>' + '<div class="row" ><div class="col-lg-6 col-md-12 col-sm-12 col-xs-12"><input type="text" class="form-control rounded-outline-input rounded-input" id ="his_text_' + doc + '"  value="add a comment..."></div>'

        +
        '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12"> <select class="form-control rounded-input" id ="his_op_' + doc + '" > ' +
        '                <option>Not Started</option>' +
        '                <option>On Progress</option>' +
        '                <option>Urgent Action</option>' +
        '                <option>Skipped</option>' +
        '                <option>Follow Up</option>' +
        '<option>Solved</option>' +
        '' +
        '' +
        '								</select></div > ' +
        '<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12" ><button class="btn btn-success btn-anim  btn-rounded" id =\'button_' + doc + '\'  onclick=\'save_history_info("' + doc + '","' + dom + '","' + counter + '","' + owner + '","' + tick_id + '","' + location + '","' + issue + '")\'><i class="fas fa-plus"></i><span class="btn-text">Add</span></button></div></div>' +
        '</div>';
    return myvar

}


function format(doc, dom, status, counter)
{
    var a = "";
    var user = firebase.auth().currentUser;
    var but = "";

    db.collection("domains").doc(dom).collection("tickets").doc(doc).collection("history").orderBy("timestamp", "desc").get().then(function (t)
    {

        t.forEach(function (t)
        {
            if (user.displayName == t.data().name) {
                but = '&nbsp;&nbsp;<a href="javascript:void(0)" onclick=\'delete_history("' + doc + '","' + dom + '","' + counter + '","' + t.id + '")\' class="text-inverse text-danger" title="Delete" data-toggle="tooltip"><i class="zmdi zmdi-delete"></i></a>  &nbsp;&nbsp;';
            }
            a = a + '<div class="sl-item"><a href="javascript:void(0)"><div class="sl-avatar avatar avatar-sm avatar-circle"><img class="img-responsive img-circle" src="' + t.data().photoURL + '" alt="avatar">' +
                '</div><div class="sl-content"><p class="inline-block"><span class="capitalize-font txt-primary mr-5 weight-500">' + t.data().name +
                '</span></p><p>' + tabletolable(t.data().status, true) + '' + but + '</p><p  class="txt-dark"><span>' + t.data().message + '</span></p><span class="block txt-grey font-12 capitalize-font">' +
                '<i class="far fa-calendar-alt"></i>&nbsp;&nbsp;' + datetimeshortformat(t.data().timestamp) + '</span>' +
                '</div></a></div>';


        })

    }).then(function ()
    {
        var c = document.getElementById("his_" + doc);
        var b = document.getElementById("his_op_" + doc);
        if (c) {
            c.innerHTML = a;
        }
        if (b) {
            b.value = status;
        }


    }).catch(function (t)
    {
        badnews(t);
    });
}

function save_history_info(doc, dom, counter, owner, tick_id, location, issue)
{
    console.log(doc);
    console.log(dom);
    console.log(counter);
    console.log(tick_id);
    console.log(location);
    console.log(issue);
    var status = document.getElementById("his_op_" + doc).value;
    var message = document.getElementById("his_text_" + doc).value;
    save_history(doc, dom, counter, status, message, false, owner, tick_id, location, issue);
}


function save_history(doc, dom, counter, status, message, report_flag, owner, tick_id, location, issue)
{
    // console.log("runing slave");



    var created_on = new Date();
    var user = firebase.auth().currentUser;

    var packet;

    if (status == 'Closed') {
        //     console.log("Check");
        packet = ({
            status: status,
            hist_created_on: created_on
        });
    } else {
        packet = ({
            status: status,
            hist_created_on: created_on,
            hist_created_by: user.uid,
            hist_message: message
        });
    }

    db.collection("domains").doc(dom).collection("tickets").doc(doc).update(packet).then(function ()
    {
        db.collection("domains").doc(dom).collection("tickets").doc(doc).collection("history").add({
            name: user.displayName,
            message: message,
            photoURL: document.getElementById("topProImg").src,
            status: status,
            timestamp: created_on
        })
            .then(function (docRef)
            {

                if (!report_flag) {
                    var table = $('#edit_datable_' + dom).DataTable(

                    );

                    format(doc, dom, status, counter);
                    var updated = table.row(counter).data();
                    updated[11] = status;
                    updated[21] = updated[17];
                    if (status != 'Closed') {
                        updated[22] = user.uid;
                        updated[23] = message;
                    }

                    updated = processrow(false, updated, counter);
                    table.row(counter).data(updated).draw();
                } else {
                    format(doc, dom, status, counter);
                    var table = $('#example').DataTable(
                        { "scrollX": true }
                    );
                    table.cell({
                        row: counter,
                        column: 7,
                    }).data(tabletolable(status, true)).draw();
                    table.cell({
                        row: counter,
                        column: 10,
                    }).data("").draw();
                }

                var subject = dom + " | Ticket No : " + tick_id;
                var html_text_2 = '<p><strong>Site : </strong>' + dom + '</p>' +
                    '<p><strong>Ticket No:&nbsp;</strong>' + tick_id + '</p>' +
                    '<p>One of you tickets have been updated.</p>' +
                    '<p><strong>' + user.displayName + '</strong> says <strong>' + message + '</strong></p>' +
                    '<p><strong>New Status :</strong> ' + status + '</p>' +
                    '<p><strong>Issue  : </strong>' + issue + '</p>' +
                    '<p><strong>Location : </strong>' + location + '</p>' +

                    '<p>You could update the ticket via <a href="https://cloudexchange.lk/">https://cloudexchange.lk/</a></p>';

                //               sendmail(find_email(owner), find_email(user.email), subject, html_text_2);
            })
            .catch(function (error)
            {
                badnews("Saving history " + error);

                // console.log(error);
            });
    }).catch(function (error)
    {
        badnews(error)


    })
}



function delete_history(doc, dom, counter, id)
{
    var status = document.getElementById("his_op_" + doc).value;
    db.collection("domains").doc(dom).collection("tickets").doc(doc).collection("history").doc(id).delete()
        .then(function ()
        {
            format(doc, dom, status, counter);
        })
        .catch(function (error)
        {
            badnews("Error deleting document: ", error);
        });

}

function fetch_tickets(t, alpha)
{



    loaded = false;
    loader();
    dataSet2 = [];
    dataSet3 = [];
    dataset = [];

    var user = firebase.auth().currentUser;

    document.getElementById('stats_oc').innerText = 0;
    document.getElementById('stats_cc').innerText = 0;
    document.getElementById('stats_aq').innerText = 0;
    document.getElementById('stats_tc').innerText = 0;
    document.getElementById('total_oc_tickets').innerText = 0;
    document.getElementById('lb_todo').innerText = 0;
    document.getElementById('lb_atten').innerText = 0;
    document.getElementById('lb_allsit').innerText = 0;
    // document.getElementById('currentusers_' + t.name).innerHTML = "";

    var counter_t = 0;
    var total_size = t.length;
    t.forEach(function (t)
    {


        var dataSet = [];
        if (t.name != "Cloud_Exchange") {
            var ass_combo = "";
            ass_combo = document.getElementById('combo_' + t.name);
            var n = document.createElement("option");
            n.text = "---", n.value = "---", ass_combo.add(n);
            var rest = [];
            rest = t.user_list;
            document.getElementById('currentusers_' + t.name).innerHTML = "";
            document.getElementById('description_' + t.name).innerHTML = t.description;
            document.getElementById('title_' + t.name).innerHTML = t.name;
            if (rest.length != 0) {
                rest.forEach(function (entry)
                {

                    try {
                        let obj = user_profiles.find(o => o.id === entry);
                        var n = document.createElement("option");

                        n.text = obj.name;
                        n.value = obj.id, ass_combo.add(n);
                        document.getElementById('currentusers_' + t.name).innerHTML = document.getElementById('currentusers_' + t.name).innerHTML + tabletoimage(obj.id, 35);
                    } catch (e) {

                        Swal.fire({
                            title: 'Stray User detected.',
                            text: entry + " at " + t.name,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes, clean it!'
                        }).then((result) =>
                        {
                            if (result.value) {
                                cleanusers();
                            }
                        })
                    }

                })
            }
            document.getElementById(t.id + '_label2').innerText = 0;

            db.collection("domains").doc(t.id).collection("tickets").orderBy("id", "desc").limit(1).get().then(function (querySnapshot)
            {
                querySnapshot.forEach(function (doc)
                {
                    document.getElementById("stats_tc").innerText = Number(document.getElementById("stats_tc").innerText) + Number(doc.data().id);
                    document.getElementById('currentticket_' + t.id).innerText = doc.data().id;
                    db.collection("domains").doc(t.id).collection("tickets").where("status", ">", alpha).get().then(function (querySnapshot)
                    {


                        querySnapshot.forEach(function (doc)
                        {

                            dataSet.push([doc.id, doc.data().id, t.id, doc.data().location, doc.data().issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', doc.data().status, doc.data().created_by, doc.data().assigned_to_1, doc.data().assigned_to_2, doc.data().assigned_to_3, doc.data().assigned_to_4, doc.data().created_on, 'DUM', 'DUM', doc.data().id, doc.data().hist_created_on || doc.data().created_on, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---"])
                        });
                        document.getElementById("stats_oc").innerText = Number(document.getElementById("stats_oc").innerText) + dataSet.length;
                        loadtable('#edit_datable_' + t.id, dataSet, false);
                        counter_t++;
                        if (counter_t + 1 == total_size) {
                            loaded = true;
                        }


                    }).catch(function (error)
                    {
                        console.log(error);
                        badnews(error)
                    })
                });
            }).catch(function (error)
            {
                console.log(error);
                badnews(error)
            })
        }
    })
}

function tabletoimage(id, size)
{
    if (id == '---') {
        return "";
    } else {
        var nio = user_profiles.find(o => o.id === id);

        if (nio == null) {
            var nullimage = 'image/blank_profile_pic.jpg';
            image = '<img src=' + nullimage + ' class="img-circle bounce sender-img"  alt="user" height="' + size + '" width="' + size + '" title="' + "Not Available" + '">' + "&nbsp;&nbsp;";
            return image;
        } else {
            let obj = user_profiles.find(o => o.id === id);

            var image = '<img src=' + nio.photoUrl + ' class="img-circle bounce sender-img"  alt="user" height="' + size + '" width="' + size + '" title="' + obj.name + '">' + "&nbsp;&nbsp;";
            return image;
        }
    }
}




function find_email(id)
{

    if (id != "---") {
        let obj = user_profiles.find(o => o.id === id);

        var email = obj.email;
        return email;
    } else {
        return " ";
    }




}

function find_name(id)
{
    if (id != "---") {
        let obj = user_profiles.find(o => o.id === id);

        var name = obj.name;
        return name;
    } else {
        return "---";
    }




}

function tabletoname(id)
{
    if (id == '---') {
        return "";
    } else {
        var nio = user_profiles.find(o => o.id === id);

        if (nio == null) {
            return id;
        } else {
            image = " • " + nio.name;

            return image;
        }
    }

}


function tabletolable(expression, animation)
{
    switch (expression) {
        case 'Not Started':
            return '<span class="label label-danger">Not Started</span>'
            break;
        case 'On Progress':
            return '<span class="label c_color5">On Progress</span>'
            break;
        case 'Skipped':
            return '<span class="label label-info">Skipped</span>'
            break;
        case 'Follow Up':
            return '<span class="label c_color3">Follow Up</span>'
            break;
        case 'Urgent Action':
            if (animation) {
                return '<span class="label c_color2 blink_text">Urgent Action!</span>'
            } else {
                return '<span class="label c_color2">Urgent Action!</span>'
            }

            break;
        case 'Closed':
            return '<span class="label label-primary">Closed</span>'
            break;
        case 'Recovered':
            return '<span class="label c_color1">Recovered</span>'
            break;
        case 'Deleted':
            return '<span class="label c_color4">Deleted</span>'
            break;
        case 'Solved':
            return '<span class="label label-success">Solved</span>'
            break;
        default:
            return '<span class="label label-info">ERROR</span>'
            break
    }
}

function call_ticket_modal(t, i, y)
{
    var ass_combo = "";
    ass_combo = document.getElementById('combo_' + t);
    $('#datetimepicker1').datetimepicker({
        useCurrent: !1,
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        },
    });
    $('#datetimepicker1').data("DateTimePicker").date(moment());
    document.getElementById("domain_case").value = t;
    document.getElementById("open_tic_title").innerHTML = '<i class="' + i + '"></i>' + "&nbsp;&nbsp;" + t;
    document.getElementById("opassignee_1").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_2").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_3").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_4").innerHTML = document.getElementById('combo_' + t).innerHTML;

}

function tktedit(com_id, dom_id, counter)
{
    var oTable = $("#edit_datable_" + dom_id).dataTable(

    ),
        dataset = oTable.fnGetData(),
        ticketid = dataset[counter][1],
        location = dataset[counter][3].replace(/<\/?[^>]+(>|$)/g, ""),
        issue = dataset[counter][4].replace(/<\/?[^>]+(>|$)/g, ""),
        status = dataset[counter][11],
        assigned_to1 = dataset[counter][13],
        assigned_to2 = dataset[counter][14],
        assigned_to3 = dataset[counter][15],
        assigned_to4 = dataset[counter][16];
    document.getElementById("ticket_edt_id").value = ticketid, document.getElementById("edtticket_location").value = location,
        document.getElementById("edtticket_issue").value = issue, document.getElementById("edtstatus").value = status,
        document.getElementById("edtassignee1").innerHTML = document.getElementById("combo_" + dom_id).innerHTML,
        document.getElementById("edtassignee2").innerHTML = document.getElementById("combo_" + dom_id).innerHTML,
        document.getElementById("edtassignee3").innerHTML = document.getElementById("combo_" + dom_id).innerHTML,
        document.getElementById("edtassignee4").innerHTML = document.getElementById("combo_" + dom_id).innerHTML,

        document.getElementById("edtassignee1").value = assigned_to1, document.getElementById("edtassignee2").value = assigned_to2,
        document.getElementById("edtassignee3").value = assigned_to3, document.getElementById("edtassignee4").value = assigned_to4,
        document.getElementById("com_id").value = com_id, document.getElementById("dom_id").value = dom_id,
        document.getElementById("counter").value = counter, document.getElementById("ticket_edt_head").innerText = "Ticket No : " + ticketid + "   |    " + location,
        $("#datetimepicker2").datetimepicker({
            useCurrent: !1,
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
        }), $("#datetimepicker2").data("DateTimePicker").date(moment());
}

function tktdelete(com_id, dom_id, counter)
{
    var table = $('#edit_datable_' + dom_id).DataTable();
    var updated = table.row(counter).data();

    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to delete ticket no : " + updated[1].replace(/<\/?[^>]+(>|$)/g, ""),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) =>
    {
        if (result.value) {
            db.collection("domains").doc(dom_id).collection("tickets").doc(com_id).delete().then(function ()
            {

                decrement_tag(updated[2].replace(/<\/?[^>]+(>|$)/g, "") + "_label2");

                updated[11] = 'Deleted';
                updated[13] = '', updated[14] = '', updated[15] = '', updated[16] = '',
                    updated[21] = updated[17];

                updated = processrow(false, updated, counter);

                table.row(counter).data(updated).draw();
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted,',
                    'success'
                );
                //  format_lock(com_id);


                //  var data = processrow(false, [com_id, ticketid, dom_id, location, issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', status, user.uid, assigned_to1, assigned_to2, assigned_to3, assigned_to4, opticket_date, 'DUM', 'DUM', ticketid, opticket_date, user.uid, "---"], counter);



            }).catch(function (error)
            {
                badnews(error);
            });

        }
    })

}

function edittkt_save()
{
    var user = firebase.auth().currentUser;
    var opticket_date = $('#datetimepicker2').data('DateTimePicker').date();
    opticket_date2 = new Date(opticket_date);
    var assigned_to1 = document.getElementById('edtassignee1').value;
    var assigned_to2 = document.getElementById('edtassignee2').value;
    var assigned_to3 = document.getElementById('edtassignee3').value;
    var assigned_to4 = document.getElementById('edtassignee4').value;
    var status = document.getElementById('edtstatus').value;
    var date = document.getElementById('edtdate').value;
    var issue = document.getElementById('edtticket_issue').value;
    var ticketid = Number(document.getElementById('ticket_edt_id').value);
    var location = document.getElementById('edtticket_location').value;
    var com_id = document.getElementById('com_id').value;
    var dom_id = document.getElementById('dom_id').value;
    var counter = document.getElementById('counter').value;
    var user = firebase.auth().currentUser;




    db.collection("domains").doc(dom_id).collection("tickets").doc(com_id).update({
        assigned_to_1: assigned_to1,
        assigned_to_2: assigned_to2,
        assigned_to_3: assigned_to3,
        assigned_to_4: assigned_to4,
        created_by: user.uid,
        created_on: opticket_date2,
        id: ticketid,
        issue: issue,
        location: location,
        status: status
    }).then(function ()
    {

        var data = processrow(false,
            [
                com_id,
                ticketid,
                dom_id,
                location,
                issue,
                'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM',
                status,
                user.uid,
                assigned_to1,
                assigned_to2,
                assigned_to3,
                assigned_to4,
                opticket_date,
                'DUM', 'DUM',
                ticketid,
                opticket_date,
                user.uid,
                "---"], counter);
        var table = $('#edit_datable_' + dom_id).DataTable(

        );
        table.row(counter).data(data).draw();

        Swal.fire({
            title: 'Successfully Updated.',
            text: "Do you want to send email notification to all the assignees?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Send'
        }).then((result) =>
        {
            if (result.value) {
                var subject = dom_id + " | Ticket No : " + ticketid;
                var html_text = '<p><strong>Site : </strong>' + dom_id + '</p>' +
                    '<p><strong>Ticket No:&nbsp;</strong>' + ticketid + '</p>' +
                    '<p><strong>Issue  : </strong>' + issue + '</p>' +
                    '<p><strong>Location : </strong>' + location + '</p>' +

                    '<p><strong>Status :</strong> ' + status + '</p>' +
                    '<p><strong>Created By : </strong>' + user.displayName + '</p>' +
                    '<p>You are receiving this mail as the ticket has been updated and you have have been assinged for this ticket.&nbsp;</p>' +
                    '<p>Please disregard this email, if you have received this information prior.&nbsp;</p>' +
                    '<p>Thank you.</p>' +
                    '<p>You could update the ticket via <a href="https://cloudexchange.lk/">https://cloudexchange.lk/</a></p>';


                // sendmail_as(user.email, find_email(assigned_to1), find_email(assigned_to2), find_email(assigned_to3), find_email(assigned_to4), subject, html_text_2);
                goodnews("Email notifications sent.")
            }
        })




    }).catch(function (error)
    {
        badnews(error)
    })

}

function opentkt_save()
{
    var domain_case = document.getElementById("domain_case").value,
        tick_no = Number(document.getElementById("currentticket_" + domain_case).innerHTML) + 1;
    document.getElementById("stats_oc").innerHTML = Number(document.getElementById("stats_oc").innerHTML) + 1,
        document.getElementById("stats_tc").innerHTML = Number(document.getElementById("stats_tc").innerHTML) + 1,
        document.getElementById("currentticket_" + domain_case).innerHTML = tick_no, document.getElementById("ticket_edt_id").innerHTML = tick_no;
    var user = firebase.auth().currentUser,
        domain_case = document.getElementById("domain_case").value,
        opticket_location = document.getElementById("opticket_location").value,
        opticket_issue = document.getElementById("opticket_issue").value,
        opticket_date = $("#datetimepicker1").data("DateTimePicker").date();
    opticket_date2 = new Date(opticket_date);
    var opstatus = document.getElementById("opstatus").value,
        opassignee_1 = document.getElementById("opassignee_1").value,
        opassignee_2 = document.getElementById("opassignee_2").value,
        opassignee_3 = document.getElementById("opassignee_3").value,
        opassignee_4 = document.getElementById("opassignee_4").value;
    var subject = domain_case + " | Ticket No : " + tick_no;
    var html_text = '<p><strong>Site : </strong>' + domain_case + '</p>' +
        '<p><strong>Ticket No:&nbsp;</strong>' + tick_no + '</p>' +
        '<p><strong>Issue  : </strong>' + opticket_issue + '</p>' +
        '<p><strong>Location : </strong>' + opticket_location + '</p>' +

        '<p><strong>Status :</strong> ' + opstatus + '</p>' +
        '<p><strong>Created By : </strong>' + user.displayName + '</p>' +
        '<p>You are receiving this mail as you have have been assinged for this ticket.&nbsp;</p>' +
        '<p>Thank you.</p>' +
        '<p>You could update the ticket via <a href="https://cloudexchange.lk/">https://cloudexchange.lk/</a></p>';
    if (opassignee_1 != "---") {
        sendmail(find_email(opassignee_1), user.email, subject, html_text);
    }
    if (opassignee_2 != "---") {
        sendmail(find_email(opassignee_2), user.email, subject, html_text);
    }
    if (opassignee_3 != "---") {
        sendmail(find_email(opassignee_3), user.email, subject, html_text);
    }
    if (opassignee_4 != "---") {
        sendmail(find_email(opassignee_4), user.email, subject, html_text);
    }

    //sendmail_as(user.email, find_email(opassignee_1), find_email(opassignee_2), find_email(opassignee_3), find_email(opassignee_4), subject, html_text_2);

    var html_text_2 = '<p><strong>Ticket No:&nbsp;</strong>' + tick_no + '</p>' +
        '<p><strong>Issue  : </strong>' + opticket_issue + '</p>' +
        '<p><strong>Location : </strong>' + opticket_location + '</p>' +
        '<p><strong>Site : </strong>' + domain_case + '</p>' +
        '<p><strong>Status :</strong> ' + opstatus + '</p>' +
        '<p><strong>Assignee 1 : </strong>' + find_name(opassignee_1) + '</p>' +
        '<p><strong>Assignee 2 : </strong>' + find_name(opassignee_2) + '</p>' +
        '<p><strong>Assignee 3 : </strong>' + find_name(opassignee_3) + '</p>' +
        '<p><strong>Assignee 4 : </strong>' + find_name(opassignee_4) + '</p>' +
        '<p>You have created the ticket and all the assignees have been notified.&nbsp;</p>' +
        '<p>Thank you.</p>' +
        '<p>You could update the ticket via <a href="https://cloudexchange.lk/">https://cloudexchange.lk/</a></p>';
    sendmail(user.email, " ", subject, html_text_2);


    var counter = document.getElementById('counter').value;
    "Not Started" == opstatus && increment_tag("stats_aq");
    db.collection("domains").doc(domain_case).collection("tickets").add({
        assigned_to_1: opassignee_1,
        assigned_to_2: opassignee_2,
        assigned_to_3: opassignee_3,
        assigned_to_4: opassignee_4,
        created_by: user.uid,
        created_on: opticket_date2,
        id: tick_no,
        issue: opticket_issue,
        location: opticket_location,
        status: opstatus,
        hist_created_on: opticket_date2,
        hist_created_by: user.uid,
        hist_message: "---"
    }).then(function (doc)
    {
        var data = processrow(false, [doc.id, tick_no, domain_case, opticket_location, opticket_issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', opstatus, user.uid, opassignee_1, opassignee_2, opassignee_3, opassignee_4, opticket_date, 'DUM', 'DUM', tick_no, opticket_date, user.uid, "---"], counter++);
        var table = $('#edit_datable_' + domain_case).DataTable(

        );
        table.row.add(data).draw();
    }).catch(function (error)
    {
        badnews(error), console.log(error);
    });
}

function generateReport()
{

    var sel1 = document.getElementById("sel1").value,
        dataSet = [],
        values = $("#pre-selected-options").val(),
        con_values = [];
    document.getElementById("lb_report").innerHTML = "0", values.forEach(function (entry)
    {
        con_values.push(tabletolable(entry, false) + '<span class="block" id="report_label_' + entry + '">0</span>');
    });
    var dtrange = document.getElementById("dtrange").value;
    document.getElementById("it-range").innerHTML = con_values, [s_date_ticks, e_date_ticks] = dtrange.split(" - "),
        s_date_ticks = new Date(s_date_ticks), e_date_ticks = new Date(e_date_ticks);

    db.collection("domains").doc(sel1).collection("tickets").orderBy("created_on", "asc").startAt(s_date_ticks).endAt(e_date_ticks).get().then(function (querySnapshot)
    {
        querySnapshot.forEach(function (doc)
        {
            values.includes(doc.data().status) && (dataSet.push([doc.id, doc.data().id, sel1, doc.data().location, doc.data().issue, "DUM", "DUM", "DUM", "DUM", "DUM", "DUM", doc.data().status, doc.data().created_by, doc.data().assigned_to_1, doc.data().assigned_to_2, doc.data().assigned_to_3, doc.data().assigned_to_4, doc.data().created_on, "DUM", "DUM", doc.data().id, doc.data().hist_created_on || doc.data().created_on, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---"]),
                increment_tag("lb_report"), increment_tag("report_label_" + doc.data().status));
        }), loadtable("#example", dataSet, !0);
        var el = document.getElementById("div1");
        el.classList.remove("hidden");
    }).catch(function (error)
    {
        console.log(error), badnews(error);
    }), document.getElementById("gn-site").innerHTML = sel1, document.getElementById("dt-range").innerHTML = dtrange;
}

function undo_close_case(com_id, dom_id, counter, owner, tick_id, location, issue)
{
    save_history(com_id, dom_id, counter, "Recovered", "Recovered", true, owner, tick_id, location, issue);
}

function close_case(com_id, dom_id, counter, owner, tick_id, location, issue)
{


    Swal.fire({
        title: 'Are you satisfied?',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Close Case',
        showLoaderOnConfirm: true,
        preConfirm: (message) =>
        {
            return save_history(com_id, dom_id, counter, "Closed", message, false, owner, tick_id, location, issue)
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) =>
    {

        /*   if (result.value) {
              Swal.fire({
                  title: `${result.value.message}'s avatar`,
                  imageUrl: result.value.avatar_url
              })
          } */
    })

}




function sendmail(to, cc, subject, text_html)
{
    db.collection('mail').add({
        to: to,
        cc: cc,
        message: {
            subject: subject,
            text: "text",
            html: text_html,
        }
    }).then(() => console.log('Queued email for delivery!'));
}
