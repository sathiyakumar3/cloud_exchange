var loaded = false;
loader();

var device_id = null,
    damper_max = 360,
    damper_min = 0,
    delete_flag = !1,
    alarmsload = !0,
    deltaposi, state = !1,
    domainer, dataset, d_supply_air_pressure = 0,
    d_supply_air_temperature = 0,
    d_return_air_temperature = 0,
    d_zone_air_temperature = 0,
    d_zone_air_humidity = 0,
    d_zone_air_quality_index = 0,
    d_damper_position = 0,
    supply_air_pressure = 0,
    supply_air_temperature = 0,
    return_air_temperature = 0,
    zone_air_temperature = 0,
    zone_air_humidity = 0,
    zone_air_quality_index = 0,
    damper_position = 0,
    damper_value = 0;
var s_date = new Date(),
    e_date = s_date.setDate(s_date.getHours() - 3),
    s_date_format, e_date_format;

var qrcode = new QRCode(document.getElementById("qrcode"), { width: 100, height: 100, });
var eChart_4 = echarts.init(document.getElementById('e_chart_4')),
    eChart_6 = echarts.init(document.getElementById('e_chart_6'));
document.getElementById('angle_ac').innerHTML = 0, document.getElementById('deltaposi2').innerHTML = "---";



function aqi(score) {
    var IAQ_text = "Air quality is ";
    if (score >= 301) IAQ_text = "</br><strong>Hazardous</strong> - Health warnings of emergency conditions. The entire population is more likely to be affected.";
    else if (score >= 201 && score <= 300) IAQ_text = "<strong>Very Unhealthy</strong> - Health alert: everyone may experience more serious health effects.";
    else if (score >= 176 && score <= 200) IAQ_text = "<strong>Unhealthy</strong> - Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    else if (score >= 151 && score <= 175) IAQ_text = "<strong>Unhealthy for Sensitive Groups</strong> - Members of sensitive groups may experience health effects. The general public is not likely to be affected. ";
    else if (score >= 51 && score <= 150) IAQ_text = "<strong>Moderate</strong>  - Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of sensitive people.";
    else if (score >= 00 && score <= 50) IAQ_text = "<strong>Good</strong> - AQI is 0 to 50. Air quality is considered satisfactory, and air pollution poses little or no risk. ";
    document.getElementById('aqitext').innerHTML = IAQ_text
}

function updateposi(e, a) {
    var d = document.getElementById("angle_ac").innerHTML;
    $("#range_4").ionRangeSlider({ hide_min_max: !1, min: 0, max: 360, from: e, to: a, type: "double", step: 10, grid: !0 });
    var n = "---",
        t = (a - e) / 5;
    d >= a ? n = "The damper is open fully." : d >= a - t ? n = "The damper is almost open fully." : d >= a - 2 * t ? n = "The damper is half way open." : d >= a - 3 * t ? n = "The damper is closed partially." : d >= a - 4 * t && (n = "The damper is fully closed."), document.getElementById("dampertext").innerHTML = n;
    var i = d / (a - e) * 100;
    $("#pie_chart_4").data("easyPieChart").update(i)
}
$('#pie_chart_4').easyPieChart({
    barColor: 'rgba(17,157,210,1)',
    lineWidth: 20,
    animate: 3000,
    rotate: 0,
    update: 21,
    size: 165,
    lineCap: 'round ',
    trackColor: 'rgba(33,33,33,0.1)',
    scaleColor: !1,
    onStep: function(from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)) }
});


$(document).ready(function() {
    var device_id = document.getElementById("idtest").value;
    domainer = document.getElementById("domainname").value;
    role = document.getElementById("role1").value;
    name = document.getElementById("devname").value;
    document.getElementById('dName').innerHTML = device_id;
    document.getElementById("dvicetypetest").innerHTML = name;
    document.getElementById("sitenavi").innerHTML = domainer;
    var load_indi = document.getElementById("li_" + device_id).innerHTML;
    load_indi = load_indi.replace('&nbsp;&nbsp;<i class="fas fa-spinner fa-spin"></i>', '');
    db.collection("devices").doc(device_id).collection("datasets").doc("design").get().then(function(doc) {
        d_supply_air_pressure = doc.data().supply_air_pressure;
        d_supply_air_temperature = doc.data().supply_air_temperature;
        d_return_air_temperature = doc.data().return_air_temperature;
        d_zone_air_temperature = doc.data().zone_air_temperature;
        d_zone_air_humidity = doc.data().zone_air_humidity;
        d_zone_air_quality_index = doc.data().zone_air_quality_index;
        d_damper_position = doc.data().damper_position
    }).then(function() {
        var dataset5 = [];
        dataset5.push(["Damper Position", "<input type='text' class=''  id='id_dp_dpranger' value='" + d_damper_position + "' name='range' height='2px' />"]);
        dataset5.push(["Return Air Temperature", "<input type='text' class=''  id='id_rat_dpranger' value='" + d_return_air_temperature + "' name='range' />"]);
        dataset5.push(["Supply Air Pressure", "<input type='text' class=''  id='id_sap_dpranger' value='" + d_supply_air_pressure + "' name='range' />"]);
        dataset5.push(["Supply Air Temperature", "<input type='text' class=''  id='id_sat_dpranger' value='" + d_supply_air_temperature + "' name='range' />"]);
        dataset5.push(["Zone Air Humidity	", "<input type='text' class=''  id='id_zah_dpranger' value='" + d_zone_air_humidity + "' name='range' />"]);
        dataset5.push(["Zone Air Quality Index", "<input type='text' class=''  id='id_zaqi_dpranger' value='" + d_zone_air_quality_index + "' name='range' />"]);
        dataset5.push(["Zone Air Temperature", "<input type='text' class=''  id='id_zat_dp2ranger' value='" + d_zone_air_temperature + "' name='range' />"]);
        load_design_slider(dataset5);
        db.collection("devices").doc(device_id).get().then(doc => {

            blocked = doc.data().blocked;
            description = doc.data().description;
            type = doc.data().type;
            delete_flag = doc.data().delete_flag;
            domain = doc.data().domain;
            format = doc.data().format;
            publickey = doc.data().publickey;
            owner = doc.data().owner;
            loadimage(doc.data().image);
            document.getElementById('lastlog1').innerHTML = description;
            document.getElementById('qrtext').value = doc.data().type + ".html" + "?id=" + device_id;
            db.collection("devices").doc(device_id).collection('datasets').doc('config').get().then(function(doc) {
                document.getElementById('total_logs').innerHTML = doc.data().log_minimum_points;
                document.getElementById('total_logs1').innerHTML = doc.data().log_minimum_points;
                document.getElementById('used_logs').innerHTML = doc.data().log_size;

                config_update((doc.data().log_interval) / 60, doc.data().log_minimum_points, doc.data().log_update, doc.data().alarm_update, doc.data().log_size, name, description, type, domain, device_id, format, publickey, owner);
                damper_min = doc.data().min.damper_position;
                damper_max = doc.data().max.damper_position
            }).then(function() {
                $("#qrtext").on("keyup", function() { qrcode.makeCode($(this).val()) }).keyup().focus();
                var tabledata = [];
                var temperature1logs = [];
                var temperature2logs = [];
                var temperature3logs = [];
                var temperature4logs = [];
                var devicechart = [];



                db.collection("devices").doc(device_id).collection("logs").orderBy("timestamp", "desc").limit(50).get().then(snapshot => {
                    var addflag = false;
                    snapshot.forEach(doc => {
                        if (addflag) {
                            temperature1logs.push(doc.data().return_air_temperature);
                            temperature2logs.push(doc.data().supply_air_temperature);
                            temperature3logs.push(doc.data().zone_air_temperature);
                            temperature4logs.push(doc.data().zone_air_humidity);
                            var supply_air_temperature_temp = doc.data().supply_air_temperature;
                            var return_air_temperature_temp = doc.data().return_air_temperature;
                            var damper_position_temp = doc.data().damper_position;
                            var zone_air_quality_index_temp = doc.data().zone_air_quality_index;
                            var zone_air_humidity_temp = doc.data().zone_air_humidity;
                            var zone_air_temperature_temp = doc.data().zone_air_temperature;
                            var timedate2_temp = doc.data().timestamp.toDate().getHours();
                            var supply_air_pressure_temp = doc.data().supply_air_pressure;
                            var timedate1_temp = doc.data().timestamp.toDate()
                            var timedate3_temp = datetimeformat(doc.data().timestamp);
                            tabledata.push([timedate3_temp, supply_air_temperature_temp + (" °C"), supply_air_pressure_temp + (" kpa"), return_air_temperature_temp + (" °C"), damper_position_temp + (" %"), zone_air_quality_index_temp, zone_air_temperature_temp + (" °C"), zone_air_humidity_temp + (" %")]);
                            devicechart.push({ date: timedate1_temp, sap: supply_air_pressure_temp, sat: supply_air_temperature_temp, rat: return_air_temperature_temp, zaqi: zone_air_quality_index_temp, zah: zone_air_humidity_temp, dp: damper_position_temp, zat: zone_air_temperature_temp })

                        }
                        addflag = true;
                    })
                }).then(function() {

                    unsubscribe = db.collection("devices").doc(device_id).collection("datasets").doc("live").onSnapshot(function(doc) {
                        var designvsactual = [];
                        supply_air_pressure = doc.data().supply_air_pressure;

                        supply_air_temperature = doc.data().supply_air_temperature;
                        return_air_temperature = doc.data().return_air_temperature;
                        zone_air_temperature = doc.data().zone_air_temperature;
                        zone_air_humidity = doc.data().zone_air_humidity;
                        zone_air_quality_index = doc.data().zone_air_quality_index;
                        damper_position = doc.data().damper_position;
                        dataset = { supply_air_temperature: supply_air_temperature, return_air_temperature: supply_air_temperature, zone_air_humidity: zone_air_humidity, zone_air_temperature: zone_air_temperature, zone_air_quality_index: zone_air_quality_index, supply_air_pressure: supply_air_pressure, damper_position: damper_position, }
                        if (!blocked) {
                            if (doc.data().timestamp != undefined) {

                                var last_updated = datetimeformat(doc.data().timestamp);
                                document.getElementById('lastlog2').innerHTML = last_updated;
                                oldtimestamp = doc.data().timestamp;
                                newtimestamp = Date.now();
                                difference = ((newtimestamp - oldtimestamp.toMillis()) / 1000) || 0;
                                if (difference > 60) { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='White'>[NOT LIVE]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" } else { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='Lime'>[LIVE]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" }
                            } else { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + "   <font color='Red'>[NOT CONNECTED]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" }

                        } else {
                            document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='Red'>[STAND-BY]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;"
                        }
                        document.getElementById('zonePpm').innerHTML = supply_air_temperature + (" °C");
                        document.getElementById('dva1').innerHTML = return_air_temperature + (" °C <br/>  Return Air <br/> Temperature ");
                        document.getElementById('dva2').innerHTML = supply_air_pressure + (" kpa <br/> Supply Air<br/> Pressure");
                        document.getElementById('roomtem').innerHTML = return_air_temperature + (" °C");
                        document.getElementById('dva3').innerHTML = supply_air_temperature + (" °C <br/>Supply Air <br/> Temperature");
                        document.getElementById('zonetemp6').innerHTML = zone_air_temperature + (" °C");
                        document.getElementById('zonehumid6').innerHTML = zone_air_humidity + (" %");
                        document.getElementById('angle_ac').innerHTML = damper_position
                        if (deltaposi != damper_position) {
                            document.getElementById('deltaposi2').innerHTML = last_updated;
                            document.getElementById('deltaposi').innerHTML = (damper_position - deltaposi) + " °";
                            deltaposi = damper_position
                        }
                        damper_value = damper_position
                        aqi(zone_air_quality_index);
                        designvsactual.push(["Supply Air Temperature", d_supply_air_temperature + ' °C', supply_air_temperature + " °C"]);
                        designvsactual.push(["Return Air Temperature", d_return_air_temperature + ' °C', return_air_temperature + " °C"]);
                        designvsactual.push(["Supply Air Pressure", d_supply_air_pressure + ' kpa', supply_air_pressure + " kpa"]);
                        designvsactual.push(["Zone Air Temperature", d_zone_air_temperature + ' °C', zone_air_temperature + " °C"]);
                        designvsactual.push(["Zone Air Humidity", d_zone_air_humidity + ' %', zone_air_humidity + " %"]);
                        designvsactual.push(["Zone Air Quality Index", d_zone_air_quality_index, zone_air_quality_index]);
                        designvsactual.push(["Damper Position", d_damper_position + ' %', damper_position + " %"]);
                        $(document).ready(function() { $('#dbtable2').DataTable({ data: designvsactual, bDestroy: !0, columns: [{ title: "Parameters" }, { title: "Designed" }, { title: "Actual" }] }) });
                        option1.series[0].data[0].value = supply_air_pressure;
                        option1.series[0].axisLine.lineStyle.color[0][0] = supply_air_pressure / 250;
                        option1.series[0].axisLine.lineStyle.color[0][1] = detectionData(supply_air_pressure);
                        eChart_4.setOption(option1, !0);
                        option3.series[0].data[0].value = zone_air_quality_index;
                        option3.series[0].axisLine.lineStyle.color[0][0] = zone_air_quality_index / 500;
                        option3.series[0].axisLine.lineStyle.color[0][1] = detectionData(zone_air_quality_index);
                        eChart_6.setOption(option3, !0);
                        updateposi(damper_min, damper_max);
                        sparklineLogin(temperature1logs, temperature2logs, temperature3logs, temperature4logs)
                    })
                    multiplecharts([], devicechart, !0);
                    loadtable(tabledata);
                    document.getElementById('loaddata').innerHTML = "Datasets - [Last 24 records]";
                    load_verdicts(device_id);
                    document.getElementById("li_" + device_id).innerHTML = load_indi;
                    loaded = true;
                }).catch(function(error) { swal({ title: "Warning", text: "Sorry, loading device datasets 1 " + error, icon: "warning", buttons: !0, dangerMode: !0, }) })
            }).catch(function(error) { swal({ title: "Warning", text: "Sorry, loading device datasets 2 " + error, icon: "warning", buttons: !0, dangerMode: !0, }) })
        }).catch(function(error) { swal({ title: "Warning", text: "Sorry, loading device datasets 3 " + error, icon: "warning", buttons: !0, dangerMode: !0, }) })
    }).catch(function(error) { swal({ title: "Warning", text: "Desinged Parameters Could not be loaded." + error, icon: "warning", buttons: !0, dangerMode: !0, }) })
});

function load_verdicts(a) {
    var t = 0,
        e = "";
    db.collection("devices").doc(a).collection("verdict_logs").orderBy("timestamp", "desc").limit(5).get().then(function(a) {
        a.forEach(function(a) {
            t++;
            var i = a.data().dataset;
            i = JSON.stringify(i, null, "	");
            var s = datetimeformat(a.data().timestamp);
            e = e + '<div class="sl-item"><a href="#href_' + t + '"  data-toggle="collapse"><div class="sl-avatar avatar avatar-sm avatar-circle">                                                            <img class="img-responsive img-circle" src="' + a.data().profilepic + '" alt="avatar">                                                          </div>                                                          <div class="sl-content">                                                            <p class="inline-block"> <span> ' + a.data().message + '</span> <span class="capitalize-font txt-primary mr-5 weight-500"> -' + a.data().name + '</span><span class="block txt-grey font-12 capitalize-font">' + s + '</span></p>                                                                                                                                                                                                                                </div>                                                        </a>                                                        <div class="collapse" id="href_' + t + '" aria-expanded="false" style="">          <div class="well"> ' + i + "</div>        </div></div></div>"
        }), document.getElementById("verdict_list").innerHTML = e
    }).catch(function(a) { console.log("Error getting documents: ", a) })
}

function load_design_slider(i) { $("#table24").DataTable({ destroy: !0, searching: !1, paging: !1, data: i, columns: [{ title: "Parameter" }, { title: "Designed For" }] }), $("#id_dp_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_rat_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_sap_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_sat_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_zah_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_zaqi_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_zat_dp2ranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }), $("#id_zah_dpranger").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }) }

function loadtable(tabledata) {
    $(document).ready(function() { $('#dbtable003').DataTable({ destroy: !0, dom: 'Bfrtip', buttons: ['copy', 'csv', 'excel', 'pdf'], data: tabledata, columns: [{ title: "Time and Date" }, { title: "Supply Air Temperature" }, { title: "Supply Air Pressure" }, { title: "Return Air Temperature" }, { title: "Damper Position" }, { title: "Air Quality Index" }, { title: "Zone Air Temperature" }, { title: "Zone Air Humdity" }] }) })
}

function sparklineLogin(i, r, e, l) {
    return $("#sparkline_4").length > 0 && $("#sparkline_4").sparkline(i, { type: "line", width: "100%", height: "45", barWidth: "10", resize: !0, barSpacing: "10", barColor: "#667add", highlightSpotColor: "#667add" }), $("#sparkline_5").length > 0 && $("#sparkline_5").sparkline(r, { type: "line", width: "100%", height: "45", barWidth: "10", resize: !0, barSpacing: "10", barColor: "#667add", highlightSpotColor: "#667add" }), $("#sparkline_7").length > 0 && $("#sparkline_7").sparkline(e, { type: "line", width: "100%", height: "45", lineColor: "#ce6300", fillColor: "#ffa505", minSpotColor: "#667add", maxSpotColor: "#667add", spotColor: "#667add", highlightLineColor: "rgba(0, 0, 0, 0.6)", highlightSpotColor: "#7f3f00" }), $("#sparkline_8").length > 0 && $("#sparkline_8").sparkline(l, { type: "bar", width: "100%", height: "45", barWidth: "10", resize: !0, barSpacing: "10", barColor: "#ffa505", highlightSpotColor: "#667add" }), new Promise(function(i, r) { i("Stuff worked!") })
}

function detectionData(e) { var t = "#667add"; return e >= 30 && 60 >= e ? t = "#d36ee8" : e > 60 && (t = "#119dd2"), t }
var option1 = {
        tooltip: { align: "centre", formatter: "The fan should maintain a constant static pressure in the discharge duct regardless of the position of the damper of the VAV box." },
        series: [{
            name: "Supply Air Pressure",
            type: "gauge",
            splitNumber: 5,
            min: 0,
            max: 250,
            axisLine: {
                lineStyle: {
                    color: [
                        [.31, "#f4f4f4"],
                        [1, "#f4f4f4"]
                    ],
                    width: 20
                }
            },
            axisTick: { show: !0 },
            axisLabel: { distance: -60, textStyle: { color: "#878787", fontStyle: "normal", fontWeight: "normal", fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
            splitLine: { show: !0 },
            itemStyle: { normal: { color: "#667add" } },
            detail: { formatter: "{value} kpa", offsetCenter: [0, "60%"], textStyle: { fontSize: 12, color: "#878787" } },
            title: { offsetCenter: [0, "400%"] },
            data: [{ name: "", value: 0 }]
        }]
    },
    option3 = {
        tooltip: { align: "centre", formatter: "The AQI is an index for reporting air quality. It tells you how clean or polluted your air is," },
        series: [{
            name: "Air Quality Index",
            type: "gauge",
            splitNumber: 5,
            min: 0,
            max: 500,
            axisLine: {
                lineStyle: {
                    color: [
                        [.31, "#f4f4f4"],
                        [1, "#f4f4f4"]
                    ],
                    width: 20
                }
            },
            axisTick: { show: !0 },
            axisLabel: { distance: -60, textStyle: { color: "#878787", fontStyle: "normal", fontWeight: "normal", fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
            splitLine: { show: !0 },
            itemStyle: { normal: { color: "#667add" } },
            detail: { formatter: "{value} ", offsetCenter: [0, "60%"], textStyle: { fontSize: 12, color: "#878787" } },
            data: [{ name: "", value: 0 }]
        }]
    };

function rangesave3() {
    device_id = document.getElementById("idtest").value, d_damper_position = document.getElementById("id_dp_dpranger").value, d_return_air_temperature = document.getElementById("id_rat_dpranger").value, d_zone_air_temperature = document.getElementById("id_zat_dp2ranger").value, d_supply_air_pressure = document.getElementById("id_sap_dpranger").value, d_supply_air_temperature = document.getElementById("id_sat_dpranger").value, d_zone_air_humidity = document.getElementById("id_zah_dpranger").value, d_zone_air_quality_index = document.getElementById("id_zaqi_dpranger").value, db.collection("devices").doc(device_id).collection("datasets").doc("design").set({ damper_position: d_damper_position, return_air_temperature: d_return_air_temperature, zone_air_temperature: d_zone_air_temperature, supply_air_pressure: d_supply_air_pressure, supply_air_temperature: d_supply_air_temperature, zone_air_humidity: d_zone_air_humidity, zone_air_quality_index: d_zone_air_quality_index }, { merge: !0 }).then(function() {
        var e = [];
        e.push(["Supply Air Temperature", d_supply_air_temperature + " °C", supply_air_temperature + " °C"]), e.push(["Return Air Temperature", d_return_air_temperature + " °C", return_air_temperature + " °C"]), e.push(["Supply Air Pressure", d_supply_air_pressure + " kpa", supply_air_pressure + " kpa"]), e.push(["Zone Air Temperature", d_zone_air_temperature + " °C", zone_air_temperature + " °C"]), e.push(["Zone Air Humidity", d_zone_air_humidity + " %", zone_air_humidity + " %"]), e.push(["Zone Air Quality Index", d_zone_air_quality_index, zone_air_quality_index]), e.push(["Damper Position", d_damper_position + " %", damper_position + " %"]), $(document).ready(function() { $("#dbtable2").DataTable({ data: e, bDestroy: !0, columns: [{ title: "Parameters" }, { title: "Designed" }, { title: "Actual" }] }) }), swal("Sucessfully Saved.", { icon: "success" })
    }).catch(function(e) { swal({ title: "Warning", text: "Error saving min range datasets " + e, icon: "warning", buttons: !0, dangerMode: !0 }) })
}

function rangesave2() {
    device_id = document.getElementById("idtest").value;
    db.collection("devices").doc(device_id).collection("datasets").doc("config").get().then(function(doc) {
        var mindata1 = doc.data().min;
        var maxdata1 = doc.data().max;
        device_id = document.getElementById("idtest").value;
        var e = document.getElementById("range_4").value,
            n = e.split(";");
        damper_min = n[0], damper_max = n[1];
        console.log(mindata1);
        mindata1.damper_position = damper_min;
        maxdata1.damper_position = damper_max;
        db.collection("devices").doc(device_id).collection("datasets").doc("config").set({ max: maxdata1, min: mindata1 }, { merge: !0 }).then(function() { swal("Sucessfully Saved to Alarms", { icon: "success", }) }).catch(function(error) { swal({ title: "Warning", text: "Error saving max range datasets " + error, icon: "warning", buttons: !0, dangerMode: !0, }) })
    }).catch(function(error) { console.log("Error getting document:", error) })
}

function multiplecharts(e, r, t) {
    function a(e, r, t, a, n) {
        var l = i.yAxes.push(new am4charts.ValueAxis()),
            d = i.series.push(new am4charts.LineSeries());
        d.dataFields.valueY = e, d.dataFields.dateX = "date", d.strokeWidth = 2, d.name = r, d.tooltipText = "{name}: [bold]{valueY}[/] " + n, d.tensionX = .8;
        var o = new am4core.InterfaceColorSet();
        switch (a) {
            case "triangle":
                var a = d.bullets.push(new am4charts.Bullet());
                a.width = 12, a.height = 12, a.horizontalCenter = "middle", a.verticalCenter = "middle";
                var c = a.createChild(am4core.Triangle);
                d.yAxis = s, s.renderer.grid.template.disabled = !0, s.renderer.line.strokeOpacity = 1, s.renderer.line.strokeWidth = 2, s.renderer.opposite = t, c.stroke = o.getFor("background"), c.strokeWidth = 2, c.direction = "top", c.width = 12, c.height = 12;
                break;
            case "rectangle":
                d.yAxis = l, l.renderer.grid.template.disabled = !0, l.renderer.line.strokeOpacity = 1, l.renderer.line.strokeWidth = 2, l.renderer.line.stroke = d.stroke, l.renderer.labels.template.fill = d.stroke, l.renderer.opposite = t;
                var a = d.bullets.push(new am4charts.Bullet());
                a.width = 10, a.height = 10, a.horizontalCenter = "middle", a.verticalCenter = "middle";
                var u = a.createChild(am4core.Rectangle);
                u.stroke = o.getFor("background"), u.strokeWidth = 2, u.width = 10, u.height = 10;
                break;
            default:
                d.yAxis = l, l.renderer.grid.template.disabled = !0, l.renderer.line.strokeOpacity = 1, l.renderer.line.strokeWidth = 2, l.renderer.line.stroke = d.stroke, l.renderer.labels.template.fill = d.stroke, l.renderer.opposite = t;
                var a = d.bullets.push(new am4charts.CircleBullet());
                a.circle.stroke = o.getFor("background"), a.circle.strokeWidth = 2
        }
    }
    am4core.useTheme(am4themes_animated);
    var i = am4core.create("chartdiv8", am4charts.XYChart);
    i.colors.step = 2, i.data = r;
    var n = i.xAxes.push(new am4charts.DateAxis());
    n.baseInterval = { timeUnit: "second", count: 1 }, n.tooltipDateFormat = "HH:mm, d MMMM";
    var n = i.xAxes.push(new am4charts.DateAxis());
    n.renderer.minGridDistance = 25;
    var s = i.yAxes.push(new am4charts.ValueAxis());
    e.includes("supply_air_pressure") && a("sap", "Supply Air Pressure", !0, "rectangle", "kpa"), e.includes("supply_air_temperature") && a("sat", "Supply Air Temperature", !1, "triangle", "°C"), (e.includes("return_air_temperature") || t) && a("rat", "Return Air Temperature", !1, "triangle", "°C"), (e.includes("zone_air_temperature") || t) && a("zat", "Zone Air Temperature", !1, "triangle", "°C"), (e.includes("zone_air_humidity") || t) && a("zah", "Zone Air Humidity", !0, "circle", "%"), (e.includes("zone_air_quality_index") || t) && a("zaqi", "Zone Air Quality Index", !0, "rectangle", ""), (e.includes("damper_position") || t) && a("dp", "Damper Position", !0, "circle", "%"), i.legend = new am4charts.Legend(), i.cursor = new am4charts.XYCursor(), i.exporting.menu = new am4core.ExportMenu()
}

function dimageone(e) { device_id = document.getElementById("idtest").value, db.collection("devices").doc(device_id).update({ image: e }).then(function() { loadimage(e) }) }

function loadimage(t) {
    db.collection("types").doc("vavnawh").collection("images").doc(t).get().then(function(t) { t.exists && (document.getElementById("imgtests").style.background = t.data().background, document.getElementById("imgtests").style.backgroundSize = t.data().backgroundSize, document.getElementById("imgtests").style.backgroundPosition = t.data().backgroundPosition, document.getElementById("imgtests").style.height = t.data().height, document.getElementById("imgtests").style.padding = t.data().padding, document.getElementById("imgtests").style.margin = t.data().margin, document.getElementById("dva1").style.padding = t.data().value_1_padding, document.getElementById("dva1").style.textAlign = t.data().value_1_textAlign, document.getElementById("dva2").style.padding = t.data().value_2_padding, document.getElementById("dva2").style.marginRight = t.data().value_2_marginRight, document.getElementById("dva3").style.padding = t.data().value_3_padding, document.getElementById("dva3").style.marginRight = t.data().value_3_marginRight, document.getElementById("dva3").style.textAlign = t.data().value_3_textAlign) })
}

function gen_cust_gra2() {
    var values = $('#public-methods').val();
    var devicechart = [];
    document.getElementById('loaddata').innerHTML = "Datasets - loading...";
    var tabledata = [];
    formdvid = document.getElementById('formdvid').value;
    db.collection("devices").doc(formdvid).collection("logs").orderBy("timestamp").startAt(s_date).endAt(e_date).get().then(snapshot => {
        if (snapshot.size > 0) { swal(snapshot.size + " records found in the given range", { icon: "success", }) } else { swal("No records found in the given range.") }
        snapshot.forEach(doc => {
            var supply_air_temperature_temp = doc.data().supply_air_temperature;
            var return_air_temperature_temp = doc.data().return_air_temperature;
            var damper_position_temp = doc.data().damper_position;
            var zone_air_quality_index_temp = doc.data().zone_air_quality_index;
            var zone_air_humidity_temp = doc.data().zone_air_humidity;
            var zone_air_temperature_temp = doc.data().zone_air_temperature;
            var supply_air_pressure_temp = doc.data().supply_air_pressure;
            var timedate1_temp = doc.data().timestamp.toDate();
            var timedate3_temp = datetimeformat(doc.data().timestamp);
            tabledata.push([timedate3_temp, supply_air_temperature_temp + (" °C"), supply_air_pressure_temp + (" kpa"), return_air_temperature_temp + (" °C"), damper_position_temp + (" %"), zone_air_quality_index_temp, zone_air_temperature_temp + (" °C"), zone_air_humidity_temp + (" %")]);
            devicechart.push({ date: timedate1_temp, sap: supply_air_pressure_temp, sat: supply_air_temperature_temp, rat: return_air_temperature_temp, zaqi: zone_air_quality_index_temp, zah: zone_air_humidity_temp, dp: damper_position_temp, zat: zone_air_temperature_temp })
        })
    }).then(function() {
        document.getElementById('loaddata').innerHTML = "Datasets - [" + s_date_format + "] to [" + e_date_format + "]";
        multiplecharts(values, devicechart, !1);
        loadtable(tabledata)
    }).catch(function(error) {
        console.log("EROR" + error);
        swal({ title: "Warning", text: "Error loading device datasets 21 " + error, icon: "warning", buttons: !0, dangerMode: !0, })
    })
}

function datetimeformat(t) { var e = t.toDate().getDate() + "-" + (t.toDate().getMonth() + 1) + "-" + t.toDate().getFullYear() + "  " + t.toDate().getHours() + ":" + t.toDate().getMinutes() + ":" + t.toDate().getSeconds(); return e }