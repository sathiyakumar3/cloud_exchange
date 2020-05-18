var device_id = null;
var devicechart = [];
var state = false;
var log_minimum_points = 1;
var total_used = 0;
var name = "loading...";
var description = "loading...";
var last_updated = "loading...";
var timestamp = "loading...";
var delete_flag = false;

var dataSet = [];
var dataSet2 = [];
var mindata;
var maxdata;
var alarmsload = true;
var alarmstableload = true;
var deltaposi;





// var eChart_7 = echarts.init(document.getElementById('apparent_power_chart'));
// var eChart_9 = echarts.init(document.getElementById('power_factor'));

var deltaposi = 0;
var x = document.getElementById("note1");
var s_date = new Date(); s_date.setDate(1), s_date.setHours(00);
var e_date = new Date(); e_date.setDate(e_date.getDate() + 1); e_date.setHours(00);
var s_date_format, e_date_format;
var refreshflag = false;
//*************SIGN OUT IF IDLE MORE THAN 5 MINUTES******************
setTimeout(function ()
{
  if (unsubscribe) {
    document.getElementById("subcripText").innerHTML = name + " -  <font color='Orange'>[Session Expired]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;";
    swal({
      title: "Stopping Live information.",
      text: "Please reopen the device page for live information.",
      timer: 10000,
      showConfirmButton: false
    });
    unsubscribe();
    unsubscribe = null;
  }
}, 300000);


//*************LOAD AVAILABLE DOMAINS & DEVICE TYPES******************
document.getElementById('changeDomain3').innerHTML = document.getElementById('changeDomain2').innerHTML
document.getElementById('formdvtype').innerHTML = document.getElementById('dType').innerHTML

var qrcode = new QRCode(document.getElementById("qrcode"), {
  width: 100,
  height: 100,

});

  device_id = document.getElementById("idtest").value;
  domainer = document.getElementById("domainname").value;
  name = document.getElementById("devname").value;
  role = document.getElementById("role1").value;

  //console.log(device_id);
  document.getElementById("dvicetypetest").innerHTML = name;
  document.getElementById("sitenavi").innerHTML = domainer;
  document.getElementById('dName').innerHTML = device_id;


  //**************3. DEVICE STATIC INFORMATION ********************
  db.collection("devices").doc(device_id)
    .get().then(doc =>
    {
      name = doc.data().name;
      description = doc.data().description;
      type = doc.data().type;
      delete_flag = doc.data().delete_flag;
      log_minimum_points = doc.data().log_minimum_points;

      // document.getElementById("subcripText").innerHTML =name + " - "+"<i class='fa fa-spin  fa-refresh'></i>"+" <font color='Lime'>[LIVE]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; "+domainer+"  &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;"+role;
      document.getElementById('lastlog1').innerHTML = description;
      document.getElementById('total_logs').innerHTML = log_minimum_points;
      document.getElementById('total_logs1').innerHTML = log_minimum_points;

      document.getElementById('used_logs').innerHTML = doc.data().log_size;
      document.getElementById('formdName').value = doc.data().name;
      document.getElementById('formdvid').value = device_id;
      document.getElementById('formdvtype').value = doc.data().type;
      document.getElementById('formdvOwner').value = doc.data().owner;
      document.getElementById('formdescription').value = doc.data().description;



      document.getElementById('qrtext').value = doc.data().type + ".html" + "?id=" + device_id;


    }).then(function ()
    {
      //************5. QR CODE **************
      $("#qrtext").on("keyup", function ()
      {


        qrcode.makeCode($(this).val());
      }).keyup().focus();
      var now = new Date();

      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 2)).slice(-2);
      var month2 = ("0" + (now.getMonth() + 1)).slice(-2);
      var today = now.getFullYear() + "-" + (month) + "-" + "01";
      var yesterday = now.getFullYear() + "-" + (month2) + "-" + "01";
      $('#stDate').val(yesterday);
      $('#enDate').val(today);
      //  console.log(yesterday);
      //  console.log(today);
      getdatefortrends();

    })



// *************************************************
    db.collection("devices").doc(device_id).collection("datasets").doc("live")
         .onSnapshot(function (doc){

          supply_CHW = doc.data().supply_CHW_temperature;
          supply_air = doc.data().supply_air_temperature;
          return_CHW = doc.data().return_CHW_temperature;
          return_air = doc.data().return_air_temperature;
          vl_l_change = doc.data().timestamp;
          z_co2_level = doc.data().zone_co2_level;
          z_air_temp = doc.data().zone_air_temperature;
          air_flow_st = doc.data().air_flow_status;
          auto_m_s = doc.data().auto_manual_status;



            $('#pie_chart_4').data('easyPieChart').update(doc.data().valve_control);
            $('#pie_chart_5').data('easyPieChart').update(doc.data().valve_feedback);



          document.getElementById('supply_CHW_num').innerHTML = supply_CHW + " °C";
          document.getElementById('supply_air_num').innerHTML = supply_air + " °C";
          document.getElementById('return_CHW_num').innerHTML = return_CHW + " °C";
          document.getElementById('return_air_num').innerHTML = return_air + " °C";
          document.getElementById('Valve_Control_last_change').innerHTML = vl_l_change;
          document.getElementById('Zone_air_tem').innerHTML = z_air_temp +" °C";
          document.getElementById('afs').innerHTML= air_flow_st;
          document.getElementById('ams').innerHTML = auto_m_s;


        })


        //Sparklines setup
      var sparklineLogin = function(supply_CHW, supply_air) {


        if( $('#sparkline_1').length > 0 ){
		$("#sparkline_1").sparkline([supply_CHW, supply_air], {
			type: 'bar',
			width: '100%',
			height: '35',
			barWidth: '5',
			barSpacing: '5',
			barColor: '#667add',
			highlightSpotColor: '#667add'
		});
	}
          }


//*******************************

$(document).ready(function ()
{

    if ($('#pie_chart_4').length > 0) {
      $('#pie_chart_4').easyPieChart({
        barColor: 'rgba(17,157,210,1)',
        lineWidth: 20,
        animate: 3000,
        update: 21,
        size: 165,
        lineCap: 'square',
        trackColor: 'rgba(33,33,33,0.1)',
        scaleColor: false,
        onStep: function (from, to, percent)
        {
          $(this.el).find('.percent').text(Math.round(percent));
        }
      });
    }

    if ($('#pie_chart_5').length > 0) {
      $('#pie_chart_5').easyPieChart({
        barColor: 'rgba(17,157,210,1)',
        lineWidth: 20,
        animate: 3000,
        update: 21,
        size: 165,
        lineCap: 'square',
        trackColor: 'rgba(33,33,33,0.1)',
        scaleColor: false,
        onStep: function (from, to, percent)
        {
          $(this.el).find('.percent').text(Math.round(percent));
        }
      });
    }


})

//************************

var echartsConfig = function() {

  if( $('#e_chart_4').length > 0 ){
		var eChart_4 = echarts.init(document.getElementById('e_chart_4'));
		function detectionData(str) {
		var color = '#667add';
		if (str >= 30 && str <= 60) {
			color = '#d36ee8';
		} else if (str > 60) {
			color = '#119dd2';
		}
		return color;
		}
		var option4 = {
			"tooltip": {
				"formatter": "{a} <br/>{b} : {c}%"
			},
			"series": [{
				"name": "traffic",
				"type": "gauge",
				"splitNumber": 5,
				"axisLine": {
					"lineStyle": {
						"color": [
							[0.31, "#f4f4f4"],
							[1, "#f4f4f4"]
						],
						"width": 20
					}
				},
				"axisTick": {
					"show": false
				},
				"axisLabel": {
					"distance": -80,
					"textStyle": {
						color: '#878787',
						fontStyle: 'normal',
						fontWeight: 'normal',
						fontFamily: "'Roboto', sans-serif",
						fontSize: 12
					}
				},
				"splitLine": {
					"show": false
				},
				"itemStyle": {
					"normal": {
						"color": "#667add"
					}
				},
				"detail": {
					"formatter": "{value}",
					"offsetCenter": [0, "60%"],
					"textStyle": {
						"fontSize": 12,
						"color": "#878787"
					}
				},
				"title": {
					"offsetCenter": [0, "1000"]
				},
				"data": [{
					"name": "",
					"value": 31

				}]
			}]
		}
		var app = [];
		app.timeTicket = setInterval(function() {
			var value = (z_co2_level).toFixed(2) - 0;
			option4.series[0].data[0].value = value;
			option4.series[0].axisLine.lineStyle.color[0][0] = value / 100;
			option4.series[0].axisLine.lineStyle.color[0][1] = detectionData(value);
			eChart_4.setOption(option4, true);
		}, 500);

		eChart_4.setOption(option4);
		eChart_4.resize();
	}



  if( $('#e_chart_6').length > 0 ){
    var eChart_6 = echarts.init(document.getElementById('e_chart_6'));
    function detectionData(str) {
    var color = '#667add';
    if (str >= 30 && str <= 60) {
      color = '#d36ee8';
    } else if (str > 60) {
      color = '#119dd2';
    }
    return color;
    }
    var option4 = {
      "tooltip": {
        "formatter": "{a} <br/>{b} : {c}%"
      },
      "series": [{
        "name": "traffic",
        "type": "gauge",
        "splitNumber": 5,
        "axisLine": {
          "lineStyle": {
            "color": [
              [0.31, "#f4f4f4"],
              [1, "#f4f4f4"]
            ],
            "width": 20
          }
        },
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "distance": -80,
          "textStyle": {
            color: '#878787',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: "'Roboto', sans-serif",
            fontSize: 12
          }
        },
        "splitLine": {
          "show": false
        },
        "itemStyle": {
          "normal": {
            "color": "#667add"
          }
        },
        "detail": {
          "formatter": "{value}",
          "offsetCenter": [0, "60%"],
          "textStyle": {
            "fontSize": 12,
            "color": "#878787"
          }
        },
        "title": {
          "offsetCenter": [0, "1000"]
        },
        "data": [{
          "name": "",
          "value": 31

        }]
      }]
    }
    var app = [];
    app.timeTicket = setInterval(function() {
      var value = (z_co2_level).toFixed(2) - 0;
      option4.series[0].data[0].value = value;
      option4.series[0].axisLine.lineStyle.color[0][0] = value / 100;
      option4.series[0].axisLine.lineStyle.color[0][1] = detectionData(value);
      eChart_6.setOption(option4, true);
    }, 500);

    eChart_6.setOption(option4);
    eChart_6.resize();
  }

}



          /*****Sparkline function end*****/

          /*****Resize function start*****/
          var sparkResize,echartResize;
          $(window).on("resize", function () {
          	/*Sparkline Resize*/
          	clearTimeout(sparkResize);
          	sparkResize = setTimeout(sparklineLogin, 200);

          	/*E-Chart Resize*/
          	clearTimeout(echartResize);
          	echartResize = setTimeout(echartsConfig, 200);
          }).resize();
          /*****Resize function end*****/

          /*****Function Call start*****/
          sparklineLogin();
          echartsConfig();
