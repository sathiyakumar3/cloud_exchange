

var loaded = false; loader();

var device_id = null; const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; var s_date = new Date();
s_date.setDate(1), s_date.setHours(00); var e_date = new Date(); e_date.setDate(e_date.getDate() + 1); e_date.setHours(00);
var s_date_format, e_date_format; var mindata, maxdata; var delete_flag = !1; var timestamp_reformat_logs = []; var radar = []; var state = !1;
var eChart_5 = echarts.init(document.getElementById('active_power_chart')); var eChart_6 = echarts.init(document.getElementById('reactive_power_chart'));
var eChart_7 = echarts.init(document.getElementById('apparent_power_chart')); var eChart_9 = echarts.init(document.getElementById('power_factor'));
var refreshflag = !1; var domainer; var now = new Date(); var x = document.getElementById("note1");
$('#public-methods').val(['daily_consumption', 'hourly_consumption']);


function ordinal_suffix_of(i)
{
  var j = i % 10, k = i % 100; if (j == 1 && k != 11) { return i + "st" }
  if (j == 2 && k != 12) { return i + "nd" }
  if (j == 3 && k != 13) { return i + "rd" }
  return i + "th"
}
function trendicon(val)
{
  var ans = "<i class=\"zmdi zmdi-trending-up txt-success font-20\"></i>"; if (val < 0) { ans = "<i class=\"zmdi zmdi-trending-down txt-success font-20\"></i>" }
  return ans
}


function pfscale(score)
{ var pftext = "PF is "; if (score >= .95) pftext = "</br>Power Factor is Good."; else if (score >= .90 && score <= .94) pftext = "</br>There is room for improvement."; else if (score >= .85 && score <= .89) pftext = "</br>The power factor should be improved."; else if (score <= .84) pftext = "</br>The power factor must be improved."; document.getElementById('pftext').innerHTML = pftext }


var qrcode = new QRCode(document.getElementById("qrcode"), { width: 100, height: 100, });

$(document).ready(function ()
{
  device_id = document.getElementById("idtest").value; domainer = document.getElementById("domainname").value; name = document.getElementById("devname").value; role = document.getElementById("role1").value; document.getElementById("dvicetypetest").innerHTML = name;
  document.getElementById("sitenavi").innerHTML = domainer;
  document.getElementById('dName').innerHTML = device_id; var load_indi = document.getElementById("li_" + device_id).innerHTML;
  load_indi = load_indi.replace('&nbsp;&nbsp;<i class="fas fa-spinner fa-spin"></i>', '');
  db.collection("devices").doc(device_id).get().then(doc =>
  {
    name = doc.data().name;
    description = doc.data().description;
    type = doc.data().type;
    delete_flag = doc.data().delete_flag;
    domain = doc.data().domain;
    format = doc.data().format;
    publickey = doc.data().publickey;
    blocked = doc.data().blocked;
    owner = doc.data().owner;
    document.getElementById('lastlog1').innerHTML = description;
    document.getElementById('qrtext').value = doc.data().type + ".html" + "?id=" + device_id;
    db.collection("devices").doc(device_id).collection('datasets').doc('config').get().then(function (doc)
    {
      document.getElementById('total_logs').innerHTML = doc.data().log_minimum_points;
      document.getElementById('total_logs1').innerHTML = doc.data().log_minimum_points;
      document.getElementById('used_logs').innerHTML = doc.data().log_size;
      config_update((doc.data().log_interval) / 60, doc.data().log_minimum_points, doc.data().log_update, doc.data().alarm_update, doc.data().log_size, name, description, type, domain, device_id, format, publickey, owner)
    })
      .then(function ()
      {
        $("#qrtext").on("keyup", function ()
        { qrcode.makeCode($(this).val()) }).keyup().focus(); gen_cust_gra2(); document.getElementById("li_" + device_id).innerHTML = load_indi;
        unsubscribe = db.collection("devices").doc(device_id).collection("datasets").doc("live").onSnapshot(function (doc)
        {
          var voltage_1 = doc.data().voltage_1; var voltage_2 = doc.data().voltage_2; var voltage_3 = doc.data().voltage_3; var current_1 = doc.data().current_1; var current_2 = doc.data().current_2; var current_3 = doc.data().current_3; var consumption = doc.data().consumption; var active_power = doc.data().active_power; var reactive_power = doc.data().reactive_power; var apparent_power = doc.data().apparent_power; var power_factor = doc.data().power_factor / 100; pfscale(power_factor);
          if (!blocked) {
            if (doc.data().timestamp != undefined) {
              var last_updated = datetimeformat(doc.data().timestamp); document.getElementById('lastlog2').innerHTML = last_updated;
              oldtimestamp = doc.data().timestamp; newtimestamp = Date.now();
              difference = ((newtimestamp - oldtimestamp.toMillis()) / 1000) || 0;

              if (difference > 60) { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='White'>[NOT LIVE]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" }
              else { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='Lime'>[LIVE]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" }
            }
            else { document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + "   <font color='Red'>[NOT CONNECTED]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;" }
          } else {
            document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='Red'>[[STAND-BY]<]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;"

          }
          document.getElementById('voltage_1').innerHTML = voltage_1 + " V"; document.getElementById('voltage_2').innerHTML = voltage_2 + " V"; document.getElementById('voltage_3').innerHTML = voltage_3 + " V"; document.getElementById('current_1').innerHTML = current_1 + " A"; document.getElementById('current_2').innerHTML = current_2 + " A"; document.getElementById('current_3').innerHTML = current_3 + " A"; document.getElementById('lastho').innerHTML = consumption; option4.series[0].data[0].value = active_power; option4.series[0].axisLine.lineStyle.color[0][0] = active_power / 500; option4.series[0].axisLine.lineStyle.color[0][1] = detectionData(active_power); eChart_5.setOption(option4, !0); option6.series[0].data[0].value = reactive_power; option6.series[0].axisLine.lineStyle.color[0][0] = reactive_power / 500; option6.series[0].axisLine.lineStyle.color[0][1] = detectionData(reactive_power); eChart_6.setOption(option6, !0); option7.series[0].data[0].value = apparent_power; option7.series[0].axisLine.lineStyle.color[0][0] = apparent_power / 500; option7.series[0].axisLine.lineStyle.color[0][1] = detectionData(apparent_power); eChart_7.setOption(option7, !0); option9.series[0].data[0].value = power_factor; option9.series[0].axisLine.lineStyle.color[0][0] = power_factor; option9.series[0].axisLine.lineStyle.color[0][1] = detectionData(power_factor); eChart_9.setOption(option9, !0)
        })
        loaded = true;
      }).catch(function (error)

      { badnews(error); })
  }).catch(function (error)
  { badnews(error); })
});


function detectionData(str)
{
  var color = '#119DD2'; if (str >= 200 && str <= 300) { color = '#667ADD' } else if (str > 300) { color = '#D36EE8' }
  return color
}
var option4 = { "tooltip": { "align": "centre", "formatter": "The actual amount of power being dissipated or performs the useful work in the circuit is called as active or true or real power." }, "series": [{ "name": "Open", "type": "gauge", "splitNumber": 5, "min": 0, "max": 500, "axisLine": { "lineStyle": { "color": [[0.31, "#f4f4f4"], [1, "#f4f4f4"]], "width": 20 } }, "axisTick": { "show": !0 }, "breakpoints": { "AbstractVector": [20, 80, 100] }, "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, "splitLine": { "show": !0 }, "itemStyle": { "normal": { "color": "#667add" } }, "detail": { "formatter": "{value} kW", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } }, "title": { "offsetCenter": [0, "400%"] }, "data": [{ "name": "", "value": 0 }] }] }
var option6 = { "tooltip": { "align": "right", "formatter": "It's one of the total power components that travel back and forth in the circuit or line" }, "series": [{ "name": "Open", "type": "gauge", "splitNumber": 5, "min": 0, "max": 500, "axisLine": { "lineStyle": { "color": [[0.31, "#f4f4f4"], [1, "#f4f4f4"]], "width": 20 } }, "axisTick": { "show": !0 }, "breakpoints": { "AbstractVector": [20, 80, 100] }, "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, "splitLine": { "show": !0 }, "itemStyle": { "normal": { "color": "#667add" } }, "detail": { "formatter": "{value} VAR", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } }, "title": { "offsetCenter": [0, "400%"] }, "data": [{ "name": "", "value": 0 }] }] }
var option7 = { "tooltip": { "align": "centre", "formatter": "It's one of the total power components that travel back and forth in the circuit or line" }, "series": [{ "name": "Open", "type": "gauge", "splitNumber": 5, "min": 0, "max": 500, "axisLine": { "lineStyle": { "color": [[0.31, "#f4f4f4"], [1, "#f4f4f4"]], "width": 20 } }, "axisTick": { "show": !0 }, "breakpoints": { "AbstractVector": [20, 80, 100] }, "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, "splitLine": { "show": !0 }, "itemStyle": { "normal": { "color": "#667add" } }, "detail": { "formatter": "{value} VA", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } }, "title": { "offsetCenter": [0, "400%"] }, "data": [{ "name": "", "value": 0 }] }] }
var option9 = { "tooltip": { "align": "centre", "formatter": "It's a measure of how effectively incoming power is used in your electrical system." }, "series": [{ "name": "Open", "type": "gauge", "splitNumber": 5, "min": 0, "max": 1, "axisLine": { "lineStyle": { "color": [[0.31, "#f4f4f4"], [1, "#f4f4f4"]], "width": 20 } }, "axisTick": { "show": !0 }, "breakpoints": { "AbstractVector": [20, 80, 100] }, "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, "splitLine": { "show": !0 }, "itemStyle": { "normal": { "color": "#667add" } }, "detail": { "formatter": "{value}", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } }, "title": { "offsetCenter": [0, "400%"] }, "data": [{ "name": "", "value": 0 }] }] }
var sparkResize; $(window).on("resize", function ()
{ clearTimeout(sparkResize); eChart_5.resize(); eChart_6.resize(); eChart_7.resize(); eChart_9.resize() }).resize(); function sparklineLogin(peak_logs, off_logs, day_logs, voltage_1_logs, voltage_2_logs, voltage_3_logs, current_1_logs, current_2_logs, current_3_logs)
{
  if ($('#spark_1').length > 0) { $("#spark_1").sparkline(peak_logs, { type: 'bar', width: '100%', height: '35', barWidth: '5', barSpacing: '5', barColor: '#667add', highlightSpotColor: '#667add' }) }
  if ($('#spark_2').length > 0) { $("#spark_2").sparkline(off_logs, { type: 'bar', width: '100%', height: '35', barWidth: '5', barSpacing: '5', barColor: '#667add', highlightSpotColor: '#667add' }) }
  if ($('#spark_3').length > 0) { $("#spark_3").sparkline(day_logs, { type: 'bar', width: '100%', height: '35', barWidth: '5', barSpacing: '5', barColor: '#667add', highlightSpotColor: '#667add' }) }
  if ($('#voltage_1_sparklines').length > 0) { $("#voltage_1_sparklines").sparkline(voltage_1_logs, { type: 'line', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#667add', highlightSpotColor: '#667add' }) }
  if ($('#voltage_2_sparklines').length > 0) { $("#voltage_2_sparklines").sparkline(voltage_2_logs, { type: 'line', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#667add', highlightSpotColor: '#667add' }) }
  if ($('#voltage_3_sparklines').length > 0) { $("#voltage_3_sparklines").sparkline(voltage_3_logs, { type: 'line', width: '100%', height: '45', lineColor: '#ce6300', fillColor: '#ffa505', minSpotColor: '#667add', maxSpotColor: '#667add', spotColor: '#667add', highlightLineColor: 'rgba(0, 0, 0, 0.6)', highlightSpotColor: '#7f3f00' }) }
  if ($('#current_1_sparklines').length > 0) { $("#current_1_sparklines").sparkline(current_1_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
  if ($('#current_2_sparklines').length > 0) { $("#current_2_sparklines").sparkline(current_2_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
  if ($('#current_3_sparklines').length > 0) { $("#current_3_sparklines").sparkline(current_3_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
  return new Promise(function (resolve, reject)
  { if (!0) { resolve("Stuff worked!") } else { reject(Error("It broke")) } })
}
function generatechart(hourlydata, dailydata, d_maximum)
{

  am4core.useTheme(am4themes_animated); var chart = am4core.create("chartdiv12", am4charts.XYChart); chart.legend = new am4charts.Legend(); chart.cursor = new am4charts.XYCursor(); chart.exporting.menu = new am4core.ExportMenu();
  var values = $('#public-methods').val(); if (values.includes('daily_consumption')) { var dateAxis1 = chart.xAxes.push(new am4charts.DateAxis()); dateAxis1.renderer.grid.template.location = 0; dateAxis1.renderer.minGridDistance = 40; var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis()); valueAxis1.renderer.tooltip.disabled = !0; valueAxis1.title.text = "Daily Consumption (kWh)"; valueAxis1.minimum = -400; valueAxis1.maximum = d_maximum; valueAxis1.strictMinMax = !0; var series1 = chart.series.push(new am4charts.ColumnSeries()); series1.dataFields.valueY = "value"; series1.dataFields.dateX = "date"; series1.data = dailydata; series1.xAxis = dateAxis1; series1.yAxis = valueAxis1; series1.tooltipText = " [bold]{valueY}[/] kWh"; series1.columns.template.width = am4core.percent(80); series1.legendSettings.labelText = "Daily Consumption" }
  if (values.includes('hourly_consumption')) { var dateAxis2 = chart.xAxes.push(new am4charts.DateAxis()); dateAxis2.renderer.grid.template.location = 0; dateAxis2.renderer.minGridDistance = 40; dateAxis2.renderer.labels.template.disabled = !0; var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis()); valueAxis2.renderer.opposite = !0; valueAxis2.title.text = "Hourly Consumption (kWh)"; valueAxis2.renderer.tooltip.disabled = !0; var series2 = chart.series.push(new am4charts.LineSeries()); series2.dataFields.valueY = "value"; series2.dataFields.dateX = "date"; series2.data = hourlydata; series2.xAxis = dateAxis2; series2.yAxis = valueAxis2; series2.strokeWidth = 3; series2.legendSettings.labelText = "Hourly Consumption"; series2.tooltipText = "[bold]{valueY}[/] kWh"; series2.connect = !1 }
  hourlydata = []; dailydata = []; return new Promise(function (resolve, reject)
  { if (!0) { resolve("Stuff worked!") } else { reject(Error("It broke")) } })
}
function loadtable(tabledata)
{
  $(document).ready(function ()
  { $('#dbtable001').DataTable({ destroy: !0, dom: 'Bfrtip', buttons: ['copy', 'csv', 'excel', 'pdf'], data: tabledata, columns: [{ title: "Sorter", visible: !1, }, { title: "Date and Time" }, { title: "Voltage 1" }, { title: "Voltage 2" }, { title: "Voltage 3" }, { title: "Current 1" }, { title: "Current 2" }, { title: "Current 3" }, { title: "Power Factor" }, { title: "Consumption" }] }) }); tabledata = []; return new Promise(function (resolve, reject)
  { if (!0) { resolve("Stuff worked!") } else { reject(Error("It broke")) } })
}
function gen_cust_gra2()
{
  var startdate = s_date; var enddate = e_date; var hourlydata = []; var dailydata = []; var dailyconsump = 0;
  var timestamp_hour; var timestamp_original; var timestamp_reformat;
  var timestamp_shortdate; var timestamp_firstday; var yesterdayer; var peak = 123; var off = 0;
  var day_time = 0; var totaldays = 0; var monthly = 0; var date; var peak_logs = [];
  var off_logs = []; var day_logs = []; var voltage_1_logs = []; var voltage_2_logs = []; var voltage_3_logs = []; var current_1_logs = []; var current_2_logs = [];
  var current_3_logs = []; var d_maximum = 0; var h_maximum = 0; var day, yday = 0; var size; var counter = 0;
  document.getElementById('loaddata').innerHTML = "Datasets - loading...";
  var tabledata = []; formdvid = document.getElementById('formdvid').value;
  db.collection("devices").doc(formdvid).collection("logs").orderBy("timestamp", "asc").startAt(startdate).endAt(enddate).get().then(snapshot =>
  {
    size = snapshot.size; snapshot.forEach(doc =>
    {
      timestamp_original = doc.data().timestamp.toDate(); timestamp_hour = doc.data().timestamp.toDate().getHours(); timestamp_reformat = (doc.data().timestamp).toDate().getDate() + "-" + ((doc.data().timestamp).toDate().getMonth() + 1) + "-" + (doc.data().timestamp).toDate().getFullYear() + "  " + (doc.data().timestamp).toDate().getHours() + ":" + (doc.data().timestamp).toDate().getMinutes(); timestamp_shortdate = (doc.data().timestamp).toDate().getDate() + "-" + ((doc.data().timestamp).toDate().getMonth() + 1) + "-" + (doc.data().timestamp).toDate().getFullYear(); timestamp_firstday = doc.data().timestamp.toDate().setDate(1); day = doc.data().timestamp.toDate().getDate();

      hourlydata.push({ date: timestamp_original, value: doc.data().consumption }); if (h_maximum < doc.data().consumption) { h_maximum = doc.data().consumption; h_maximum_timestamp = day; h_maximum_hour = timestamp_hour }
      tabledata.push([timestamp_original, timestamp_reformat, doc.data().voltage_1 + (" V"), doc.data().voltage_2 + (" V"), doc.data().voltage_3 + (" V"), doc.data().current_1 + (" A"), doc.data().current_2 + (" A"), doc.data().current_3 + (" A"), doc.data().power_factor, doc.data().consumption]); date = new Date(doc.data().timestamp.toDate()); date.setDate(date.getDate() - 1); if (day != yday) {
        dailydata.push({ date: date, value: Math.round(dailyconsump) }); totaldays = totaldays + 1; yesterdayer = dailyconsump; if (d_maximum < dailyconsump) { d_maximum = dailyconsump }
        dailyconsump = 0
      } else {
        dailyconsump = doc.data().consumption + dailyconsump

      }
      yday = doc.data().timestamp.toDate().getDate(); radar.push({ date: timestamp_firstday, [timestamp_shortdate]: doc.data().consumption }); if (timestamp_reformat_logs.includes(timestamp_shortdate) == !1) { timestamp_reformat_logs.push(timestamp_shortdate) }
      if (timestamp_hour > 22 || timestamp_hour <= 5) { off = off + doc.data().consumption; off_logs.push(doc.data().consumption) } else if (timestamp_hour > 18 && timestamp_hour <= 22) { peak = peak + doc.data().consumption; peak_logs.push(doc.data().consumption) } else {
        day_time = day_time + doc.data().consumption;


        day_logs.push(doc.data().consumption)
      }
      monthly = monthly + doc.data().consumption; if (counter < 15) { counter++; voltage_1_logs.push(doc.data().voltage_1); voltage_2_logs.push(doc.data().voltage_2); voltage_3_logs.push(doc.data().voltage_3); current_1_logs.push(doc.data().current_1); current_2_logs.push(doc.data().current_2); current_3_logs.push(doc.data().current_3) }
      // Number.isNaN(doc.data().consumption)

    })
  }).then(function ()
  {

    if (size != 0) {

      var peakp = Math.round((peak / monthly) * 100); var offp = Math.round((off / monthly) * 100); var dayp = Math.round((day_time / monthly) * 100); var avr = Math.round(monthly / totaldays); var percen = Math.round((yesterdayer / avr) * 100); enddate.setDate(enddate.getDate() - 1); var numofdays = new Date(enddate.getFullYear(), enddate.getMonth(), 0).getDate(); document.getElementById('peak').innerHTML = "Peak Usage - " + Math.round(peak) + " kWh"; document.getElementById('off').innerHTML = "Off Peak Usage- " + Math.round(off) + " kWh"; document.getElementById('day').innerHTML = "Day Usage -" + Math.round(day_time) + " kWh"; document.getElementById('totalc').innerHTML = "Total Usage for the Period- " + Math.round(monthly) + " kWh"; if (refreshflag == !1) { document.getElementById('monthl').innerHTML = numberWithCommas(monthly); document.getElementById('todayer').innerHTML = numberWithCommas(dailyconsump); document.getElementById('yesterdayer').innerHTML = numberWithCommas(yesterdayer); document.getElementById('todper').innerHTML = percen; document.getElementById('avg').innerHTML = numberWithCommas(avr) + " kWh"; document.getElementById('change').innerHTML = -(avr - yesterdayer) + " kWh"; document.getElementById('daytime1').innerHTML = numberWithCommas(day_time); document.getElementById('offtime1').innerHTML = numberWithCommas(off); document.getElementById('peaktime1').innerHTML = numberWithCommas(peak); document.getElementById('Predicted').innerHTML = numberWithCommas(avr * numofdays); document.getElementById('DAverage').innerHTML = numberWithCommas(avr); document.getElementById('monthi2').innerHTML = monthNames[startdate.getMonth()]; document.getElementById('monthi').innerHTML = monthNames[startdate.getMonth()]; document.getElementById('montho').innerHTML = monthNames[startdate.getMonth()]; document.getElementById('peak_consi').innerHTML = h_maximum; document.getElementById('houro').innerHTML = ordinal_suffix_of(h_maximum_hour); document.getElementById('dateo').innerHTML = ordinal_suffix_of(h_maximum_timestamp); document.getElementById('iconz').innerHTML = trendicon(yesterdayer - avr); document.getElementById('trende').value = percen; refreshflag = !0 }
      if (timestamp_hour != 0) {
        while (timestamp_hour != 23) { timestamp_hour++; timestamp_original.setHours(timestamp_hour); hourlydata.push({ date: timestamp_original, value: 0 }) }
        dailydata.push({ date: now })
      }
      document.getElementById('loaddata').innerHTML = "Datasets - [" + startdate.getDate() + "-" + startdate.getMonth() + "-" + startdate.getFullYear() + "] to [" + enddate.getDate() + "-" + enddate.getMonth() + "-" + enddate.getFullYear() + "]";

      generatechart(hourlydata, dailydata, d_maximum + 1000).then(loadtable(tabledata).then(generatepiechart(Math.round(peakp), Math.round(offp), Math.round(dayp)).then(sparklineLogin(peak_logs, off_logs, day_logs, voltage_1_logs, voltage_2_logs, voltage_3_logs, current_1_logs, current_2_logs, current_3_logs).then())))

    } else {
      $.toast().reset('all'); $("body").removeAttr('class')
      $.toast({ heading: 'Insufficient data to generate this month insights.', text: 'Device had been offline for a while now.', position: 'bottom-right', loaderBg: '#878787', icon: 'warning', hideAfter: 3500, stack: 6 })
    }
    var test = new Date();
    test = test.getDate() - 1 + "-" + ((test.getMonth()) + 1) + "-" + test.getFullYear();
    var field = document.querySelector('#enDate1');
    field.value = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
      '-' + date.getDate().toString().padStart(2, 0);
    loadradar(test);
  }).catch(function (error)
  { badnews(error); })
}
function generatepiechart(peakp, offp, dayp)
{
  var option123 = {
    tooltip: { trigger: 'item', formatter: "{a} <br/>{b}", backgroundColor: 'rgba(33,33,33,1)', borderRadius: 0, padding: 10, textStyle: { color: '#fff', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, legend: { show: !1 }, toolbox: { show: !1, }, calculable: !0, itemStyle: { normal: { shadowBlur: 5, shadowColor: 'rgba(0, 0, 0, 0.5)' } }, series: [{ name: 'Consumption Breakdown', type: 'pie', radius: '80%', center: ['50%', '50%'], roseType: 'radius', color: ['#119dd2', '#d36ee8', '#667add'], label: { normal: { fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, data: [{ value: Number(peakp), name: 'Peak Hours : ' + Number(peakp) + " %" }, { value: Number(offp), name: 'Off Hours : ' + Number(offp) + " %" }, { value: Number(dayp), name: 'Day Hours : ' + Number(dayp) + " %" },].sort(function (a, b) { return a.value - b.value }), },], animationType: 'scale', animationEasing: 'elasticOut', animationDelay: function (idx)
    { return Math.random() * 1000 }
  }; var eChart_123 = echarts.init(document.getElementById('piecharter')); eChart_123.setOption(option123); return new Promise(function (resolve, reject)
  { if (!0) { resolve("Stuff worked!") } else { reject(Error("It broke")) } })
}
async function generateradar(radar, timestamp_reformat_logs)
{
  var chart = am4core.create("chartdiv-Radar", am4charts.RadarChart); var dateAxis = chart.xAxes.push(new am4charts.DateAxis()); dateAxis.baseInterval = { "timeUnit": "hour", "count": 1 }; document.getElementById('radartitle').innerHTML = "Peak Usage  kwh"; var categoryAxis = chart.xAxes.push(new am4charts.DateAxis()); var valueAxis = chart.yAxes.push(new am4charts.ValueAxis()); valueAxis.extraMin = 0.2; valueAxis.extraMax = 0.2; valueAxis.tooltip.disabled = !0; for (var i = 0, len = timestamp_reformat_logs.length; i < len; i++) { var series1 = chart.series.push(new am4charts.RadarSeries()); series1.dataFields.valueY = timestamp_reformat_logs[i]; series1.dataFields.dateX = "date"; series1.strokeWidth = 3; series1.tooltipText = "{valueY} kWh"; series1.name = timestamp_reformat_logs[i]; series1.bullets.create(am4charts.CircleBullet); series1.connect = !1 }
  chart.data = radar; chart.cursor = new am4charts.RadarCursor(); chart.legend = new am4charts.Legend()
}

function DateRange1()
{
  var test = Date.parse(document.getElementById('enDate1').value);
  test = new Date(test);
  test = test.getDate() + "-" + ((test.getMonth()) + 1) + "-" + test.getFullYear();

  loadradar(test);
}
function loadradar(test)
{
  console.log(test);
  var chart = am4core.create("chartdiv-Radar", am4charts.RadarChart);
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.baseInterval = { "timeUnit": "hour", "count": 1 };
  document.getElementById('totalc1').innerHTML = "Peak Usage  kwh";
  var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.extraMin = 0.2; valueAxis.extraMax = 0.2;
  valueAxis.tooltip.disabled = !0;

  var series1 = chart.series.push(new am4charts.RadarSeries());
  series1.dataFields.valueY = test; series1.dataFields.dateX = "date";
  series1.strokeWidth = 3;
  series1.tooltipText = "{valueY} kWh"; series1.name = test;
  series1.bullets.create(am4charts.CircleBullet); series1.connect = !1;
  chart.data = radar; chart.cursor = new am4charts.RadarCursor();
  chart.legend = new am4charts.Legend();
}

function cleandatasets()
{
  var totaldatasets = 0;
  var deleted = 0;
  var allcheck = 0;

  var device_id = document.getElementById('formdvid').value;
  db.collection("devices").doc(device_id).collection("logs")
    .get()
    .then(function (querySnapshot)
    {
      totaldatasets = querySnapshot.size;
      querySnapshot.forEach(function (doc)
      {
        if (doc.data().timestamp == null) {
          db.collection("devices").doc(device_id).collection("logs").doc(doc.id).delete();
          deleted++;
        }
        // doc.data() is never undefined for query doc snapshots
        allcheck++;
        if (allcheck == totaldatasets) {
          console.log("Checked : " + deleted + "/" + totaldatasets);
          goodnews("Cleaned : " + deleted + "/" + totaldatasets)
        }
      });
    })
    .catch(function (error)
    {
      console.log("Error getting documents: ", error);
    });

}

//.where("consumption", "<", 1).where("current_1", "<", 1).where("current_2", "<", 1).where("current_3", "<", 1).where("voltage_1", "<", 1).where("voltage_2", "<", 1).where("voltage_3", "<", 1).where("power_factor", "<", 1).where("reactive_power", "<", 1)

