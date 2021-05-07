var dataSet2 = [];
var dataSet3 = [];
var dats = [];
var loaded = false;


function sendmail2() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };
    xhttp.open("POST", "https://reqres.in/api/users/2", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send("Your JSON Data Here");

}



function loadtable2(id, dataset, reportflag, domain_id) {

    for (i = 0; i < dataset.length; i++) {
        processrow(reportflag, dataset[i], i);
    }
    dotable(id, dataset, !1, reportflag, domain_id);


}

function reload_table(dom_id) {
    load_info(dom_id);
    /*     setTimeout(
            function () {
                var table = $('#edit_tic_table_' + dom_id).DataTable();
                //       console.log(table.rows().data());
                table.columns.adjust().draw();
            }, 175); */
}

function load_info(dom_id) {

    document.getElementById("last_Ticket_id").style.visibility = "visible";
    document.getElementById("domain_case2").value = dom_id;
    changeform_ticket();

    document.getElementById("main_title_help").innerHTML = '&nbsp; &nbsp; <i class="' + document.getElementById("icon_" + dom_id).innerHTML + '" ></i>&nbsp; &nbsp; ' + document.getElementById("title_" + dom_id).innerHTML + " - " + document.getElementById("description_" + dom_id).innerHTML;
    document.getElementById("current_user_list").innerHTML = document.getElementById("currentusers_" + dom_id).innerHTML;


    document.getElementById("ticket_currnet").innerHTML = document.getElementById("currentticket_" + dom_id).innerHTML;

}

function load_atten() {
    document.getElementById("last_Ticket_id").style.visibility = "hidden";
    document.getElementById("main_title_help").innerHTML = '<h6 class="panel-title txt-dark" id="main_title_help"><i class="fas fa-ticket-alt mr-20" ></i>Tickets - Attention</h6>';
    document.getElementById("current_user_list").innerHTML = "";
    dotable("#tab2", dataSet3, true, false, "none");
    /*     setTimeout(
            function ()
            {
                var table = $("#tab2").DataTable();
                table.columns.adjust().draw();
                console.log("Readjusted");
            }, 1000); */
}

function todolist() {
    document.getElementById("last_Ticket_id").style.visibility = "hidden";
    document.getElementById("main_title_help").innerHTML = '<h6 class="panel-title txt-dark" id="main_title_help"><i class="fas fa-ticket-alt mr-20" ></i>Tickets - To Do List</h6>';
    document.getElementById("current_user_list").innerHTML = "";


    dotable("#newtb", dataSet2, true, false, "none");

    /*     setTimeout(
            function ()
            {
                var table = $("#newtb").DataTable();
                table.columns.adjust().draw();
                console.log("Readjusted");
            }, 1000); */
}

function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

function wordWrap(str, maxWidth) {
    var newLineStr = "\n";
    done = false;
    res = '';
    while (str.length > maxWidth) {
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

    }

    return res + str;
}




function stringDivider(str, width, spaceReplacer) {
    /*        if (str.length > width) {
              var p = width
              for (; p > 0 && str[p] != ' '; p--) {
              }
              if (p > 0) {
                  var left = str.substring(0, p);
                  var right = str.substring(p + 1);
                  return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
              }
          }  */
    // console.log(str);
    // str = wordWrap(str, 20);
    return str;
}

function strip(a) {
    var index = 0;
    for (index = 0; index < a.length; ++index) {
        if (index == 17 || index == 21) {

        } else {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = a[index];
            a[index] = tmp.textContent || tmp.innerText || "";
            a[index] = a[index].replace("\n", " ");
            a[index] = a[index].replace(/["']/g, "");

        }
    }
    return a
}

function processrow(reportflag, row, i) //
{
    row = strip(row);
    var date2 = new Date(),
        user = firebase.auth().currentUser;
    var buttons = '';
    row[7] = tabletolable(row[11], true),
        row[21] = datetimeshortformat(row[21]);
    row[8] = tabletoimage(row[12], 35), row[9] = tabletoimage(row[13], 35) + tabletoimage(row[14], 35) + tabletoimage(row[15], 35) + tabletoimage(row[16], 35),
        row[18] = tabletoname(row[13]) + tabletoname(row[14]) + tabletoname(row[15]) + tabletoname(row[16]),
        row[19] = tabletoname(row[12]); //increment_tag("total_oc_tickets");
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
            buttons = '<a href="javascript:void(0)" onclick="undo_close_case(' + butns + ')"   class="text-inverse text-sucess" title="" data-toggle="tooltip"><i class="fas fa-undo"></i> Re-Open</a> ';
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
        row[6] = '<span class="inline-block txt-danger soft_zoom weight-500">' +
            Difference_In_Days + ' Days&nbsp;&nbsp;<i class="fas fa-exclamation"></i></span>';
        document.getElementById(row[2] + "_label2").className = "label label-primary";
    } else {
        row[6] = '<span class="inline-block txt-success weight-500">' + Difference_In_Days + " Days</span>";
    }
    row[5] = '<i class="far fa-calendar-alt"></i>&nbsp;&nbsp;' + created_on_date,
        row[3] = '<p class="txt-dark weight-500">' + stringDivider(row[3], 30, "<br/>\n") + "</p>";
    // row[4] = element_add(row[12], stringDivider(row[4], 75, "<br/>\n"), "", 50);
    row[4] = element_add(row[12], row[4], "", 50);
    increment_tag("lb_allsit");
    row[2] = '<span class="capitalize-font txt-primary mr-5 weight-500">' + row[2] + "</span>",
        row[1] = '<h5 class="capitalize-font txt-primary mr-5 weight-500">' + row[1] + "</h5>",
        ("Urgent Action" == row[11] || "Not Started" == row[11] || "On Progress" == row[11]) && (dataSet3.push(row),
            increment_tag("lb_atten")), "Not Started" == row[11] && increment_tag("stats_aq");
    if (row[23] != "---") {
        row[23] = element_add(row[22], row[23], row[21], 40);
    }

    if (user.uid == row[13] || user.uid == row[14] || user.uid == row[15] || user.uid == row[16]) {
        if ("Follow Up" != row[11] && "Solved" != row[11]) {
            dataSet2.push(row);
            increment_tag("lb_todo");
        }


    }
    return row
}

function element_add(image_id, message, timetamp, wrap) {
    var dsa = '<div class="sl-item">' +
        '<a href="javascript:void(0)">' +
        '<div class="sl-avatar">' +
        tabletoimage(image_id, 25) +
        '</div>' +
        '<div class="sl-content">' +
        '<span class="head-notifications">' + stringDivider(message, wrap, "<br/>\n") + '</span>' +

        '<div class="clearfix"></div>' +
        '<span class="inline-block font-11  pull-right notifications-time">' + timetamp + '</span>' +
        '</div>' +
        '</a>' +
        '</div>';
    return dsa
}




function increment_tag(t) {
    var item = document.getElementById(t);
    var number = item.innerHTML;
    number++;
    item.innerHTML = number;
}


function decrement_tag(t) {
    document.getElementById(t).innerText = Number(document.getElementById(t).innerText) - 1;
}

function cleantable(domain, dataset) {
    for (i = 0; i < dataset.length; i++) domain == dataset[i][2].replace(/<\/?[^>]+(>|$)/g, "") && dataset.splice(i, 1);
}
var loo2p;
var inputOptionsPromise = new Promise(function (resolve) {
    // get your data and pass it to resolve()
    setTimeout(function () {
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

function removefollowup() {
    fetch_tickets(total_op, 'E');
}

function dotable(id, dataset, domain_flag, report_flag, domain_id) {

    /* var table_id = 'div_tic_table_' +id;
    var other_table =  'div_jobs_table_' +id; */

    /* id = '#edit_tic_table_' +id; */
    /* document.getElementById(table_id).style.display = "block";
    document.getElementById(other_table).style.display = "none"; */
    var vasi = true;
    if (id == "#newtb" || id == "#tab2") {
        vasi = false;
    } else {
        document.getElementById(domain_id + '_label2').innerText = dataset.length;
        document.getElementById(domain_id + "_label2").className = "label label-primary";
    }

    document.getElementById('setting_panel_btn').style.visibility = "visible";
    document.getElementById('home_tab_8').style.display = "block";
    document.getElementById('home_tab_9').style.display = "block";
    document.getElementById('txt_last').innerText = 'Last Ticket No';




    var button_class = "btn btn-primary btn-rounded";
    var reports_text = "The information is from cloudexchange.lk",
        selection = {
            columns: [2, 3, 4, 5, 7, 18, 19, 21, 23]
        },
        buttons_pack = [{
            extend: "copy",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection,
            background: !1
        }, {
            extend: "csvHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "excelHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "pdfHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "print",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            text: "Page-Cycle",
            className: button_class,
            action: function () {

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

                }).then((result) => {
                    if (result.value) {
                        var inter = result.value * 1000;
                        clearInterval(loo2p), loo2p = setInterval(function () {

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
        }, {
            text: "Report",
            className: button_class,
            action: function () {
                $("#reportModal").modal();
                call_report_modal(domain_id);
            }
        }




        ]

    var table = $(id).DataTable({
        order: [
            [20, "desc"]
        ],
        dom: 'frtiBp',
        bInfo: !1,
        "searching": false,
        pageLength: 10,
        buttons: buttons_pack,
        destroy: !0,
        data: dataset,
        createdRow: function (row, data, dataIndex) {
            user = firebase.auth().currentUser;
            if ((user.uid == data[13] || user.uid == data[14] || user.uid == data[15] || user.uid == data[16]) && !domain_flag) {
                $(row).addClass('red');
            }
        },


        columns: [{
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
            //  responsivePriority: 1,
            /*    render: function (data, type, full, meta) {
                   return full.Issue;
               }, */
        }, {
            title: "Date Created",
            responsivePriority: 1
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
            title: "Actions",
            visible: vasi
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
        }
        ],
    })


    // Add event listener for opening and closing details
    $(id + ' tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var data = row.data();
        data = strip(data);
        var counter = row.index();
        var doc = data[0];
        var item_id = data[1];
        var dom = data[2];
        var loc = data[3];
        var iss = data[4];
        var user = firebase.auth().currentUser;
        var ass_1 = data[13];
        var ass_2 = data[14];
        var ass_3 = data[15];
        var ass_4 = data[16];
        var owner = data[12];
        var status = data[11];
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        } else {

            row.child(ter(doc, dom, status, counter, owner, item_id, loc, iss, ass_1, ass_2, ass_3, ass_4)).show();
            if (user.uid == ass_1 || user.uid == ass_2 || user.uid == ass_3 || user.uid == ass_4 || user.uid == owner) {
                format(doc, dom, status, item_id);
                document.getElementById("h_" + doc).innerHTML = "";
            } else {

                document.getElementById("h_" + doc).innerHTML = "<p class='text-center' ><i class='fas fa-lock'></i>&nbsp;&nbsp;You have not been assigned for this job.</br></p><br>";

                format(doc, dom, status, item_id);
                format_lock(doc);
            }

            tr.addClass('shown');
            /*      
                   $('his_datetime_' + doc).daterangepicker({
                       timePicker: true,
                       startDate: moment().startOf('hour'),
                       endDate: moment().startOf('hour').add(32, 'hour'),
                       locale: {
                         format: 'M/DD hh:mm A'
                       }
                     }); */
            //      'his_datetime_' + doc
            //    '.input-daterange-timepicker'
            $('#his_datetime_' + doc).daterangepicker({
                timePicker: true,
                startDate: moment().startOf('hour'),
                endDate: moment().startOf('hour').add(1, 'hour'),
                locale: {
                    format: 'M/DD/YYYY hh:mm A'
                }

            });
            $(".select2").select2();
            $('.selectpicker').selectpicker();

        }
    });


}

function format_lock(doc) {

    document.getElementById("button_" + doc).disabled = true;
    document.getElementById("his_" + doc).disabled = true;
    document.getElementById("histes_" + doc).disabled = true;

    document.getElementById("his_op_" + doc).disabled = true;
    document.getElementById("his_text_" + doc).disabled = true;
    document.getElementById("his_op_sel_" + doc).disabled = true;
    document.getElementById("his_datetime_" + doc).disabled = true;


    /*  var c = document.getElementById("his_" + doc);
     //   var b = document.getElementById("his_op_" + doc);
       c.innerHTML = c.innerHTML+"<p class='text-center' ><i class='fas fa-lock'></i>&nbsp;&nbsp;You have not been assigned for this job.</br></p>"; */
    //b.value = "locked";

}


function select_build(x, y) {
    if (x == '---' || x == y) {
        return ''
    } else {
        x = '<option value="' + x + '">' + tabletoname(x) + '</option>';
        return x
    }
}

function ter(doc, dom, status, counter, owner, tick_id, location, issue, ass_1, ass_2, ass_3, ass_4) {
    var lock = '<div  id="h_' + doc + '"></div><div class="streamline user-activity" id="his_' + doc + '">' +
        ' <div class="spinner" id="loading_nava"><div class="bounce1" ></div><div class="bounce2"></div><div class="bounce3"></div></div>' +
        '</div>';




    var swticher = '<select class="form-control rounded-input" id ="his_op_sel_' + doc + '" > ' +
        '                <option>Not Chargable</option>' +
        '                <option>Chargable</option>' +
        '                <option>Warrenty</option>' +
        '                <option>Maintenance</option>' +
        '                <option>Other</option>' +
        '								</select>';






    /*     var checkbox = '<div class="checkbox mr-15">'+
        '													<input id="his_check_' + doc + '"  type="checkbox" >'+
        '													<label for="checkbox_inline">'+
        '														Chargable'+
        '													</label>'+
        '												</div>';
             */
    var string_1 = select_build(ass_1, owner);
    var string_2 = select_build(ass_2, owner);
    var string_3 = select_build(ass_3, owner);
    var string_4 = select_build(ass_4, owner);
    var string = string_1 + string_2 + string_3 + string_4;
    var myvar2 = '<div class="panel-body">' + lock +

        '													<br>' +
        '<div class="row">' +
        '														<div class="col-sm-12">' +
        '															<div class="col-sm-3">' +
        '<input type="text" class="form-control rounded-outline-input rounded-input" id ="his_text_' + doc + '" placeholder="Observations & Comments" value="">' +
        '															</div>' +
        '<div class="col-sm-2">' +
        '															<select class="selectpicker" multiple data-style="form-control rounded-input" id ="histes_' + doc + '" title="Others Assignees">' + string + '															</select>' +
        '														</div>' +
        '															<div class="col-sm-2">' +
        '<select class="form-control rounded-input" id ="his_op_' + doc + '" > ' +
        '                <option>Not Started</option>' +
        '                <option>On Progress</option>' +
        '                <option>Urgent Action</option>' +
        '                <option>Skipped</option>' +
        '                <option>Follow Up</option>' +
        '<option>Solved</option>' +
        '								</select>' +
        '															</div>' +
        '															<div class="col-sm-2">' +
        '		<input type="text" class="form-control  rounded-outline-input rounded-input input-daterange-timepicker" name="daterange" id="his_datetime_' + doc + '"  value="01/01/2016 1:30 PM - 01/01/2016 2:00 PM"/>' +
        '															</div>' +
        '															<div class="col-sm-2">' +
        swticher +
        '															</div>' +
        '															<div class="col-sm-1 text-right">' +
        '<button class="btn btn-success btn-anim  btn-rounded" id =\'button_' + doc + '\'  onclick=\'save_history_info("' + doc + '","' + dom + '","' + counter + '","' + owner + '","' + tick_id + '","' + location + '","' + issue + '")\'><i class="fas fa-plus"></i><span class="btn-text">Add</span></button>' +
        '															</div>' +
        '														</div>' +
        '													</div>	' +
        '									</div>';

    return myvar2

}






function format(doc, dom, status, counter) {

    var x = '<table class="table  border-none dataTable no-footer" >' +
        '  <thead>' +
        '    <tr role="row"><th class="sorting_asc" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Job ID: activate to sort column descending" style="width: 25px;height:25px">Job ID</th><th class="sorting_asc" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-sort="ascending" aria-label="ticket ID: activate to sort column descending" style="width: 25px;">Observations & Comments</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">Date</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">Start Time</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">End Time</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">Hours</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">Chargable</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending" style="width: 58px;">Others</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Status: activate to sort column ascending" style="width: 72px;">Status</th><th class="sorting" tabindex="0" aria-controls="support_table" rowspan="1" colspan="1" aria-label="Actions: activate to sort column ascending" style="width: 75px;">Actions</th></tr>' +
        '  </thead>' +
        '  <tbody>   ';



    var a = "";
    var y = "";
    var user = firebase.auth().currentUser;
    var but = "";

    db.collection("domains").doc(dom).collection("job_sheets").where("ticket_doc_id", "==", doc).orderBy("timestamp").get().then(function (t) {
        var count = 1;
        t.forEach(function (t) {
            if (user.displayName == t.data().name) {
                but = '&nbsp;&nbsp;<a href="javascript:void(0)" onclick=\'delete_history("' + doc + '","' + dom + '","' + counter + '","' + t.id + '")\' class="text-inverse text-danger" title="Delete" data-toggle="tooltip"><i class="zmdi zmdi-delete"></i></a>  &nbsp;&nbsp;';
            }
            /*    a = a + '<div class="sl-item"><a href="javascript:void(0)"><div class="sl-avatar avatar avatar-sm avatar-circle"><img class="img-responsive img-circle" src="' + t.data().photoURL + '" alt="avatar">' +
                   '</div><div class="sl-content"><p class="inline-block"><span class="capitalize-font txt-primary mr-5 weight-500">' + t.data().name +
                   '</span></p><p>' + tabletolable(t.data().status, true) + '' + but + '</p><p  class="txt-dark"><span>' + t.data().message + '</span></p>'+
                   '<span class="block txt-grey font-12 capitalize-font">' +
                   '<i class="far fa-calendar-alt"></i>&nbsp;&nbsp;' + datetimeshortformat(t.data().timestamp) + '</span>' +
                   '<span class="block txt-grey font-12 capitalize-font">' +
                   '<label>Chargable</label>&nbsp;&nbsp;' + t.data().chargable + '</span>' +
                   '<label>Start Time</label>&nbsp;&nbsp;' + t.data().start_time + '</span><br>' +
                   '<label>End Time</label>&nbsp;&nbsp;' + t.data().end_time + '</span><br>' +
                   '<label>Job No : </label>&nbsp;&nbsp;'+counter+"."+(count++) + '</span>' +
                   '</div></a></div>'; */
            var hours = Math.round((Math.abs(new Date(t.data().start_time) - new Date(t.data().end_time))) / (60 * 60 * 1000));

            var test = '';
            if (t.data().user_id !== undefined && t.data().user_id !== null) {
                test = tabletoimage(t.data().user_id);
            } else {
                test = '<img src="' + t.data().photoURL + '+ class="img-circle bounce sender-img" alt="user" height="25" width="25" title=' + t.data().name + '>'
            }
            y = y + '  <tr role="row" class="odd">' +
                '<td><h5 class="capitalize-font txt-primary mr-5 weight-500">#' + t.data().job_num + '</h5></td>' +
                '<td><div class="sl-item"><a href="javascript:void(0)"><div class="sl-avatar">' + test + '</div><div class="sl-content"><span class="head-notifications">' + t.data().message + '</span><div class="clearfix"></div><span class="inline-block font-11  pull-right notifications-time"></span></div></a></div></td>' +
                '<td><i class="far fa-calendar-alt"></i>&nbsp;&nbsp;' + datetimeshortformat(t.data().timestamp) + '</td>' +
                '      <td><i class="far fa-clock"></i>&nbsp;&nbsp;' + formatAMPM(t.data().start_time) + '</td>' +
                '      <td><i class="far fa-clock"></i>&nbsp;&nbsp;' + formatAMPM(t.data().end_time) + '</td>' +

                '      <td>' + hours + '</td>' +
                '      <td>' + t.data().chargable + '</td>' +
                '      <td>&nbsp;&nbsp;' + gen_image_linups(t.data().others) + '</td>' +
                '      <td>' +
                tabletolable(t.data().status, true) +
                '      </td>' +
                '      <td>' + but + '</td>' +
                '    </tr>';


        })

    }).then(function () {
        var c = document.getElementById("his_" + doc);
        var b = document.getElementById("his_op_" + doc);
        if (c) {
            c.innerHTML = x + y + '</tbody></table>';
        }
        if (b) {
            b.value = status;
        }


    }).catch(function (t) {
        console.log(t);
        badnews(t);
    });
}


function gen_image_linups(x) {

    if (x !== undefined && x !== null) {
        var string = '';
        for (i = 0; i < x.length; i++) {
            string = string + tabletoimage(x[i], 35);

        }

        return string;
    } else {
        return ''
    }
}

function save_history_info(doc, dom, counter, owner, tick_id, location, issue) {

    var status = document.getElementById("his_op_" + doc).value;
    var message = document.getElementById("his_text_" + doc).value;
    var dt_range = document.getElementById("his_datetime_" + doc).value;
    var chargable = document.getElementById("his_op_sel_" + doc).value;
    var others = $("#histes_" + doc).val();
    if (others == null) {
        others = '---';
    }

    console.log(others);

    var dt = dt_range.split(' - ');
    var start_dt = dt[0];
    var end_dt = dt[1];
    if (message != '') {
        save_history(doc, dom, counter, status, message, false, owner, tick_id, location, issue, start_dt, end_dt, chargable, others);
    } else {
        badnews('Message Feild is empty.');
    }

}


function save_history(doc, dom, counter, status, message, report_flag, owner, tick_id, location, issue, start_dt, end_dt, chargable, others) {
    // console.log("runing slave");



    var created_on = new Date();
    var user = firebase.auth().currentUser;



    /* 
        var packet; */
    /* 
        if (status == 'Closed') {
            //     console.log("Check");
            packet = ({
                status: status,
                hist_created_on: created_on
            });
        } else { */
    var packet = ({
        status: status,
        hist_created_on: created_on,
        hist_created_by: user.uid,
        hist_message: message,
    });
    /*   } */
    /*   var domain_db = db.collection("domains").doc(dom);
      domain_db.update({
        job_sheet_no: firebase.firestore.FieldValue.increment(1);
    });
    
    
    domain_db.get().then((doc) => {
            console.log("Document data:", doc.data()); 
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
    
     */
    var last_job_num = 1;
    db.collection("domains").doc(dom).collection("job_sheets").orderBy("job_num", "desc").limit(1).get().then(function (querySnapshot) {

        querySnapshot.forEach(function (doc) {
            last_job_num = last_job_num + Number(doc.data().job_num);
        });

        db.collection("domains").doc(dom).collection("tickets").doc(doc).update(packet).then(function () {
            /*     db.collection("domains").doc(dom).collection("tickets").doc(doc).collection("history").add({ */
            db.collection("domains").doc(dom).collection("job_sheets").add({
                //  name: user.displayName,
                message: message,
                //    photoURL: document.getElementById("topProImg").src,
                user_id: user.uid,
                others: others,
                status: status,
                timestamp: created_on,
                start_time: start_dt,
                end_time: end_dt,
                chargable: chargable,
                ticket_doc_id: doc,
                ticket_id: tick_id,
                job_num: last_job_num
            })
                .then(function (docRef) {

                    if (!report_flag) {
                        var table = $('#edit_tic_table_' + dom).DataTable(

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
                        var table = $('#example').DataTable();
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

                    sendmail(find_email(owner), user.email, subject, html_text_2);
                    goodnews("Your jobsheet was added successfully!");
                })
                .catch(function (error) {
                    badnews("Saving history " + error);

                    // console.log(error);
                });
        }).catch(function (error) {
            badnews(error)


        })


    });



}

function close_only_case(doc, dom, counter, status, message, report_flag, owner, tick_id, location, issue, start_dt, end_dt, chargable) {
    var created_on = new Date();
    var user = firebase.auth().currentUser;

    var packet = ({
        status: status,
        hist_created_on: created_on,
        hist_created_by: user.uid,
        hist_message: message
    });

    db.collection("domains").doc(dom).collection("tickets").doc(doc).update(packet).then(function () {


        if (!report_flag) {
            var table = $('#edit_tic_table_' + dom).DataTable(

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
            var table = $('#example').DataTable();
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
        sendmail(find_email(owner), find_email(user.email), subject, html_text_2);
    });



}

function delete_history(doc, dom, counter, id) {
    var status = document.getElementById("his_op_" + doc).value;



    db.collection("domains").doc(dom).collection("job_sheets").doc(id).delete()
        .then(function () {
            format(doc, dom, status, counter);
        })
        .catch(function (error) {
            badnews("Error deleting document: ", error);
        });

}
var status_c = [];
status_c['Not Started'] = 0;
status_c['On Progress'] = 0;
status_c['Urgent Action'] = 0;
status_c['Skipped'] = 0;
status_c['Follow Up'] = 0;
status_c['Solved'] = 0;
status_c['Total'] = 0;


var m_status_c = [];
m_status_c['Not Chargeable'] = 0;
m_status_c['Chargeable'] = 0;
m_status_c['Warranty'] = 0;
m_status_c['Maintenance'] = 0;
m_status_c['Other'] = 0;
m_status_c['Total'] = 0;


function count_status_ppm(status) {
    m_status_c['Total']++;
    switch (status) {
        case 'Not Chargable':
            m_status_c['Not Chargeable']++;
            break;
        case 'Not Chargeable':
            m_status_c['Not Chargeable']++;
            break;
        case 'Chargeable':
            m_status_c['Chargeable']++;
            break;
        case 'Chargable':
            m_status_c['Chargeable']++;
            break;
        case 'Warranty':
            m_status_c['Warranty']++;
            break;
        case 'Warrenty':
            m_status_c['Warranty']++;
            break;
        case 'Maintenance':
            m_status_c['Maintenance']++;
            break;
        case 'Other':
            m_status_c['Other']++;
            break;
        default:
            return 0;
            return 6;
    }

}

function count_status(status) {
    switch (status) {
        case 'Not Started':
            status_c['Not Started']++;
            break;
        case 'On Progress':
            status_c['On Progress']++;
            break;
        case 'Urgent Action':
            status_c['Urgent Action']++;
            break;
        case 'Follow Up':
            status_c['Follow Up']++;
            break;
        case 'Solved':
            status_c['Solved']++;
            break;
        default:
        // code block
    }
    status_c['Total']++;
}
var status_c_date = [];
var user_c_date = [];



var c_date = [];
var c_date_list = [];

var data_setta = [];
var domain_list = [];
var user_list = [];
var weekly_tickets = 0;
var monthly_tickets = 0;
var status_addressed = 0;

function status_codes(status) {
    switch (status) {
        case 'Not Started':
            return 1;
            break;
        case 'Follow Up':
            return 2;
            break;
        case 'On Progress':
            return 3;
            break;
        case 'Urgent Action':
            return 4;
            break;
        case 'Solved':
            return 5;
            break;
        default:
            return 0;
            return 6;
    }

}

function status_codes_reversed(status) {
    switch (status) {
        case 1:
            return 'Not Started';
            break;
        case 2:
            return 'Follow Up';
            break;
        case 3:
            return 'On Progress';
            break;
        case 4:
            return 'Urgent Action';
            break;
        case 5:
            return 'Solved';
            break;
        default:
            // code block
            return 0;
    }

}
function jobstatus_codes(status) {
    switch (status) {
        case 'Not Chargable':
            return 1;
            break;
        case 'Not Chargeable':
            return 1;
            break;
        case 'Chargeable':
            return 2;
            break;
        case 'Chargable':
            return 2;
            break;
        case 'Warranty':
            return 3;
            break;
        case 'Warrenty':
            return 3;
            break;
        case 'Maintenance':
            return 4;
            break;
        case 'Other':
            return 5;
            break;
        default:
            return 0;
            return 6;
    }

}

function jobstatus_codes_reversed(status) {
    switch (status) {
        case 1:
            return 'Not-Chargeable';
            break;
        case 2:
            return 'Chargeable';
            break;
        case 3:
            return 'Warranty';
            break;
        case 4:
            return 'Maintenance';
            break;
        case 5:
            return 'Other';
            break;
        default:
            // code block
            return 0;
    }

}
function count_staus_perdate(domain, created_on, issue, status, location, by, message) {

    if (domain != "Cloud_Exchange") {
        var phrase = created_on.toDate().getFullYear() + "/" + created_on.toDate().getMonth() + "/" + ('0' + created_on.toDate().getDate()).slice(-2);
        var date1 = created_on.toDate();
        var date2 = new Date();
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Math.round(Difference_In_Time / 864e5);
        if (Difference_In_Days < 7) {
            weekly_tickets++;
        }
        if (Difference_In_Days < 30) {
            monthly_tickets++;
        }
        if (status == 'Follow Up' || status == 'Solved') {
            status_addressed++;
        }
        if (status_c_date.hasOwnProperty(domain)) {
            status_c_date[[domain]]++;
        } else {
            domain_list.push(domain);
            status_c_date[[domain]] = 0;
        }
        data_setta.push([phrase, status_codes(status), domain, issue, status, location, Difference_In_Days, by, message]);
    }
}


function count_staus_perdate_j(domain, start_time, end_time, chargable, created_on, status, message, user_id, others, ticket_id, name, url) {

    if (domain != "Cloud_Exchange") {
        var phrase = created_on.toDate().getFullYear() + "/" + created_on.toDate().getMonth() + "/" + ('0' + created_on.toDate().getDate()).slice(-2);
        var date1 = created_on.toDate();
        var date2 = new Date();
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Math.round(Difference_In_Time / 864e5);

        var hours = Math.round((Math.abs(new Date(start_time) - new Date(end_time))) / (60 * 60 * 1000));


        if (Difference_In_Days < 7) {
            weekly_tickets++;
        }
        if (Difference_In_Days < 30) {
            monthly_tickets++;
        }
        if (chargable == 'Not Chargable' || chargable == 'Not Chargeable') {
            status_addressed++;
        }
        if (status_c_date.hasOwnProperty(domain)) {
            status_c_date[[domain]]++;
        } else {
            domain_list.push(domain);
            status_c_date[[domain]] = 0;
        }


        if (user_c_date.hasOwnProperty(user_id)) {
            user_c_date[[user_id]]++;
        } else {
            user_list.push(user_id);
            user_c_date[[user_id]] = 1;
        }




        if (c_date.hasOwnProperty(phrase)) {
            c_date[[phrase]] = c_date[[phrase]] + hours;
        } else {
            c_date_list.push(phrase);
            c_date[[phrase]] = hours;
        }


      



        data_setta.push([phrase, jobstatus_codes(chargable), domain, status, hours, Difference_In_Days, chargable, message, user_id, ticket_id, name, url]);
    }
}










function dotable2(id, dataset, domain_flag, report_flag, domain_id) {

    var table_id = 'div_jobs_table_' + id;
    var other_table = 'div_tic_table_' + id;

    document.getElementById(table_id).style.display = "block";
    document.getElementById(other_table).style.display = "none";
    document.getElementById('home_tab_8').style.display = "none";
    document.getElementById('home_tab_9').style.display = "none";
    document.getElementById('home_tab_7').click();
    document.getElementById('setting_panel_btn').style.visibility = "hidden";
    document.getElementById(id + '_label2').innerText = dataset.length;
    document.getElementById(id + "_label2").className = "label label-primary";
    document.getElementById('currentticket_' + id).innerText = dataset.length;
    document.getElementById('txt_last').innerText = 'Last Job No';


    // document.getElementById('total_oc_jobsheets').innerText =  Number(document.getElementById('total_oc_jobsheets').innerText)+dataset.length; 
    var button_class = "btn btn-primary btn-rounded";
    var reports_text = "The information is from cloudexchange.lk",
        selection = {
            columns: [2, 3, 4, 5, 7, 18, 19, 21, 23]
        },
        buttons_pack = [{
            extend: "copy",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection,
            background: !1
        }, {
            extend: "csvHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "excelHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "pdfHtml5",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            extend: "print",
            className: button_class,
            messageTop: reports_text,
            exportOptions: selection
        }, {
            text: "Page-Cycle",
            className: button_class,
            action: function () {

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

                }).then((result) => {
                    if (result.value) {
                        var inter = result.value * 1000;
                        clearInterval(loo2p), loo2p = setInterval(function () {

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
        }, {
            text: "Report",
            className: button_class,
            action: function () {
                $("#reportModal").modal();
                call_report_modal(domain_id);




            }
        }




        ]
    var table = $('#edit_jobs_table_' + id).DataTable({
        order: [
            [8, "desc"]
        ],
        dom: 'frtipB ',
        bInfo: !1,
        pageLength: 25,
        buttons: buttons_pack,

        destroy: !0,
        data: dataset,
        columnDefs: [
            {
                title: 'Job No',
                targets: 0,
                orderable: false,
                render: function (data, type, full, meta) {

                    return '<span class="capitalize-font txt-primary mr-5 weight-500">#' + data + "</span>";
                },
            },
            {
                title: 'Ticket No',
                targets: 1,
                orderable: false,
                render: function (data, type, full, meta) {

                    return '<span class="capitalize-font txt-primary mr-5 weight-500">#' + data + "</span>";
                },
            }, {
                title: 'Observations & Comments',
                targets: 2,
                orderable: false,
                render: function (data, type, full, meta) {

                    var name = '';
                    if (full[3] !== undefined && full[3] !== null) {
                        name = full[3];
                    }
                    var test = '';
                    if (full[11] !== undefined && full[11] !== null && full[11] !== '') {
                        test = tabletoimage(full[11], 25);
                    } else {
                        test = '<img src="' + full[4] + '+ class="img-circle bounce sender-img" alt="user" height="25" width="25" title=' + name + '>'
                    }

                    var ds = '<div class="sl-item"><a href="javascript:void(0)"><div class="sl-avatar">' + test + '</div><div class="sl-content"><span class="head-notifications">' + full[2] + '</span><div class="clearfix"></div><span class="inline-block font-11  pull-right notifications-time"></span></div></a></div>';


                    return ds;
                },
            },
            {
                title: 'Others',
                targets: 4,
                orderable: false,
                render: function (data, type, full, meta) {
                    if (full[12] !== '---') {
                        return gen_image_linups(full[12]);
                    }
                    return '';
                },
            }, {
                targets: 3,

                visible: !1
            },
            {
                title: 'Status',
                targets: 5,
                orderable: false,
                render: function (data, type, full, meta) {
                    return tabletolable(data, false);
                },
            },
            {
                title: 'Start Time',
                targets: 6,
                orderable: false,
                render: function (data, type, full, meta) {
                    return '<i class="far fa-clock"></i>&nbsp;&nbsp;' + formatAMPM(data);
                },
            },
            {
                title: 'End Time',
                targets: 7,
                orderable: false,
                render: function (data, type, full, meta) {

                    return '<i class="far fa-clock"></i>&nbsp;&nbsp;' + formatAMPM(data);
                },
            },
            {
                title: 'Hours',
                targets: 8,
                orderable: false,
                render: function (data, type, full, meta) {

                    var hours = Math.round((Math.abs(new Date(full[6]) - new Date(full[7]))) / (60 * 60 * 1000));
                    return hours;
                },
            },
            {
                title: 'Created On',
                targets: 9,
                orderable: false,
                render: function (data, type, full, meta) {

                    return '<i class="far fa-clock"></i>&nbsp;&nbsp;' + datetimeshortformat(data);
                },
            },
            {
                title: 'Type',
                targets: 10,
                orderable: false,
                render: function (data, type, full, meta) {

                    return data;
                },
            }
        ],
    })



}


function fetch_tickets(t, alpha, type) {

    var open_flag = true;

    loaded = false;
    loader();
    dataSet2 = [];
    dataSet3 = [];
    dataset = [];



    var total_cases_tick = 0;
    var total_open_cases = 0;
    document.getElementById('stats_oc').innerText = 0;
    document.getElementById('stats_cc').innerText = 0;
    document.getElementById('stats_aq').innerText = 0;
    document.getElementById('stats_tc').innerText = 0;
    //  document.getElementById('total_oc_tickets').innerText = 0;
    document.getElementById('lb_todo').innerText = 0;
    document.getElementById('lb_atten').innerText = 0;
    document.getElementById('lb_allsit').innerText = 0;
    //  document.getElementById('currentusers_' + t.name).innerHTML = "";
    var counter_t = 1;
    var for_loop_count = 0;
    var total_size = t.length;
    t.forEach(function (t) {
        for_loop_count++;
        var dataSet = [];
        if (t.name != "Cloud_Exchange") {
            var ass_combo = "";
            document.getElementById('combo_' + t.name).innerHTML = '';
            ass_combo = document.getElementById('combo_' + t.name);
            var n = document.createElement("option");
            n.text = "---", n.value = "---", ass_combo.add(n);
            var rest = [];
            rest = t.user_list;
            document.getElementById('currentusers_' + t.name).innerHTML = "";
            document.getElementById('description_' + t.name).innerHTML = t.description;
            //getsiteicon
            document.getElementById('title_' + t.name).innerHTML = t.name;
            document.getElementById('icon_' + t.name).innerHTML = getsiteicon(t.type);
            if (rest.length != 0) {
                rest.forEach(function (entry) {
                    try {
                        let obj = user_profiles.find(o => o.id === entry);
                        var n = document.createElement("option");
                        n.text = obj.name;
                        n.value = obj.id, ass_combo.add(n);
                        document.getElementById('currentusers_' + t.name).innerHTML = document.getElementById('currentusers_' + t.name).innerHTML + tabletoimage(obj.id, 35);

                    } catch (e) {
                        //  console.log(e);
                        /* 
                                                Swal.fire({
                                                    title: 'Stray User detected.',
                                                    text: entry + " at " + t.name,
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#3085d6',
                                                    cancelButtonColor: '#d33',
                                                    confirmButtonText: 'Yes, clean it!'
                                                }).then((result) => {
                                                    if (result.value) {
                                                        cleanusers();
                                                    }
                                                }) */
                    }

                })
            }
            document.getElementById(t.id + '_label2').innerText = 0;


            switch (type) {
                case 'jobsheets':
                    db.collection("domains").doc(t.id).collection("job_sheets").get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {

                            if (doc.data().status == 'Closed' || doc.data().status == 'Solved') {
                                total_open_cases++;
                            }
                            count_status_ppm(doc.data().chargable);
                            if (t.id != "Cloud_Exchange") {

                                count_staus_perdate_j(t.id, doc.data().start_time, doc.data().end_time, doc.data().chargable, doc.data().timestamp, doc.data().status, doc.data().message, doc.data().user_id || '', doc.data().others || '---', doc.data().ticket_id, doc.data().name, doc.data().photoURL);
                            }


                            dataSet.push([doc.data().job_num, doc.data().ticket_id, doc.data().message, doc.data().name || '', doc.data().photoURL || '', doc.data().status, doc.data().start_time, doc.data().end_time, doc.data().ticket_doc_id, doc.data().timestamp, doc.data().chargable, doc.data().user_id || '', doc.data().others || '---']);
                        });
                        total_cases_tick = total_cases_tick + querySnapshot.size;
                        // loadtable3(t.id, dataSet, false, t.id);
                        dotable2(t.id, dataSet, !1, false, t.id);
                        counter_t++;

                        if (counter_t + 1 == total_size) {
                            loaded = true;
                            document.getElementById("stats_tc").innerText = total_cases_tick;
                            document.getElementById("stats_oc").innerText = total_open_cases;
                            document.getElementById("lb_allsit").innerText = total_open_cases;
                            document.getElementById("stats_cc").innerText = total_cases_tick - total_open_cases;
                        }

                    }).catch(function (error) {
                        console.log(error);
                        badnews(error)
                    });
                    break;
                case 'tickets':

                    db.collection("domains").doc(t.id).collection("tickets").orderBy("id", "desc").limit(1).get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {

                            total_cases_tick = total_cases_tick + Number(doc.data().id);
                            document.getElementById('currentticket_' + t.id).innerText = doc.data().id;
                            db.collection("domains").doc(t.id).collection("tickets").where("status", ">", alpha).get().then(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {
                                    count_status(doc.data().status);
                                    if (t.id != "Cloud_Exchange") {
                                        count_staus_perdate(t.id, doc.data().created_on, doc.data().issue, doc.data().status, doc.data().location, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---");
                                    }

                                    dataSet.push([doc.id, doc.data().id, t.id, doc.data().location, doc.data().issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', doc.data().status, doc.data().created_by, doc.data().assigned_to_1, doc.data().assigned_to_2, doc.data().assigned_to_3, doc.data().assigned_to_4, doc.data().created_on, 'DUM', 'DUM', doc.data().id, doc.data().hist_created_on || doc.data().created_on, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---"])
                                });
                                total_open_cases = total_open_cases + dataSet.length;
                                var id = '#edit_tic_table_' + t.id;
                                loadtable2(id, dataSet, false, t.id);
                                var table_id = 'div_tic_table_' + t.id;
                                var other_table = 'div_jobs_table_' + t.id;
                                document.getElementById(table_id).style.display = "block";
                                document.getElementById(other_table).style.display = "none";
                                counter_t++;

                                if (counter_t + 1 == total_size) {
                                    loaded = true;
                                    document.getElementById("stats_tc").innerText = total_cases_tick;
                                    document.getElementById("stats_oc").innerText = total_open_cases;
                                    document.getElementById("stats_cc").innerText = total_cases_tick - total_open_cases;

                                }


                            }).catch(function (error) {
                                console.log(error);
                                badnews(error)
                            })
                        });
                    }).catch(function (error) {
                        console.log(error);
                        badnews(error)
                    });
                    break;
                default:
                // code block
            }

            if (open_flag) {
                load_info(t.name);
                open_flag = false;
            }

        }
        if (for_loop_count == total_size) {
            setTimeout(
                function () {

                    switch (type) {
                        case 'jobsheets':
                            generate_jobsheet_data();

                            break;
                        case 'tickets':
                            generate_ticket_data();
                            break;
                        default:
                        // code block
                    }





                    //  console.log(status_c_date);
                    // console.log(data_setta);

                }, 5000);

        }
    })

}

function tabletoimage(id, size) {
    if (id == '---') {
        return "";
    } else {
        var nio = user_profiles.find(o => o.id === id);

        if (nio == null) {
            var nullimage = 'image/blank_profile_pic.jpg';
            image = '<img src=' + nullimage + ' class="img-circle bounce sender-img"  alt="user" height="' + size + '" width="' + size + '" title="' + "Not Available" + '">' + "&nbsp;&nbsp;";
            return image;
        } else {
            //    let obj = user_profiles.find(o => o.id === id);

            var image = '<img src=' + nio.photoUrl + ' class="img-circle bounce sender-img"  alt="user" height="' + size + '" width="' + size + '" title="' + nio.name + '">' + "&nbsp;&nbsp;";
            return image;
        }
    }
}


function find_siteicon(id) {

    if (id != "---") {
        let obj = site_profile.find(o => o.id === id);
        var type = obj.type;
        return type;
    } else {
        return " ";
    }
}


function find_email(id) {

    if (id != "---") {
        let obj = user_profiles.find(o => o.id === id);

        var email = obj.email;
        return email;
    } else {
        return " ";
    }
}

function find_name(id) {
    if (id != "---") {
        let obj = user_profiles.find(o => o.id === id);

        var name = obj.name;
        return name;
    } else {
        return "---";
    }




}

function tabletoname(id) {
    if (id == '---') {
        return "";
    } else {
        var nio = user_profiles.find(o => o.id === id);

        if (nio == null) {
            return id;
        } else {
            image = nio.name;

            return image;
        }
    }

}


function tabletolable(expression, animation) {
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

function changeform_ticket() {

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
    var t = document.getElementById("domain_case2").value;
    document.getElementById("opassignee_1").disabled = false;
    document.getElementById("opassignee_2").disabled = false;
    document.getElementById("opassignee_3").disabled = false;
    document.getElementById("opassignee_4").disabled = false;
    document.getElementById("opticket_issue").disabled = false;
    document.getElementById("opticket_location").disabled = false;

    document.getElementById("datetimepicker1").disabled = false;
    document.getElementById("opstatus").disabled = false;
    document.getElementById("opassignee_1").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_2").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_3").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("opassignee_4").innerHTML = document.getElementById('combo_' + t).innerHTML;
    document.getElementById("open_tic_title").innerHTML = 'New Ticket - <i class="' + getsiteicon(find_siteicon(t)) + '"></i>' + "&nbsp;&nbsp;" + t;
}



function changeform_domain() {
    var t = document.getElementById("sel1").value;
    call_report_modal(t);
}


function call_report_modal(domain_id) {
    if (domain_id != "none") {
        document.getElementById("sel1").value = domain_id;
        document.getElementById("report_title").innerHTML = 'Generate Report - <i class="' + getsiteicon(find_siteicon(domain_id)) + '"></i>' + "&nbsp;&nbsp;" + domain_id;
    } else {
        document.getElementById("sel1").selectedIndex = -1;
        document.getElementById("report_title").innerHTML = 'Generate Report ';
    }

}

function tktedit(com_id, dom_id, counter) {
    var oTable = $("#edit_tic_table_" + dom_id).dataTable(

    ),

        dataset = oTable.fnGetData(),
        ticketid = dataset[counter][1].replace(/<\/?[^>]+(>|$)/g, ""),
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

function tktdelete(com_id, dom_id, counter) {
    var table = $('#edit_tic_table_' + dom_id).DataTable();
    var updated = table.row(counter).data();

    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to delete ticket no : " + updated[1].replace(/<\/?[^>]+(>|$)/g, ""),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            db.collection("domains").doc(dom_id).collection("tickets").doc(com_id).delete().then(function () {

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
                format_lock(com_id);


                //  var data = processrow(false, [com_id, ticketid, dom_id, location, issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', status, user.uid, assigned_to1, assigned_to2, assigned_to3, assigned_to4, opticket_date, 'DUM', 'DUM', ticketid, opticket_date, user.uid, "---"], counter);



            }).catch(function (error) {
                badnews(error);
            });

        }
    })

}

function edittkt_save() {
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
    }).then(function () {

        var data = processrow(false, [
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
            "---"
        ], counter);
        var table = $('#edit_tic_table_' + dom_id).DataTable(

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
        }).then((result) => {
            if (result.value) {
                var subject = dom_id + " | Ticket No : " + ticketid;
                var html_text = '<p><strong>Site : </strong>' + dom_id + '</p>' +
                    '<p><strong>Ticket No:&nbsp;</strong>' + ticketid + '</p>' +
                    '<p><strong>Issue  : </strong>' + issue + '</p>' +
                    '<p><strong>Location : </strong>' + location + '</p>' +

                    '<p><strong>Status :</strong> ' + status + '</p>' +
                    '<p><strong>Created By : </strong>' + user.displayName + '</p>' +
                    '<p>You are receiving this mail as the ticket has been updated and you have have been assigned for this ticket.&nbsp;</p>' +
                    '<p>Please disregard this email, if you have received this information prior.&nbsp;</p>' +
                    '<p>Thank you.</p>' +
                    '<p>You could update the ticket via <a href="https://cloudexchange.lk/">https://cloudexchange.lk/</a></p>';


                sendmail_as(user.email, find_email(assigned_to1), find_email(assigned_to2), find_email(assigned_to3), find_email(assigned_to4), subject, html_text);
                goodnews("Email notifications sent.")
            }
        })




    }).catch(function (error) {
        badnews(error)
    })

}

function opentkt_save() {
    var domain_case = document.getElementById("domain_case2").value,
        tick_no = Number(document.getElementById("currentticket_" + domain_case).innerHTML) + 1;
    document.getElementById("stats_oc").innerHTML = Number(document.getElementById("stats_oc").innerHTML) + 1,
        document.getElementById("stats_tc").innerHTML = Number(document.getElementById("stats_tc").innerHTML) + 1,
        document.getElementById("currentticket_" + domain_case).innerHTML = tick_no, document.getElementById("ticket_edt_id").innerHTML = tick_no;
    var user = firebase.auth().currentUser,
        domain_case = document.getElementById("domain_case2").value,
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
        '<p>You are receiving this mail as you have have been assigned for this ticket.&nbsp;</p>' +
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
    }).then(function (doc) {
        var data = processrow(false, [doc.id, tick_no, domain_case, opticket_location, opticket_issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', opstatus, user.uid, opassignee_1, opassignee_2, opassignee_3, opassignee_4, opticket_date, 'DUM', 'DUM', tick_no, opticket_date, user.uid, "---"], counter++);
        var table = $('#edit_tic_table_' + domain_case).DataTable(

        );
        table.row.add(data).draw();
        goodnews("The ticket was added successfully!");
    }).catch(function (error) {
        badnews(error), console.log(error);
    });
}

function generateReport() {

    $('#reportModal').modal('toggle');
    var sel1 = document.getElementById("sel1").value,
        dataSet = [],
        values = $("#pre-selected-options").val(),
        con_values = [];
    document.getElementById("lb_report").innerHTML = "0", values.forEach(function (entry) {
        con_values = con_values + '  <span>' + tabletolable(entry, false) + ' : <span  id="report_label_' + entry + '">0</span></span> ,';
    });
    var dtrange = document.getElementById("dtrange").value;

    document.getElementById("it-range").innerHTML = con_values;
    [s_date_ticks, e_date_ticks] = dtrange.split(" - "),
        s_date_ticks = new Date(s_date_ticks), e_date_ticks = new Date(e_date_ticks);
    db.collection("domains").doc(sel1).collection("tickets").orderBy("created_on", "asc").startAt(s_date_ticks).endAt(e_date_ticks).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            values.includes(doc.data().status) && (dataSet.push([doc.id, doc.data().id, sel1, doc.data().location, doc.data().issue, "DUM", "DUM", "DUM", "DUM", "DUM", "DUM", doc.data().status, doc.data().created_by, doc.data().assigned_to_1, doc.data().assigned_to_2, doc.data().assigned_to_3, doc.data().assigned_to_4, doc.data().created_on, "DUM", "DUM", doc.data().id, doc.data().hist_created_on || doc.data().created_on, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---"]),
                increment_tag("lb_report"), increment_tag("report_label_" + doc.data().status));
        }), loadtable2("#example", dataSet, !0, sel1);
        var el = document.getElementById("div1");
        el.classList.remove("hidden");
    }).catch(function (error) {
        console.log(error), badnews(error);
    }), document.getElementById("gn-site").innerHTML = sel1;
    document.getElementById("Report_tile").innerHTML = " <span class='blink_text'>&#8226;</span> Report : " + sel1;

    document.getElementById("dt-range").innerHTML = dtrange;
    show_report();
}

function undo_close_case(com_id, dom_id, counter, owner, tick_id, location, issue) {
    save_history(com_id, dom_id, counter, "Recovered", "Recovered", true, owner, tick_id, location, issue);
}

function close_case(com_id, dom_id, counter, owner, tick_id, location, issue) {


    Swal.fire({
        title: 'Are you satisfied?',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Close Case',
        showLoaderOnConfirm: true,
        preConfirm: (message) => {
            return close_only_case(com_id, dom_id, counter, "Closed", message, false, owner, tick_id, location, issue)
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

        /*   if (result.value) {
              Swal.fire({
                  title: `${result.value.message}'s avatar`,
                  imageUrl: result.value.avatar_url
              })
          } */
    })

}

function sendmail(to, cc, subject, text_html) {
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

function clickthis(myCheck) {
    document.getElementById('isngiht').style.display = 'none';
    document.getElementById('tabler').style.display = 'block';
    document.getElementById(myCheck).click();
}

function open_home_tickets() {

    document.getElementById('isngiht').style.display = 'block';
    document.getElementById('tabler').style.display = 'none';
    /* 
        toggle_display(document.getElementById('isngiht'));
        toggle_display(document.getElementById('tabler')); */
}

/* function toggle_display(x){

      if (x.style.display === 'none') {
        x.style.display = 'block';
      } else {
        x.style.display = 'none';
      }
   
} */
function add_ticket_menu() {
    var ul = document.getElementById('more_menu_0');
    var li =
        '        <a href="javascript:void(0)" onclick=\'open_home_tickets()\'  >' +
        '            <div class="pull-left"><i class="fas fa-home mr-20"></i><span' +
        '                    class="right-nav-text">Home</span>' +
        '            </div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';
    ul.innerHTML = li;
    var ul = document.getElementById('more_menu_1');
    var li =
        '        <a href="javascript:void(0)" onclick=\'clickthis("home_tab_8")\'  >' +
        '            <div class="pull-left"><i class="fas fa-ticket-alt mr-20"></i><span' +
        '                    class="right-nav-text">To-Do List</span>' +
        '            </div>' +
        '            <div class="pull-right"><span class="label label-primary" id="lb_todo">0</span></div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';
    ul.innerHTML = li;

    var ul = document.getElementById('more_menu_2');
    var li =
        '        <a href="javascript:void(0)" onclick=\'clickthis("home_tab_9")\'  >' +
        '            <div class="pull-left"><i class="fas fa-ticket-alt mr-20"></i><span' +
        '                    class="right-nav-text">Highlights</span>' +
        '            </div>' +
        '            <div class="pull-right"><span class="label label-primary" id="lb_atten">0</span></div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';
    ul.innerHTML = li;
}

function show_report() {
    var ul = document.getElementById('more_menu_3');
    var li =
        '        <a href="javascript:void(0)" onclick=\'clickthis("profile_tab_7")\'  >' +
        '            <div class="pull-left"><i class="fas fa-ticket-alt mr-20"></i><span' +
        '                    class="right-nav-text">Report</span>&nbsp;&nbsp;<span class="label label-danger blink_text">New!</span>' +
        '            </div>' +
        '            <div class="pull-right"><span class="label label-primary" id="lb_report">0</span></div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';
    ul.innerHTML = li;
}

function add_iot_menu() {
    console.log("Ewq");
    var ul = document.getElementById('more_menu_0');
    var li =
        '        <a href="javascript:open_home_page()">' +
        '            <div class="pull-left"><i class="fas fa-home mr-20"></i><span' +
        '                    class="right-nav-text">Home</span>' +
        '            </div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';


    ul.innerHTML = li;
    var ul = document.getElementById('more_menu_1');

    var li = '        <a href="javascript:open_devices()">' +
        '            <div class="pull-left"><i class="fas fa-project-diagram mr-20"></i><span' +
        '                    class="right-nav-text">Things</span>' +
        '            </div>' +
        '            <div class="pull-right"><span class="label label-primary" id="total_dvs">0</span></div>' +
        '            <div class="clearfix"></div>' +
        '        </a>';
    ul.innerHTML = li;
}
var series_check = [];
var sorted_data;

function find_max(data) {

    var found_list = [];
    var domain_length = domain_list.length;

    for (var x = 0; x < 4; x++) {
        var value = 0;
        var item = '';

        for (var i = 0; i < domain_length; i++) {

            if (!found_list.includes(domain_list[i])) {
                if (data[domain_list[i]] > value) {
                    value = data[domain_list[i]];
                    item = domain_list[i];
                }
                if (i == domain_length - 1 && item != '') {
                    found_list.push(item);
                    add_to_site(item, value);

                }
            }


        }
    }
}


var co = 0;

function add_to_site(x, y) {

    switch (co) {
        case 0:
            document.getElementById("site_1").innerText = x;
            document.getElementById("c_site_1").innerText = y + 1;

            co++;
            break;
        case 1:
            document.getElementById("site_2").innerText = x;
            document.getElementById("c_site_2").innerText = y + 1;
            co++;
            break;
        case 2:
            document.getElementById("site_3").innerText = x;
            document.getElementById("c_site_3").innerText = y + 1;
            co++;
            break;
        case 3:
            document.getElementById("site_4").innerText = x;
            document.getElementById("c_site_4").innerText = y + 1;
            co = 0;
            break;

        default:
            co = 0;
        // code block
    }
}

function generate_ticket_data() {
    document.getElementById("title_bar").innerText = "Tickets Addressed";
    document.getElementById("multi_grah_title").innerText = "Tickets Timeline";
    document.getElementById("by_sta_title").innerText = "Tickets Summary";


    var pec = Math.round((status_addressed / status_c['Total']) * 100);

    document.getElementById("addressed_percentage").innerText = pec;
    document.getElementById("addressed_percentage_bar").innerHTML = '	<div class="progress-bar progress-bar-primary  wow animated progress-animated" role="progressbar" aria-valuenow="' + pec + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + pec + '%;"></div>';
    document.getElementById("addressed_perc").innerText = status_addressed;
    document.getElementById("Work_on_Progress").innerText = status_c['Total'] - status_addressed;


    find_max(status_c_date);
    document.getElementById("weekly_tickets").innerText = weekly_tickets;
    document.getElementById("monthly_tickets").innerText = monthly_tickets;
    var domain_length = domain_list.length;
    // 
    for (var e = 0; e < domain_length; e++) {
        var selected_domain = domain_list[e];
        var data = [];
        var data_lenth = data_setta.length;
        for (var i = 0; i < data_lenth; i++) {
            if (data_setta[i][2] == selected_domain) {
                data.push(data_setta[i]);

            }
            if (i == data_lenth - 1) {
                var temp = {
                    name: selected_domain,
                    data: data,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return 10;
                        return (Math.sqrt(data[6]) * 2);
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                console.log(param);
                                return 'ds'
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(251, 118, 123)'
                        }, {
                            offset: 1,
                            color: 'rgb(204, 46, 72)'
                        }])
                    }
                };
                series_check.push(temp);
            }
        }

        if (e == domain_length - 1) {
            run_echarts_tickets();
        }
    }
}
var tree_data = [];
function generate_jobsheet_data() {
    document.getElementById("title_bar").innerText = "Not-Chargeable Jobsheets"
    document.getElementById("multi_grah_title").innerText = "Jobsheets Timeline";
    document.getElementById("by_sta_title").innerText = "Jobsheets Summary";
    var pec = Math.round((status_addressed / m_status_c['Total']) * 100);
    document.getElementById("addressed_percentage").innerText = pec;
    document.getElementById("addressed_percentage_bar").innerHTML = '	<div class="progress-bar progress-bar-primary  wow animated progress-animated" role="progressbar" aria-valuenow="' + pec + '" aria-valuemin="0" aria-valuemax="100" style="width: ' + pec + '%;"></div>';
    document.getElementById("addressed_perc").innerText = status_addressed;
    document.getElementById("Work_on_Progress").innerText = m_status_c['Total'] - status_addressed;


    find_max(status_c_date);
    document.getElementById("weekly_tickets").innerText = weekly_tickets;
    document.getElementById("monthly_tickets").innerText = monthly_tickets;
    var domain_length = domain_list.length;



    for (var e = 0; e < domain_length; e++) {
        var total = 0;
        var selected_domain = domain_list[e];
        var data = [];
        var data_lenth = data_setta.length;
        var dat = [];
        for (var i = 0; i < data_lenth; i++) {
            if (data_setta[i][2] == selected_domain) {

                data.push(data_setta[i]);
                total = total + data_setta[i][4];

                dat.push({
                    name: data_setta[i][9],
                    hours: data_setta[i][3],
                    value: data_setta[i][4],
                });

            }


            if (i == data_lenth - 1) {
                var temp = {
                    name: selected_domain,
                    data: data,
                    type: 'scatter',
                    symbolSize: function (data) {
                        return 10;
                        return (Math.sqrt(data[6]) * 2);
                    },
                    emphasis: {
                        focus: 'series',
                        label: {
                            show: true,
                            formatter: function (param) {
                                console.log(param);
                                return 'ds'
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(251, 118, 123)'
                        }, {
                            offset: 1,
                            color: 'rgb(204, 46, 72)'
                        }])
                    }
                };
                series_check.push(temp);
            }
        }
        tree_data.push({
            name: selected_domain,            // Second tree
            value: total,
            children: dat
        });



        if (e == domain_length - 1) {
            run_echarts_jobsheets();
        }
    }
 
}
var bole = true;

function run_fullscreen(x) {

    if (bole) {

        document.getElementById(x).style.height = "700px";
        bole = false;
    } else {
        document.getElementById(x).style.height = "313px";
        bole = true;
    }
}

function run_echarts_tickets() {

    var echartsConfig = function () {

        var main_piechart = {
            /*          title: {
                          text: 'Scatter Plot' ,
                          left: '5%',
                          top: '3%'
                      }, */
            /*                  legend: {
                                 right: '10%',
                                 top: '3%',
                                 data: domain_list
                             }, */
            grid: {
                left: '20%',
                top: '5%'
            },
            tooltip: {
                backgroundColor: ['rgba(1,1,1,0.7)'],
                formatter: function (obj) {
                    var value = obj.value;
                    var vari = '';
                    if (value[8] != '---') {
                        vari = tabletoimage(value[7], 20) + " - " + value[8].wrap(55, 10, true) + '</span><br>';
                    }
                    console.log(value);
                    return '<div style="solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 2px;margin-bottom: 2px">' +
                        value[2] + ' | ' + value[4] + '<br>' + value[5] + " - " + value[3].wrap(75, 10, true) + '<br>' + vari + value[0];
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: function (obj) {

                        return status_codes_reversed(obj);
                    }
                },
                scale: true
            },
            series: series_check
        };
        var tickets_timeline = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                backgroundColor: 'rgba(33,33,33,1)',
                borderRadius: 0,
                padding: 10,
                textStyle: {
                    color: '#fff',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: 12
                }
            },
            legend: {
                show: false
            },
            toolbox: {
                show: false,
            },
            calculable: true,
            itemStyle: {
                normal: {
                    shadowBlur: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            series: [{
                name: 'Status',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                roseType: 'radius',
                color: ['#119dd2', '#d36ee8', '#667add', '#fd7397', '#4aa23c'],
                label: {
                    normal: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: 12
                    }
                },
                data: [
                    { value: status_c['Not Started'], name: 'Not Started' },
                    { value: status_c['On Progress'], name: 'On Progress' },
                    { value: status_c['Urgent Action'], name: 'Urgent Action' },
                    /*        { value: status_c['Skipped'], name: 'Skipped' }, */
                    //   { value: status_c['Follow Up'], name: 'Follow Up' },
                    { value: status_c['Solved'], name: 'Solved' },

                ].sort(function (a, b) { return a.value - b.value; }),
            },],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 1000;
            }
        };
        generate_echart('e_chart_1', main_piechart);
        generate_echart('e_chart_3', tickets_timeline);
        document.getElementById('item_1').innerHTML = "Not Started";
        document.getElementById('not_sta_sta').innerHTML = status_c['Not Started'];
        document.getElementById('item_2').innerHTML = "Solved";
        document.getElementById('solved_sta').innerHTML = status_c['Solved'];
        document.getElementById('item_3').innerHTML = "Follow Up";
        document.getElementById('follow_up_sta').innerHTML = status_c['Follow Up'];
        document.getElementById('item_1_sub').innerHTML = "Not Updated, Since ticket was opened.";
        document.getElementById('item_2_sub').innerHTML = "Yet to be closed.";
        document.getElementById('item_3_sub').innerHTML = "Waiting action from client.";
    }
    var echartResize;
    $(window).on("resize", function () {
        clearTimeout(echartResize);
        echartResize = setTimeout(echartsConfig, 200);
    }).resize();
}

function run_echarts_jobsheets() {

    var main_radar = [];
 
    for (var w = 0; w < user_list.length; w++) {
        var selected_user = user_list[w];
        if(selected_user!=""){
            var stect_data = [];
            stect_data[0] =0;
            stect_data[1] =0;
            stect_data[2] =0;
            stect_data[3] =0;
            stect_data[4] =0;
            stect_data[5] =0;
    
            var counter_1=0;     
                var data_lenth = data_setta.length;        
                for (var e = 0; e < data_lenth; e++) {
                    var selected_status = jobstatus_codes(data_setta[e][6]);
                    counter_1++;
               if (data_setta[e][8] == selected_user) {   
                            stect_data[[selected_status]] = stect_data[[selected_status]] + data_setta[e][4];
                                        }
    
                if(counter_1==data_setta.length){        
                    main_radar.push({
                        value: stect_data,
                        name: tabletoname(selected_user)
                    }); 
                 
                }
                }
        }
      
    }
    //    color: ['#fd7397','#d36ee8', '#119dd2', '#667add'],
    var data_chart_user = [];
    for (var e = 0; e < user_list.length; e++) {
        var selected_user = user_list[e];
        if (selected_user != "") {
            data_chart_user.push({
                name: tabletoname(selected_user),
                value: user_c_date[selected_user]
            });
        }


    }
    var for_bar = [];

    var selected_date;


    for (var l = 0; l < c_date_list.length; l++) {
        selected_date = c_date_list[l];

        if (c_date[selected_date] > 24) {
            for_bar.push({
                value: c_date[selected_date],
                itemStyle: {
                    color: '#d36ee8'
                }
            });

        } else {
            for_bar.push({
                value: c_date[selected_date],
                itemStyle: {
                    color: '#fd7397'
                }
            });
        }


    }
    var foo_bar2 = [];
    var selected_user;
    var user_list_name = [];
    for (var p = 0; p < user_list.length; p++) {
        var date_data = [];

        selected_user = user_list[p];
        if (selected_user != "") {


            var selected_user_name = tabletoname(selected_user);
            user_list_name.push(selected_user_name);

            for (var l = 0; l < c_date_list.length; l++) {
                selected_date = c_date_list[l];
                var date_val = 0
                for (var b = 0; b < data_setta.length; b++) {

                    if (data_setta[b][0] == selected_date && data_setta[b][8] == selected_user) {
                        date_val = date_val + data_setta[b][4];
                    }

                    if (data_setta[b][0] == selected_date && data_setta[b][10] == selected_user_name) {
                        date_val = date_val + data_setta[b][4];
                    }
                }
                date_data.push(date_val);
            }

            foo_bar2.push(
                {
                    name: selected_user_name,
                    type: 'bar',
                    stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: date_data
                },
            )

        }
    }




    var echartsConfig = function () {
        document.getElementById('item_1').innerHTML = "Chargeable";
        document.getElementById('not_sta_sta').innerHTML = m_status_c['Chargeable'];
        document.getElementById('item_2').innerHTML = "Warranty";
        document.getElementById('solved_sta').innerHTML = m_status_c['Warranty'];
        document.getElementById('item_3').innerHTML = "Maintenance";
        document.getElementById('follow_up_sta').innerHTML = m_status_c['Maintenance'];
        document.getElementById('item_1_sub').innerHTML = "Not Updated, Since ticket was opened.";
        document.getElementById('item_2_sub').innerHTML = "Yet to be closed.";
        document.getElementById('item_3_sub').innerHTML = "Waiting action from client.";

        var main_piechart = {

            grid: {
                left: '20%',
                top: '5%'
            },
            tooltip: {
                backgroundColor: ['rgba(1,1,1,0.7)'],
                formatter: function (obj) {
                    var value = obj.value;
                    var vari = '';
                    if (value[7] != '---') {
                        vari = tabletoimage(value[8], 20) + " - " + value[7].wrap(55, 10, true) + '</span><br>';
                    }
                    //     data_setta.push([phrase, jobstatus_codes(status), domain,status, hours, Difference_In_Days, chargable, message,user_id,ticket_id]);
                    return '<div style="solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 2px;margin-bottom: 2px">' +
                        value[2] + ' | ' + value[3] + '<br>' + 'Jobsheet No : ' + value[9] + '<br>' + vari + value[0] + ' | ' + value[4] + ' Hours';
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    formatter: function (obj) {

                        return jobstatus_codes_reversed(obj);
                    }
                },
                scale: true
            },
            series: series_check
        };
        var jobsheet_timeline = {

            legend: {
                show: false
            },
            toolbox: {
                show: false,
            },
            calculable: true,
            itemStyle: {
                normal: {
                    shadowBlur: 5,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            series: [{
                name: 'Status',
                type: 'pie',
                radius: '60%',
                center: ['50%', '50%'],
                roseType: 'radius',
                color: ['#119dd2', '#d36ee8', '#667add', '#fd7397', '#4aa23c'],
                label: {
                    normal: {
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: 12
                    }
                },


                data: [
                    /*    { value: m_status_c['Not Chargeable'], name: 'Not Chargeable' }, */
                    { value: m_status_c['Warranty'], name: 'Warranty' },
                    { value: m_status_c['Chargeable'], name: 'Chargeable' },
                    { value: m_status_c['Maintenance'], name: 'Maintenance' },
                    { value: status_c['Other'], name: 'Other' },
                    //   { value: status_c['Follow Up'], name: 'Follow Up' },


                ].sort(function (a, b) { return a.value - b.value; }),
            },],
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 1000;
            }
        };

        var risks_options = {
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }
             

                    if (treePath[4] != '---') {
                        var vari = tabletoimage(value[4], 20) + " - " + treePath[2] + '</span><br>';
                    }

                    /*                 dat.push({
                                        name:  data_setta[i][9], 
                                        hours:  data_setta[i][3],     // First leaf of first tree
                                        value: data_setta[i][4],
                                        date: data_setta[i][0],
                                        user: data_setta[i][8],
                                        message:data_setta[i][7],
                                        status:data_setta[i][2],    
                                    });
                                     */

                    //     data_setta.push([phrase, jobstatus_codes(status), domain,status, hours, Difference_In_Days, chargable, message,user_id,ticket_id]);

                    return [
                        '<div class="tooltip-title">' + treePath[0] + '<br>Ticket No: ' + treePath[1] + '<br> Hours : ' + value + ' Hours</div>',
                        ,
                    ].join('');
                }
            },
            series: [{
                type: 'treemap',
                data: tree_data
            }]
        };
        console.log(user_list_name);
        console.log(user_list);
        var budget_options = {

        
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: user_list_name
            },
            radar: {
                // shape: 'circle',
                indicator: [
               
                    { name: jobstatus_codes_reversed(1), max: m_status_c[jobstatus_codes_reversed(1)]+2 },
                    { name: jobstatus_codes_reversed(2), max: m_status_c[jobstatus_codes_reversed(2)]+2 },
                    { name: jobstatus_codes_reversed(3), max: m_status_c[jobstatus_codes_reversed(3)]+2 },
                    { name: jobstatus_codes_reversed(4), max: m_status_c[jobstatus_codes_reversed(4)]+2 },
                    { name: jobstatus_codes_reversed(5), max: m_status_c[jobstatus_codes_reversed(5)]+2 }
                ]
            },
            series: [{
                name: 'Work',
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },

                areaStyle: {},
                data: main_radar
            }]

        };
        var pending_items = {
            color: ['#d36ee8', '#119dd2', '#667add'],
            series: [
                {
                    name: '漏斗图',
                    type: 'funnel',
                    x: '0%',
                    y: 20,
                    //x2: 80,
                    y2: 60,
                    width: '100%',
                    height: '80%',
                    // height: {totalHeight} - y - y2,
                    min: 0,
                    max: 100,
                    minSize: '0%',
                    maxSize: '100%',
                    sort: 'ascending', // 'ascending', 'descending'
                    gap: 0,

                    data: [
                        { value: 100, },
                        { value: 80, },
                        { value: 100, },

                    ].sort(function (a, b) { return a.value - b.value }),
                    roseType: true,
                    label: {
                        normal: {
                            formatter: function (params) {
                                return params.name + ' ' + params.value + '%';
                            },
                            position: 'center',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: 12
                        }
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 0,
                            shadowBlur: 5,
                            shadowOffsetX: 0,
                            shadowOffsetY: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }

                }

            ]
        };

        var pie_chart_second = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color: ['#fd7397', '#d36ee8', '#119dd2', '#667add'],
            series: [
                {
                    name: 'Hours',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '50%'],
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} {a}  ({d}%)",
                        backgroundColor: 'rgba(33,33,33,1)',
                        borderRadius: 0,
                        padding: 10,
                    },

                    data: data_chart_user,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        var fdsoption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // Use axis to trigger tooltip
                    type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                data: user_list_name
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: c_date_list

            },
            yAxis: {
                type: 'value'
            },
            series: foo_bar2
        };
        generate_echart('e_chart_1', main_piechart)
        generate_echart('e_chart_3', jobsheet_timeline);
        generate_echart('e_chart_44', risks_options);
        generate_echart('e_chart_333', fdsoption);
        generate_echart('e_chart_22', pie_chart_second);
        generate_echart('e_chart_11', budget_options);
    }
    var echartResize;
    $(window).on("resize", function () {
        clearTimeout(echartResize);
        echartResize = setTimeout(echartsConfig, 200);
    }).resize();
}

function generate_echart(id, option) {
    var eChart = echarts.init(document.getElementById(id));
    eChart.setOption(option);
    eChart.resize();
}

