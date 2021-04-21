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



function loadtable3(id, dataset, reportflag, domain_id) {
  
    for (i = 0; i < dataset.length; i++) {
        processrow2(reportflag, dataset[i], i);
    }
    dotable2(id, dataset, !1, reportflag, domain_id);


}

/* function reload_table(dom_id) {
    
    load_info(dom_id);
    setTimeout(
        function () {
            var table = $('#edit_datable_' + dom_id).DataTable();
            //       console.log(table.rows().data());
            table.columns.adjust().draw();
        }, 175);
}

function load_info(dom_id) {
    document.getElementById("last_Ticket_id").style.visibility = "visible";
    document.getElementById("domain_case2").value = dom_id;
    changeform_ticket();
    document.getElementById("main_title_help").innerHTML = '<i class="' + document.getElementById("icon_" + dom_id).innerHTML + '  mr-10 " ></i>' + document.getElementById("title_" + dom_id).innerHTML + " - " + document.getElementById("description_" + dom_id).innerHTML;
    document.getElementById("current_user_list").innerHTML = document.getElementById("currentusers_" + dom_id).innerHTML;
    document.getElementById("ticket_currnet").innerHTML = document.getElementById("currentticket_" + dom_id).innerHTML;
}
 */


function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

function wordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
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

function processrow2(reportflag, row, i) //



{

    /*    row = strip(row);
       var date2 = new Date(),
           user = firebase.auth().currentUser;
       var buttons = '';
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

       var created_on_date = datetimeshortformat(row[17]),
           date1 = new Date(created_on_date),
           Difference_In_Time = date2.getTime() - date1.getTime(),
           Difference_In_Days = Math.round(Difference_In_Time / 864e5);
   
       if (Difference_In_Days > 7 && '<span class="label label-danger">Not Started</span>' == row[7]) {
           row[6] = '<span class="inline-block txt-danger soft_zoom weight-500">'
               + Difference_In_Days + ' Days&nbsp;&nbsp;<i class="fas fa-exclamation"></i></span>';
           document.getElementById(row[2] + "_label2").className = "label label-info";
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
   
   
       } */
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
    fetch_tickets2(total_op, 'E');
}


function dotable2(id, dataset, domain_flag, report_flag, domain_id) {

    var table_id = 'div_jobs_table_' +id;
    var other_table =  'div_tic_table_' +id;

    document.getElementById(table_id).style.display = "block";
    document.getElementById(other_table).style.display = "none";
    document.getElementById('home_tab_8').style.display = "none";
    document.getElementById('home_tab_9').style.display = "none";
    document.getElementById('home_tab_7').click(); 
    document.getElementById('setting_panel_btn').style.visibility= "hidden";
    document.getElementById(id + '_label2').innerText = dataset.length;
    document.getElementById(id + "_label2").className = "label label-primary";
    document.getElementById('currentticket_' + id).innerText =  dataset.length;
    document.getElementById('txt_last').innerText =  'Last Job No';
    

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
    var table = $('#edit_jobs_table_' +id).DataTable({
        order: [
            [8, "desc"]
        ],
        dom: 'frtipB ',
        bInfo: !1,
        pageLength: 10,
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
                    var ds = '<div class="sl-item"><a href="javascript:void(0)"><div class="sl-avatar"><img src="' + full[4] + '+ class="img-circle bounce sender-img" alt="user" height="25" width="25" title=' + full[3] + '>  </div><div class="sl-content"><span class="head-notifications">' + full[2] + '</span><div class="clearfix"></div><span class="inline-block font-11  pull-right notifications-time"></span></div></a></div>';


                    return ds;
                },
            }, {
                targets: 3,

                visible: !1
            }, {
                targets: 4,

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






function fetch_tickets2(t, alpha) {
    console.log("why");
    var open_flag = true;

    loaded = false;
    loader();
    dataSet2 = [];
    dataSet3 = [];
    dataset = [];

    var user = firebase.auth().currentUser;
    var total_cases_tick = 0;
    var total_open_cases = 0;
    document.getElementById('stats_oc').innerText = 0;
    document.getElementById('stats_cc').innerText = 0;
    document.getElementById('stats_aq').innerText = 0;
    document.getElementById('stats_tc').innerText = 0;
   // document.getElementById('total_oc_jobsheets').innerText = 0;
    document.getElementById('lb_todo').innerText = 0;
    document.getElementById('lb_atten').innerText = 0;
    document.getElementById('lb_allsit').innerText = 0;
    //  document.getElementById('currentusers_' + t.name).innerHTML = "";
    var counter_t = 1;
    var total_size = t.length;
    t.forEach(function (t) {
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
            //getsiteicon
            document.getElementById('title_' + t.name).innerHTML = t.name;
            document.getElementById('icon_' + t.name).innerHTML = getsiteicon(t.type);
          
            if (rest.length != 0) {
                rest.forEach(function (entry) {

                    try {
                      console.log(entry);
                        let obj = user_profiles.find(o => o.id === entry);
                        console.log(obj);
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
            /* 
                        db.collection("domains").doc(t.id).collection("job_sheets").orderBy("id", "desc").limit(1).get().then(function (querySnapshot)
                        {
            
                            querySnapshot.forEach(function (doc)
                            { */

           
            db.collection("domains").doc(t.id).collection("job_sheets").get().then(function (querySnapshot) {


                querySnapshot.forEach(function (doc) {
                 
                    // console.log(doc.data());
                    if(doc.data().status=='Closed' || doc.data().status=='Solved'){
                        total_open_cases++;
                    }
                    dataSet.push([doc.data().job_num, doc.data().ticket_id, doc.data().message, doc.data().name, doc.data().photoURL, doc.data().status, doc.data().start_time, doc.data().end_time, doc.data().ticket_doc_id, doc.data().timestamp, doc.data().chargable]);


                    /*                            dataSet.push([doc.id, doc.data().id, t.id, doc.data().location, doc.data().issue, 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', 'DUM', doc.data().status, doc.data().created_by, doc.data().assigned_to_1, doc.data().assigned_to_2, doc.data().assigned_to_3, doc.data().assigned_to_4, doc.data().created_on, 'DUM', 'DUM', doc.data().id, doc.data().hist_created_on || doc.data().created_on, doc.data().hist_created_by || doc.data().created_by, doc.data().hist_message || "---"]);
                    */
                });
                total_cases_tick = total_cases_tick + querySnapshot.size;
   
                loadtable3(t.id, dataSet, false, t.id);
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

            /*        });
               }).catch(function (error)
               {
                   console.log(error);
                   badnews(error)
               }) */
            if (open_flag) {
                load_info(t.name);
                open_flag = false;
            }

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
            let obj = user_profiles.find(o => o.id === id);

            var image = '<img src=' + nio.photoUrl + ' class="img-circle bounce sender-img"  alt="user" height="' + size + '" width="' + size + '" title="' + obj.name + '">' + "&nbsp;&nbsp;";
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
            image = " • " + nio.name;

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
