$("#formintevl").ionRangeSlider({
    type: "single", min: 0, max: 120, step: 10, grid: !0, from: 0, onChange: function (data) { loaddatapred(data.from, document.getElementById("mmlog").value) },
}); $("#mmlog").ionRangeSlider({
    min: 0, max: 20000, type: 'single', step: 1, grid: !0, from: 0, onChange: function (data) { loaddatapred(data.from, document.getElementById("formintevl").value) },
});


function get_device(id)
{
    document.getElementById("idtest").value = id;
    db.collection("devices").doc(id).get().then(doc =>
    {
        name = doc.data().name;
        description = doc.data().description;
        type = doc.data().type;
        delete_flag = doc.data().delete_flag;
        domain = doc.data().domain;
        format = doc.data().format; publickey =
            doc.data().publickey; owner = doc.data().owner;
        db.collection("devices").doc(id).collection('datasets').doc('config').get().then(function (doc)
        {
            config_update((doc.data().log_interval) / 60, doc.data().log_minimum_points, doc.data().log_update, doc.data().alarm_update, doc.data().log_size, name, description, type, domain, id, format, publickey, owner)
        })
            .then(function ()
            {
                $("#device_settings_modal").modal();
            }).catch(function (error)

            { badnews(error); })
    }).catch(function (error)
    { badnews(error); })
}


////////////////////////////////  START OF DEVICE SETTINGS AND CONNNECTIVITY FORM////////////////////////////////
function config_update(formintevl, mmlog, log_update, alarm_update, log_size, name, description, type, domain, device_id, format, publickey, owner)
{
    var formintevl_instance = $("#formintevl").data("ionRangeSlider");
    var mmlog_instance = $("#mmlog").data("ionRangeSlider");
    document.getElementById('formdName').value = name;
    document.getElementById('formdescription').value = description;
    document.getElementById('formdvtype').value = type;
    document.getElementById('changeDomain3').value = domain;
    document.getElementById('formdvid').value = device_id;
    document.getElementById('formdvformat').value = format;
    document.getElementById('Pkey2').value = publickey;
    document.getElementById('formdvOwner').value = owner;
    document.getElementById('domainid3').value = domain;
    loaddatapred(formintevl, mmlog);
    document.getElementById('formintevl').value = formintevl;
    document.getElementById('mmlog').value = mmlog;

    formintevl_instance.update({
        from: formintevl,
    });

    mmlog_instance.update({
        from: mmlog,
    });
    if (alarm_update) {
        if (!document.getElementById("alarm_options").checked) {
            document.getElementById("alarm_options").click();
        }
    }
    if (log_update) {
        if (!document.getElementById("log_options").checked) {
            document.getElementById("log_options").click();
        }
        document.getElementById("note3").style.display = "block";
        document.getElementById("note2").style.display = "block";
        document.getElementById("note1").style.display = "block";
    } else {
        document.getElementById("note1").style.display = "none";
        document.getElementById("note2").style.display = "none";
        document.getElementById("note3").style.display = "none";
    }
    document.getElementById('formintevl').value = formintevl;


}

function loaddatapred(a, b)
{
    var time_period = a * b; var momentOfTime = new Date(); var offset = momentOfTime.getTimezoneOffset()
    var milisec_diff = time_period * 60 * 1000 + (offset * 60 * 1000); var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24)); var date_diff = new Date(milisec_diff); if (days == -1) days = 0; document.getElementById("tttt1").innerText = days + " Days " + date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes ";
}
function updatedeviceinfo()
{
    var k = document.getElementById("log_options").checked;
    var h = document.getElementById("alarm_options").checked;
    var device_id = document.getElementById("idtest").value; db.collection("devices").doc(device_id).get().then(function (doc)
    {
        if (document.getElementById("formdvtype").value != doc.data().type || document.getElementById("changeDomain3").value != doc.data().domain) { resetdevice() } else {
            var e = document.getElementById("formdName").value, t = document.getElementById("formdescription").value, n = document.getElementById("formintevl").value, i = document.getElementById("mmlog").value;
            db.collection("devices").doc(device_id).update({ name: e, description: t })
                .then(function ()
                {
                    db.collection("devices").doc(device_id).collection('datasets').doc('config').update({ log_interval: (n * 60), log_minimum_points: i, log_update: k, alarm_update: h, blocked: false }).then(function ()
                    {
                        goodnews('Changes were made successfully!');
                        // 
                    })
                }).catch(function (e)
                {
                    badnews(e);


                })
        }
    })
}
function readraw()
{
    $('#device_settings_modal').on('hidden.bs.modal', function ()
    {
        console.log("sapbao");
        unsubscribe2();
    });
    var device_id = document.getElementById("idtest").value; console.log(device_id); var counter = 0;
    db.collection("devices").doc(device_id).update({ raw_update: !0 }).then(function ()
    { }).then(function ()
    {

        const rawdatapath = db.collection("devices").doc(device_id).collection("datasets").doc("raw")
        rawdatapath.get().then((docSnapshot) =>
        {
            if (docSnapshot.exists) {
                document.getElementById("rawdata_status").innerHTML = "<i class='fas fa-sync fa-spin'></i>" + "&nbsp;&nbsp;&nbsp Looking for new messages...";

                unsubscribe2 = rawdatapath.onSnapshot(function (doc)
                {
                    counter = counter + 1; var string2 = JSON.stringify(doc.data().message).replace(/(,|{|})/gm, "\n");
                    if (counter == 2) {
                        document.getElementById("rawdata_status").innerHTML = "<i class='far fa-check-circle'></i>" + "&nbsp;&nbsp;&nbsp New Message Received."; document.getElementById('received_packet').innerHTML = "{" + string2 + "}";
                        var last_updated2 = datetimeformat(doc.data().timestamp);
                        document.getElementById('received_packet_ts').innerHTML = "Received at " + last_updated2; unsubscribe2();
                    }
                })
            } else { document.getElementById("rawdata_status").innerHTML = "<i class='fas fa-sync fa-spin'></i>" + "&nbsp;&nbsp;&nbsp Looking for new messages for the first time..." }
        })
    }).catch(function (error)
    { document.getElementById("rawdata_status").innerHTML = "<i class='fas fa-exclamation-circle'></i>" + "&nbsp;&nbsp;&nbsp " + error })
}
////////////////////////////////  END OF DEVICE SETTINGS AND CONNNECTIVITY FORM////////////////////////////////
////////////////////////////////  START  OF TREND SETTINGS FORM////////////////////////////////
function trendreset()
{


    var device_id = document.getElementById("idtest").value; db.collection("devices").doc(device_id).collection("logs").get().then(snapshot => { snapshot.forEach(doc => { db.collection("devices").doc(device_id).collection("logs").doc(doc.id).delete() }) }).then(function ()
    {
        $(document).ready(function ()
        { "use strict"; swal("All records have been deleted.", { icon: "success", }) }); db.collection("devices").doc(device_id).collection('datasets').doc('config').set({ "log_size": 0 }, { merge: !0 })
    }).catch(function (error)
    { badnews(error); })



}
////////////////////////////////  END  OF TREND SETTINGS FORM////////////////////////////////
////////////////////////////////  START  OF ALARM SETTINGS FORM////////////////////////////////
function rangetdreset()
{
    device_id = document.getElementById("idtest").value; db.collection("devices").doc(device_id).collection('alarms').get().then(function (querySnapshot)
    {
        querySnapshot.forEach(function (doc)
        { db.collection("devices").doc(device_id).collection('alarms').doc(doc.id).delete() })
    }).then(function ()
    {
        db.collection("devices").doc(device_id).collection("datasets").doc("live").get().then(function (doc)
        { livedata = doc.data(); var i; if (name != "timestamp") { Object.keys(livedata).forEach((name) => { for (i = 0; i < 10; i++) { var today = new Date(); db.collection("devices").doc(device_id).collection('alarms').doc().set({ timestamp: today, parameter: name }) } }) } }).then(function ()
        {

            goodnews("Alarm History was successfully reset.");
        }).catch(function (error)
        { badnews(error); })
    }).catch(function (error)
    { badnews(error); })
}

function AlarmsTab()
{

    var maxvalues = [], minvalues = [], defaultvalues = [], usData = [];
    var alarmtable = [];
    var device_id = document.getElementById("idtest").value;

    db.collection("devices").doc(device_id).collection("alarms").get().then(snapshot =>
    {

        snapshot.forEach(doc =>
        {
            var parameter = toTitleCase(doc.data().parameter.replace(/_/g, " ")) || "---";
            var type = doc.data().type || "---";
            var value = doc.data().value;
            var trigger = doc.data().trigger;
            var timestamp = datetimeformat(doc.data().timestamp);
            if (type !== "---") {
                alarmtable.push([timestamp, parameter, trigger, value, type]);
                if (type == "Max") { if (parameter in maxvalues) { maxvalues[parameter] = maxvalues[parameter] + 1 } else { maxvalues[parameter] = 0 } }
                if (type == "Min") { if (parameter in minvalues) { minvalues[parameter] = minvalues[parameter] + 1 } else { minvalues[parameter] = 0 } }
                defaultvalues[parameter] = 0
            }

        })
    }).then(function ()
    {
        document.getElementById("alarmtitle").innerHTML = "Alarm History";
        var b_coun = 0;
        Object.keys(defaultvalues).forEach(function (key)
        {
            b_coun++;
            usData.push({ Parameter: key, Maximum: maxvalues[key], Minimum: minvalues[key] })
            if (Object.keys(defaultvalues).length == b_coun) {
                alarmchart(usData);
            }
        });


        $('#alrmtble').DataTable({
            destroy: !0, dom: 'Bfrtip', buttons: ['copy', 'csv', 'excel', 'pdf'],
            data: alarmtable,
            columns: [{ title: "timestamp" }, { title: "parameter" }, { title: "trigger" }, { title: "value." }, { title: "type" },], autoWidth: !0
        })
    }).catch(function (error)
    {
        badnews(error);
    });

}

function alarmchart(e)
{
    console.log(e);
    am4core.useTheme(am4themes_animated); var a = am4core.create("alarm_stats", am4core.Container); a.width = am4core.percent(100), a.height = am4core.percent(100), a.layout = "horizontal";
    var r = a.createChild(am4charts.XYChart); r.paddingRight = 0, r.data = JSON.parse(JSON.stringify(e)); var t = r.yAxes.push(new am4charts.CategoryAxis());
    t.dataFields.category = "Parameter", t.renderer.grid.template.location = 0, t.renderer.minGridDistance = 15; var i = r.xAxes.push(new am4charts.ValueAxis());
    i.renderer.inversed = !0, i.min = 0, i.max = 50, i.strictMinMax = !0, i.numberFormatter = new am4core.NumberFormatter(), i.numberFormatter.numberFormat = "#.#'%'";
    var m = r.series.push(new am4charts.ColumnSeries()); m.dataFields.valueX = "Maximum", m.dataFields.valueXShow = "percent";
    m.calculatePercent = !0, m.dataFields.categoryY = "Parameter", m.interpolationDuration = 1e3, m.columns.template.tooltipText = "Maximum Alarms, {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    var n = a.createChild(am4charts.XYChart); n.paddingLeft = 0, n.data = JSON.parse(JSON.stringify(e));
    var o = n.yAxes.push(new am4charts.CategoryAxis()); o.renderer.opposite = !0, o.dataFields.category = "Parameter", o.renderer.grid.template.location = 0, o.renderer.minGridDistance = 15;
    var s = n.xAxes.push(new am4charts.ValueAxis());
    s.min = 0, s.max = 50, s.strictMinMax = !0, s.numberFormatter = new am4core.NumberFormatter(), s.numberFormatter.numberFormat = "#.#'%'", s.renderer.minLabelPosition = .01;
    var l = n.series.push(new am4charts.ColumnSeries());
    l.dataFields.valueX = "Minimum", l.dataFields.valueXShow = "percent", l.calculatePercent = !0, l.fill = n.colors.getIndex(4), l.stroke = l.fill, l.columns.template.tooltipText = "Minimum Alarms, {categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)", l.dataFields.categoryY = "Parameter", l.interpolationDuration = 1e3
}

var mindata, maxdata;
function rangebtn()
{
    var dataSet2 = [];
    var device_id = document.getElementById("idtest").value;

    db.collection("devices").doc(device_id).collection("datasets").doc("config").get().then(function (doc)
    {
        mindata = doc.data().min;
        maxdata = doc.data().max;
        Object.keys(maxdata).forEach((name) =>
        {
            if (name != "timestamp") {
                dataSet2.push([toTitleCase(name.replace(/_/g, " ")),
                "<input type='text' class=''  id='" + name + "ranger' value='" + mindata[name] + ";" + maxdata[name] + "' name='range' />"])
            }
        })
    }).then(function ()
    {
        $(document).ready(function ()
        { $('#table23').DataTable({ destroy: !0, "searching": !1, paging: !1, data: dataSet2, columns: [{ title: "Parameter" }, { title: "Out of Range Values" },] }) }); Object.keys(maxdata).forEach((name) =>
        {
            if (name.includes("temperature")) { max = 40; min = 20 } else if (name.includes("pressure")) { max = 500; min = 100 } else { min = mindata[name] - 50; max = maxdata[name] + 50 }
            $("#" + name + "ranger").ionRangeSlider({ type: "double", min: min, max: max, grid: !0, })
        });

    }).catch(function (error)
    {

        badnews(error);
    })

}

function rangesave()
{
    device_id = document.getElementById("idtest").value;
    Object.keys(maxdata).forEach((name) => { var str = document.getElementById(name + "ranger").value; var res = str.split(";"); mindata[name] = res[0]; maxdata[name] = res[1] });

    db.collection("devices").doc(device_id).collection("datasets").doc("config").set({ max: maxdata, min: mindata }, { merge: !0 })
        .then(function ()
        {
            goodnews("Sucessfully Saved to Alarms");

        })
        .catch(function (error)
        { badnews(error); });
}
////////////////////////////////  END OF ALARM SETTINGS ///////////////////////////////

/////////////////START OF VERDICT/////////////////////////
function verdict_edit()
{
    var e, t = document.getElementById("vdtText").value, n = document.getElementById("idtest").value, o = new Date(), c = document.getElementById("UserNameUpdte").value, i = document.getElementById("topProImg").src || "imagedroplet_80.png"; db.collection("devices").doc(n).collection("verdict_logs").orderBy("timestamp", "asc").limit(5).get().then(function (t)
    {
        t.size > 5 ? t.forEach(function (t)
        { e = t.id }) : e = ""
    }).then(function ()
    {
        e ? db.collection("devices").doc(n).collection("verdict_logs").doc(e).set({ name: c, message: t, timestamp: o, profilepic: i, dataset: dataset }).then(function ()
        { swal("Your verdict was noted. Thanks.", { icon: "success" }), load_verdicts(n) }).catch(function (e)
        { swal({ title: "Warning", text: "Error, savings info " + e, icon: "warning", buttons: !0, dangerMode: !0 }) }) : db.collection("devices").doc(n).collection("verdict_logs").doc().set({ name: c, message: t, timestamp: o, profilepic: i, dataset: dataset }).then(function ()
        { swal("Your verdict was noted. Thanks.", { icon: "success" }), load_verdicts(n) }).catch(function (e)
        { swal({ title: "Warning", text: "Error, savings info " + e, icon: "warning", buttons: !0, dangerMode: !0 }) })
    }).catch(function (e)
    { console.log("Error getting documents: ", e) })
}

/////////////////////////////////////////////////////////
function toTitleCase(e)
{
    return e.replace(/\w\S*/g, function (e)
    { return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase() })
}

function loader(_success)
{
    var obj2 = document.querySelector('.loader_com');
    obj2.classList.add('hider');
    //obj2.classList.add('hider')
    var obj = document.querySelector('.preloader');

    obj.classList.add('show');

    var w = 0, t = setInterval(function ()
    {
        if (w < 100) { w = w + 1 }
        document.getElementById('loader_text').innerText = w + '%';
        if (loaded || w >= 100) {

            setTimeout(function ()
            {
                obj.classList.remove('show');
                obj2.classList.remove('hider');
                obj2.classList.add('show');
                clearInterval(t); w = 0; if (_success) { return _success() }
                // Something you want delayed.

            }, 1000); // How long do you want the delay to be (in milliseconds)? 

            //   document.getElementById("content_page").style.display = "block";




        }
    }, 20)
}