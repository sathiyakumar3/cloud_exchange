var loaded = false;
loader();

var device_id = null;
var devicechart = [];
var state = !1;
var log_minimum_points = 1;
var total_used = 0;
var name = "loading...";
var version = 0;
var description = "loading...";
var last_updated = "loading...";
var timestamp = "loading...";
var delete_flag = !1;
var dataSet = [];
var dataSet2 = [];

var d_capacity = 0;
var d_chw_limit = 0;
var d_chw_flow = 0;
var d_chw_enter = 0;
var d_chw_leave = 0;
var d_chw_pressure_drop = 0;
var d_cond_pressure = 0;
var d_cop = 0;
var d_base = 0;
var d_control_setpoint = 0;
var d_cow_enter = 0;
var d_cow_leave = 0;
var d_evap_pressure = 0;
var d_expan_valve_posi = 0;
var d_num_of_compressors = 0;
var d_offset = 0;
var d_ref_kw = 0;
var d_refrig_liq_level = 0;
var d_setpoint = 0;
var d_total_input_power = 0;
var eChart_5 = echarts.init(document.getElementById('evap_gauge'));
var eChart_6 = echarts.init(document.getElementById('cond_gauge'));
var eChart_7 = echarts.init(document.getElementById('chwflow'));
var eChart_8 = echarts.init(document.getElementById('inp_pow'));
var eChart_9 = echarts.init(document.getElementById('chwpdp'));

var deltaposi = 0;
var x = document.getElementById("note1");
var s_date = new Date();
s_date.setDate(1), s_date.setHours(00);
var e_date = new Date();
e_date.setDate(e_date.getDate() + 1);
e_date.setHours(00);
var s_date_format, e_date_format;
var refreshflag = !1;



function gen_cust_gra2() {
    var values = $('#public-methods').val();
    var devicechart = [];
    document.getElementById('loaddata').innerHTML = "Datasets - loading...";
    var tabledata = [];
    formdvid = document.getElementById('formdvid').value;
    db.collection("devices").doc(formdvid).collection("logs").orderBy("timestamp").startAt(s_date).endAt(e_date).get().then(snapshot => {
            if (snapshot.size > 0) {
                goodnews((snapshot.size + " records found in the given range"));
            } else {
                badnews("No records found in the given range.");
            }
            snapshot.forEach(doc => {
                var capacity = doc.data().capacity;
                var chw_enter = doc.data().chw_enter;
                var chw_flow = doc.data().chw_flow;
                var chw_leave = doc.data().chw_leave;
                var chw_press_drop = doc.data().chw_press_drop;
                var cond_pressure = doc.data().cond_pressure;
                var control_setpoint = doc.data().control_setpoint;
                var cop = doc.data().cop;
                var cow_enter = doc.data().cow_enter;
                var cow_leave = doc.data().cow_leave;
                var evap_pressure = doc.data().evap_pressure;
                var expan_valve_posi = doc.data().expan_valve_posi;
                var num_of_compressors = doc.data().num_of_compressors;
                var offset = doc.data().offset;
                var ref_kw = doc.data().ref_kw;
                var refrig_liq_level = doc.data().refrig_liq_level;
                var setpoint = doc.data().setpoint;
                var total_input_power = doc.data().total_input_power;
                var totalcurrent = doc.data().totalcurrent;
                var timedate1_temp = doc.data().timestamp.toDate();
                tabledata.push(
                    [
                        timedate1_temp,
                        capacity + " %",
                        chw_enter + " °C",
                        chw_flow + " l/s",
                        chw_leave + " °C",
                        chw_press_drop + " kPa",
                        cond_pressure + " kPa",
                        control_setpoint + " °C",
                        cop,
                        cow_enter + " °C",
                        cow_leave + " °C",
                        evap_pressure + " kPa",
                        expan_valve_posi + " %",
                        num_of_compressors,
                        offset,
                        ref_kw + " kW",
                        refrig_liq_level + " %",
                        setpoint + " °C",
                        total_input_power + " kW"
                    ]);
                devicechart.push({
                    date: timedate1_temp,
                    cap: capacity,
                    CHWEnt: chw_enter,
                    ChwF: chw_flow,
                    Chwl: chw_leave,
                    Chwpd: chw_press_drop,
                    cs: control_setpoint,
                    cop: cop,
                    cow: cow_enter,
                    cowl: cow_leave,
                    ep: evap_pressure,
                    evp: expan_valve_posi,
                    nop: num_of_compressors,
                    ofs: offset,
                    refkw: ref_kw,
                    rll: refrig_liq_level,
                    stp: setpoint,
                    tip: total_input_power
                })
            })

        }).then(function() {
            document.getElementById('loaddata').innerHTML = "Datasets - [" + s_date_format + "] to [" + e_date_format + "]";
            multiplecharts(values, devicechart, !1);
            loadtable(tabledata)
        })
        .catch(function(error) {
            badnews(error);
        })
}


var qrcode = new QRCode(document.getElementById("qrcode"), { width: 100, height: 100, });

$(document).ready(function() {
    if ($('#pie_chart_4').length > 0) {
        $('#pie_chart_4').easyPieChart({
            barColor: 'rgba(17,157,210,1)',
            lineWidth: 20,
            animate: 3000,
            update: 21,
            size: 165,
            lineCap: 'square',
            trackColor: 'rgba(33,33,33,0.1)',
            scaleColor: !1,
            onStep: function(from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)) }
        })
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
            scaleColor: !1,
            onStep: function(from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)) }
        })
    }
    device_id = document.getElementById("idtest").value;
    domainer = document.getElementById("domainname").value;
    name = document.getElementById("devname").value;
    role = document.getElementById("role1").value;
    document.getElementById("dvicetypetest").innerHTML = name;
    document.getElementById("sitenavi").innerHTML = domainer;
    document.getElementById('dName').innerHTML = device_id;
    var load_indi = document.getElementById("li_" + device_id).innerHTML;
    load_indi = load_indi.replace('&nbsp;&nbsp;<i class="fas fa-spinner fa-spin"></i>', '');


    db.collection("devices").doc(device_id).get().then(doc => {
        name = doc.data().name;
        description = doc.data().description;
        type = doc.data().type;
        delete_flag = doc.data().delete_flag;
        domain = doc.data().domain;
        format = doc.data().format;
        publickey =
            doc.data().publickey;
        owner = doc.data().owner;
        version = doc.data().version;
        document.getElementById('lastlog1').innerHTML = description;
        document.getElementById('qrtext').value = doc.data().type + ".html" + "?id=" + device_id;
        blocked = doc.data().blocked;
        db.collection("devices").doc(device_id).collection('datasets').doc('config').get()
            .then(function(doc) {

                document.getElementById('total_logs').innerHTML = doc.data().log_minimum_points;
                document.getElementById('total_logs1').innerHTML = doc.data().log_minimum_points;
                document.getElementById('used_logs').innerHTML = doc.data().log_size;
                config_update((doc.data().log_interval) / 60, doc.data().log_minimum_points, doc.data().log_update, doc.data().alarm_update, doc.data().log_size, name, description, type, domain, device_id, format, publickey, owner)
            }).then(function() {

                db.collection("devices").doc(device_id).collection("datasets").doc("design").get().then(function(doc) {
                        d_capacity = doc.data().capacity;
                        //   d_chw_limit = doc.data().chw_limit;
                        d_chw_flow = doc.data().chw_flow;
                        d_chw_enter = doc.data().chw_enter;
                        d_chw_leave = doc.data().chw_leave;
                        d_chw_pressure_drop = doc.data().chw_press_drop;
                        d_cond_pressure = doc.data().cond_pressure;
                        d_cop = doc.data().cop;
                        d_base = doc.data().setpoint;
                        d_control_setpoint = doc.data().control_setpoint;
                        d_cow_enter = doc.data().cow_enter;
                        d_cow_leave = doc.data().cow_leave;
                        d_evap_pressure = doc.data().evap_pressure;
                        d_expan_valve_posi = doc.data().expan_valve_posi;
                        d_num_of_compressors = doc.data().num_of_compressors;
                        d_offset = doc.data().offset;
                        d_ref_kw = doc.data().ref_kw;
                        d_refrig_liq_level = doc.data().refrig_liq_level;
                        d_setpoint = doc.data().setpoint;
                        d_total_input_power = doc.data().total_input_power;


                        var dataset5 = [];
                        dataset5.push(["Capacity", "<input type='text' class=''  id='id_d_capacityr' value='" + d_capacity + "' name='range' height='2px' />"]);
                        //     dataset5.push(["Chiller Limit", "<input type='text' class=''  id='id_d_chw_limit' value='" + d_chw_limit + "' name='range' />"]);
                        dataset5.push(["CHW Flow", "<input type='text' class=''  id='id_d_chw_flow' value='" + d_chw_flow + "' name='range' />"]);
                        dataset5.push(["CHW Entering Temperature", "<input type='text' class=''  id='id_d_chw_enter' value='" + d_chw_enter + "' name='range' />"]);
                        dataset5.push(["CHW Leaving Temperature", "<input type='text' class=''  id='id_d_chw_leave' value='" + d_chw_leave + "' name='range' />"]);
                        dataset5.push(["CHW Pressure Drop", "<input type='text' class=''  id='id_d_chw_pressure_drop' value='" + d_chw_pressure_drop + "' name='range' />"]);
                        dataset5.push(["Cond Pressure", "<input type='text' class=''  id='id_d_cond_pressure' value='" + d_cond_pressure + "' name='range' />"]);
                        dataset5.push(["C.O.P", "<input type='text' class=''  id='id_d_cop' value='" + d_cop + "' name='range' />"]);

                        dataset5.push(["Base Setpoint", "<input type='text' class=''  id='id_d_base' value='" + d_base + "' name='range' height='2px' />"]);
                        dataset5.push(["Control Setpoint", "<input type='text' class=''  id='id_d_control_setpoint' value='" + d_control_setpoint + "' name='range' />"]);
                        dataset5.push(["COW Entering Temperature", "<input type='text' class=''  id='id_d_cow_enter' value='" + d_cow_enter + "' name='range' />"]);
                        dataset5.push(["COW Leaving Temperature", "<input type='text' class=''  id='id_d_cow_leave' value='" + d_cow_leave + "' name='range' />"]);
                        dataset5.push(["Evap Pressure", "<input type='text' class=''  id='id_d_evap_pressure' value='" + d_evap_pressure + "' name='range' />"]);
                        dataset5.push(["Expansion Valve Position", "<input type='text' class=''  id='id_d_expan_valve_posi' value='" + d_expan_valve_posi + "' name='range' />"]);
                        dataset5.push(["Num of Compressors", "<input type='text' class=''  id='id_d_num_of_compressors' value='" + d_num_of_compressors + "' name='range' />"]);

                        dataset5.push(["Setpoint Offset", "<input type='text' class=''  id='id_d_offset' value='" + d_offset + "' name='range' height='2px' />"]);
                        dataset5.push(["Refrigeration kW", "<input type='text' class=''  id='id_d_ref_kw' value='" + d_ref_kw + "' name='range' />"]);
                        dataset5.push(["Refrigerant Liquid Level", "<input type='text' class=''  id='id_d_refrig_liq_level' value='" + d_refrig_liq_level + "' name='range' />"]);
                        dataset5.push(["Setpoint", "<input type='text' class=''  id='id_d_setpoint' value='" + d_setpoint + "' name='range' />"]);
                        dataset5.push(["Input Power", "<input type='text' class=''  id='id_d_total_input_power' value='" + d_total_input_power + "' name='range' />"]);












                        load_design_slider(dataset5);


                    })
                    .then(function() {
                        var posi1 = 0;
                        var posi2 = 0;
                        var posi3 = 0;
                        var devicechart = [];
                        var tabledata = [];
                        db.collection("devices").doc(device_id).collection("logs").orderBy("timestamp", "desc").limit(20).get().then(snapshot => {
                                var addflag = false;
                                snapshot.forEach(doc => {
                                    if (addflag) {
                                        var capacity = doc.data().capacity;
                                        var chw_enter = doc.data().chw_enter;
                                        var chw_flow = doc.data().chw_flow;
                                        var chw_leave = doc.data().chw_leave;
                                        var chw_press_drop = doc.data().chw_press_drop;
                                        var cond_pressure = doc.data().cond_pressure;
                                        var control_setpoint = doc.data().control_setpoint;
                                        var cop = doc.data().cop;
                                        var cow_enter = doc.data().cow_enter;
                                        var cow_leave = doc.data().cow_leave;
                                        var evap_pressure = doc.data().evap_pressure;
                                        var expan_valve_posi = doc.data().expan_valve_posi;
                                        var num_of_compressors = doc.data().num_of_compressors;
                                        var offset = doc.data().offset;
                                        var ref_kw = doc.data().ref_kw;
                                        var refrig_liq_level = doc.data().refrig_liq_level;
                                        var setpoint = doc.data().setpoint;
                                        var total_input_power = doc.data().total_input_power;
                                        var totalcurrent = doc.data().totalcurrent;
                                        var timedate1_temp = doc.data().timestamp.toDate();
                                        tabledata.push(
                                            [
                                                timedate1_temp,
                                                capacity + " %",
                                                chw_enter + " °C",
                                                chw_flow + " l/s",
                                                chw_leave + " °C",
                                                chw_press_drop + " kPa",
                                                cond_pressure + " kPa",
                                                control_setpoint + " °C",
                                                cop,
                                                cow_enter + " °C",
                                                cow_leave + " °C",
                                                evap_pressure + " kPa",
                                                expan_valve_posi + " %",
                                                num_of_compressors,
                                                offset,
                                                ref_kw + " kW",
                                                refrig_liq_level + " %",
                                                setpoint + " °C",
                                                total_input_power + " kW"
                                            ]);
                                        devicechart.push({ date: timedate1_temp, cap: capacity, CHWEnt: chw_enter, ChwF: chw_flow, Chwl: chw_leave, Chwpd: chw_press_drop, cs: control_setpoint, cop: cop, cow: cow_enter, cowl: cow_leave, ep: evap_pressure, cp: cond_pressure, evp: expan_valve_posi, nop: num_of_compressors, ofs: offset, refkw: ref_kw, rll: refrig_liq_level, stp: setpoint, tip: total_input_power, tc: totalcurrent })

                                    }

                                    addflag = true;
                                })
                            }).then(function() {
                                $("#qrtext").on("keyup", function() { qrcode.makeCode($(this).val()) }).keyup().focus();
                                var now = new Date();
                                var day = ("0" + now.getDate()).slice(-2);
                                var month = ("0" + (now.getMonth() + 2)).slice(-2);
                                var month2 = ("0" + (now.getMonth() + 1)).slice(-2);
                                var today = now.getFullYear() + "-" + (month) + "-" + "01";
                                var yesterday = now.getFullYear() + "-" + (month2) + "-" + "01";
                                $('#stDate').val(yesterday);
                                $('#enDate').val(today);
                                document.getElementById('loaddata').innerHTML = "Datasets - Last 20 Records";
                                multiplecharts([], devicechart, !0);
                                loadtable(tabledata);
                                document.getElementById("li_" + device_id).innerHTML = load_indi;
                                unsubscribe = db.collection("devices").doc(device_id).collection("datasets").doc("live").onSnapshot(function(doc) {
                                    dataSet = [];
                                    document.getElementById('cop').innerHTML = doc.data().cop;
                                    document.getElementById('coppro').value = doc.data().cop;
                                    document.getElementById('inputpower').innerHTML = doc.data().total_input_power + " kW";
                                    document.getElementById('Ref').innerHTML = doc.data().ref_kw + " kW";
                                    document.getElementById('cclt').innerHTML = doc.data().cow_leave;
                                    document.getElementById('ccet').innerHTML = doc.data().cow_enter;
                                    document.getElementById('cwet').innerHTML = doc.data().chw_enter;
                                    document.getElementById('cwlt').innerHTML = doc.data().chw_leave;
                                    document.getElementById('controlsetpoint').innerHTML = doc.data().control_setpoint + " °C";
                                    document.getElementById('base').innerHTML = doc.data().setpoint + " °C";
                                    document.getElementById('offsett').innerHTML = doc.data().offset + " °C";
                                    document.getElementById('noc').innerHTML = doc.data().num_of_compressors;
                                    switch (version) {
                                        case 1:
                                            switch (doc.data().status_1) {
                                                case 1:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Establishing Modbus communications with compressor/s.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. Locally isolated using switch located on the chiller touch screen. Can only be switched at chiller. ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Free Cooling is enabled. Awaiting CHW flow.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and Free Cooling is active.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Awaiting low level BMS start signal on terminal (X2).";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Awaiting high level BMS start signal.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_1').innerHTML = "TESTINGTESTINTESTINGTESINTTESZINGTESING";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller internal PD transmitter measuring LOW chilled water flow.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller internal PD transmitter measuring HIGH chilled water flow.";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. No chilled water flow indication on terminal (X4). ";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. No condenser water flow indication on terminal (X6). ";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller was running and cycled off due to NO condenser water flow as determined by the software. Minimum Off Delay is active.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Ambient air temp. is below low limit.";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Remote condenser has a fault and is unavailable.";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has detected a drop in mains voltage. Awaiting return of mains voltage for compressor restart. ";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_1').innerHTML = " Chiller is operational and awaiting compressor/s to reset after a loss of power. ";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and awaiting compressor/s to reset after cycling off or faulting. ";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_1').innerHTML = " Chiller is RUNNING in automatic operation. ";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_1').innerHTML = "Chiller is RUNNING and chilled water flow indication has been lost momentarily. ";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF and chilled water flow indication has been lost momentarily. ";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_1').innerHTML = "Chiller is RUNNING and condenser water flow indication has been lost momentarily.";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF and condenser water flow indication has been lost momentarily.";
                                                    break;
                                                default:
                                                    document.getElementById('status_1').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_2) {
                                                case 0:
                                                    document.getElementById('status_2').innerHTML = "There is no active global fault.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_2').innerHTML = "Authorisation start code has not been input. Chiller will not start without the authorisation code. Contact “Smardt Chiller Group” to obtain the authorisation code. ";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant recovery is required and water flows are not detected, preventing refrigerant recovery from taking place.";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant recovery is active.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a High Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a Low Water Temp. fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a CHW Sensor fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had multiple No Condenser Water Flow faults and is locked out awaiting a manual reset.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have had a critical fault or excessive auto-reset faults and are locked out.";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have had a auto-reset fault and are resetting.";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have no Modbus communications to the controller.";
                                                    break;
                                                default:
                                                    document.getElementById('status_2').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_3) {
                                                case 0:
                                                    document.getElementById('status_3').innerHTML = "There is no active compressor staging or first ramp.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_3').innerHTML = "Unable to stage on a compressor due to a high compression ratio. Running compressor/s have cycled off and are resetting to allow multiple compressors to be staged on together.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_3').innerHTML = "Compressor is being staged on. ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_3').innerHTML = " Compressor is being staged on and running compressors are being ramped down to lower the compression ratio. ";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand is being smoothed back to PID. The stage delay is active preventing another compressor from staging on.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand is being smoothed back to PID.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand smoothing is complete. The stage delay is active preventing another compressor from staging on. ";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_3').innerHTML = "The chiller has just started and the first ramp is active. The stage delay is active preventing another compressor from staging on.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_3').innerHTML = "The chiller has just started and the first demand smoothing ramp is active.";
                                                    break;
                                                default:
                                                    document.getElementById('status_3').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_4) {
                                                case 0:
                                                    document.getElementById('status_4').innerHTML = "There is no active fault.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_4').innerHTML = "Chiller is OFF. Establishing Modbus communications with compressor/s.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_4').innerHTML = "Chiller is operational and has detected a drop in mains voltage. Awaiting mains voltage for compressor restart.  ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_4').innerHTML = "Refrigeration system 1 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 1 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a fault and is auto-resetting.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_4').innerHTML = " Compressor 1 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has no Modbus communications to the controller.";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a fault and is auto-resetting.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_4').innerHTML = " Compressor 2 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has no Modbus communications to the controller.";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a fault and is auto-resetting.";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_4').innerHTML = " Compressor 3 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has no Modbus communications to the controller.";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a fault and is auto-resetting.";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_4').innerHTML = " Compressor 4 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has no Modbus communications to the controller.";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a fault and is auto-resetting.";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_4').innerHTML = " Compressor 5 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 26:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has no Modbus communications to the controller.";
                                                    break;
                                                case 27:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 28:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a fault and is auto-resetting.";
                                                    break;
                                                case 29:
                                                    document.getElementById('status_4').innerHTML = " Compressor 6 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 30:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has no Modbus communications to the controller.";
                                                    break;
                                                case 31:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 32:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a fault and is auto-resetting.";
                                                    break;
                                                case 33:
                                                    document.getElementById('status_4').innerHTML = " Compressor 7 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 34:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 35:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 36:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and is auto-resetting.";
                                                    break;
                                                case 37:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 38:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 39:
                                                    document.getElementById('status_4').innerHTML = "System 1 has a low evaporator pressure and the EXV is being overridden to help raise the pressure.";
                                                    break;
                                                case 40:
                                                    document.getElementById('status_4').innerHTML = "The next start after a power failure will not be a fast start because at least one compressor will require a bearing calibration.  To reset the warning and guarantee a fast start after the next power failure, a bearing calibration must be performed on all compressors. ";
                                                    break;
                                                default:
                                                    document.getElementById('status_4').innerHTML = "Unkown Information."
                                            }


                                            break;
                                        case 2:
                                            switch (doc.data().status_1) {
                                                case 0:
                                                    document.getElementById('status_1').innerHTML = "c.pCO Initialising.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_1').innerHTML = "Establishing MB Comms.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_1').innerHTML = "Local Off.";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_1').innerHTML = "Remote Off ( X2 )";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_1').innerHTML = "Remote Off - HLI.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_1').innerHTML = "---";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_1').innerHTML = "Ambient Air Temp Lockout.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_1').innerHTML = "Internal ChW Flow Protection - Low Flow";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_1').innerHTML = "Internal ChW Flow Protection - High Flow";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_1').innerHTML = "External ChW Flow Switch Open ( X4 )";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_1').innerHTML = "Free Cooling Enabled - No ChW Flow ";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_1').innerHTML = "System On - Free Cooling Active";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_1').innerHTML = "Entering ChW Below Restart Temp.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_1').innerHTML = "External CoW Flow Switch Open ( X6 )";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_1').innerHTML = "No CoW Flow - Minimum Off Delay";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_1').innerHTML = "Remote Condenser Fault";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_1').innerHTML = "System On - Minimum Off Delay";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_1').innerHTML = "Mains Power Failure";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_1').innerHTML = "System On - Awaiting Comp Startup";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_1').innerHTML = "System On - Awaiting Comp Reset";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_1').innerHTML = "System On - Automatic Operation";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_1').innerHTML = "System On - Remote Start Override.";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_1').innerHTML = "System On - ChW Flow Switch Delay";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_1').innerHTML = "System On - CoW Flow Switch Delay";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_1').innerHTML = "ChW Flow Switch Delay";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_1').innerHTML = "CoW Flow Switch Delay";
                                                    break;
                                                default:
                                                    document.getElementById('status_1').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_2) {
                                                case 0:
                                                    document.getElementById('status_2').innerHTML = "There is no active global fault";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_2').innerHTML = "Authorisation Code Required";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant Recovery Active - No Flow.";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant Recovery Active";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_2').innerHTML = "Low Pressure Fault - Manual Reset";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_2').innerHTML = "High Pressure Fault - Manual Reset";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_2').innerHTML = "Low Water Temperature Fault - Manual Reset";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_2').innerHTML = "Temperature Sensor Fault - Manual Reset";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_2').innerHTML = "No Condenser Water Flow Lockout Fault.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_2').innerHTML = "All Compressors In Lockout Fault";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_2').innerHTML = "All Compressors In Fault - Resetting";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_2').innerHTML = "Compressor Reverse Rotation Lockout Fault";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_2').innerHTML = "Bad Modbus Comms";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_2').innerHTML = "No Compressors Available to Run";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_2').innerHTML = "Chilled Water Pump Fault";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_2').innerHTML = "Condensor Water Pump Fault";
                                                    break;
                                                default:
                                                    document.getElementById('status_2').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_3) {
                                                case 0:
                                                    document.getElementById('status_3').innerHTML = "There is no active compressor staging or first ramp.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_3').innerHTML = "Compressor Staging On";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_3').innerHTML = "Compressor Staging On - Assisting Start";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_3').innerHTML = "Demand Smoothing is Active";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_3').innerHTML = "Stage Delay";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_3').innerHTML = "Stage Delay - Demand Smoothing Is Active";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_3').innerHTML = "First Ramp is Active";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_3').innerHTML = "Stage Delay - First Ramp is Active";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_3').innerHTML = "Controlled Assist Shutdown (CAS) Active.";
                                                    break;
                                                default:
                                                    document.getElementById('status_3').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_4) {
                                                case 0:
                                                    document.getElementById('status_4').innerHTML = "There is no active fault.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_4').innerHTML = "Chiller is OFF. Establishing Modbus communications with compressor/s.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_4').innerHTML = "Chiller is operational and has detected a drop in mains voltage. Awaiting mains voltage for compressor restart.  ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_4').innerHTML = "Refrigeration system 1 has had a Low Pressure fault and awaiting a auto reset.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a Low Pressure fault and awaiting a auto reset.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_4').innerHTML = "Refrigeration system 1 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 1 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 1 has had a reverse rotation fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a reverse rotation fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a fault and is auto-resetting.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_4').innerHTML = " Compressor 1 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has no Modbus communications to the controller.";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a fault and is auto-resetting.";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_4').innerHTML = " Compressor 2 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has no Modbus communications to the controller.";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a fault and is auto-resetting.";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_4').innerHTML = " Compressor 3 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has no Modbus communications to the controller.";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a fault and is auto-resetting.";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_4').innerHTML = " Compressor 4 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 26:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has no Modbus communications to the controller.";
                                                    break;
                                                case 27:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 28:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a fault and is auto-resetting.";
                                                    break;
                                                case 29:
                                                    document.getElementById('status_4').innerHTML = " Compressor 5 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 30:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has no Modbus communications to the controller.";
                                                    break;
                                                case 31:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 32:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a fault and is auto-resetting.";
                                                    break;
                                                case 33:
                                                    document.getElementById('status_4').innerHTML = " Compressor 6 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 34:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has no Modbus communications to the controller.";
                                                    break;
                                                case 35:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 36:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a fault and is auto-resetting.";
                                                    break;
                                                case 37:
                                                    document.getElementById('status_4').innerHTML = " Compressor 7 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 38:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 39:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 40:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and is auto-resetting.";
                                                    break;
                                                case 41:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 42:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 43:
                                                    document.getElementById('status_4').innerHTML = "System 1 Condenser Fan Fault Or No Comms";
                                                    break;
                                                case 44:
                                                    document.getElementById('status_4').innerHTML = "System 2 Condenser Fan Fault Or No Comms";
                                                    break;
                                                case 45:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 1 Offline";
                                                    break;
                                                case 46:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 2 Offline";
                                                    break;
                                                case 47:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 3 Offline";
                                                    break;
                                                case 48:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 4 Offline";
                                                    break;
                                                case 49:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 5 Offline";
                                                    break;
                                                case 50:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 6 Offline";
                                                    break;
                                                case 51:
                                                    document.getElementById('status_4').innerHTML = "c.pCOe 7 Offline";
                                                    break;
                                                case 52:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 1 Fault Or No Comms";
                                                    break;
                                                case 53:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 2 Fault Or No Comms";
                                                    break;
                                                case 54:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 3 Fault Or No Comms";
                                                    break;
                                                case 55:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 4 Fault Or No Comms";
                                                    break;
                                                case 56:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 5 Fault Or No Comms";
                                                    break;
                                                case 57:
                                                    document.getElementById('status_4').innerHTML = "EVD Evolution Twin 6 Fault Or No Comms";
                                                    break;
                                                case 58:
                                                    document.getElementById('status_4').innerHTML = "System 1 Smardt Lift Fault";
                                                    break;
                                                case 59:
                                                    document.getElementById('status_4').innerHTML = "System 2 Smardt Lift Fault";
                                                    break;
                                                case 60:
                                                    document.getElementById('status_4').innerHTML = "Smardt Approach Fault Or No Comms";
                                                    break;
                                                case 61:
                                                    document.getElementById('status_4').innerHTML = "Smardt Approach Fault Or No Comms";
                                                    break;
                                                default:
                                                    document.getElementById('status_4').innerHTML = "Power Meter Offline"
                                            }

                                            break;
                                        default:
                                            switch (doc.data().status_1) {
                                                case 1:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Establishing Modbus communications with compressor/s.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. Locally isolated using switch located on the chiller touch screen. Can only be switched at chiller. ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Free Cooling is enabled. Awaiting CHW flow.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and Free Cooling is active.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Awaiting low level BMS start signal on terminal (X2).";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Awaiting high level BMS start signal.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_1').innerHTML = "TESTINGTESTINTESTINGTESINTTESZINGTESING";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller internal PD transmitter measuring LOW chilled water flow.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller internal PD transmitter measuring HIGH chilled water flow.";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. No chilled water flow indication on terminal (X4). ";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF. No condenser water flow indication on terminal (X6). ";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Chiller was running and cycled off due to NO condenser water flow as determined by the software. Minimum Off Delay is active.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Ambient air temp. is below low limit.";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF. Remote condenser has a fault and is unavailable.";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has detected a drop in mains voltage. Awaiting return of mains voltage for compressor restart. ";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_1').innerHTML = " Chiller is operational and awaiting compressor/s to reset after a loss of power. ";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and awaiting compressor/s to reset after cycling off or faulting. ";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_1').innerHTML = " Chiller is RUNNING in automatic operation. ";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_1').innerHTML = "Chiller is operational and has cycled OFF due to low chilled water load. Minimum off delay is active.";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_1').innerHTML = "Chiller is RUNNING and chilled water flow indication has been lost momentarily. ";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_1').innerHTML = " Chiller is OFF and chilled water flow indication has been lost momentarily. ";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_1').innerHTML = "Chiller is RUNNING and condenser water flow indication has been lost momentarily.";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_1').innerHTML = "Chiller is OFF and condenser water flow indication has been lost momentarily.";
                                                    break;
                                                default:
                                                    document.getElementById('status_1').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_2) {
                                                case 0:
                                                    document.getElementById('status_2').innerHTML = "There is no active global fault.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_2').innerHTML = "Authorisation start code has not been input. Chiller will not start without the authorisation code. Contact “Smardt Chiller Group” to obtain the authorisation code. ";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant recovery is required and water flows are not detected, preventing refrigerant recovery from taking place.";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_2').innerHTML = "Refrigerant recovery is active.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a High Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a Low Water Temp. fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had a CHW Sensor fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_2').innerHTML = "Chiller has had multiple No Condenser Water Flow faults and is locked out awaiting a manual reset.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have had a critical fault or excessive auto-reset faults and are locked out.";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have had a auto-reset fault and are resetting.";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_2').innerHTML = "All compressors on the chiller have no Modbus communications to the controller.";
                                                    break;
                                                default:
                                                    document.getElementById('status_2').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_3) {
                                                case 0:
                                                    document.getElementById('status_3').innerHTML = "There is no active compressor staging or first ramp.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_3').innerHTML = "Unable to stage on a compressor due to a high compression ratio. Running compressor/s have cycled off and are resetting to allow multiple compressors to be staged on together.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_3').innerHTML = "Compressor is being staged on. ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_3').innerHTML = " Compressor is being staged on and running compressors are being ramped down to lower the compression ratio. ";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand is being smoothed back to PID. The stage delay is active preventing another compressor from staging on.";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand is being smoothed back to PID.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_3').innerHTML = "Compressor has been staged on successfully and demand smoothing is complete. The stage delay is active preventing another compressor from staging on. ";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_3').innerHTML = "The chiller has just started and the first ramp is active. The stage delay is active preventing another compressor from staging on.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_3').innerHTML = "The chiller has just started and the first demand smoothing ramp is active.";
                                                    break;
                                                default:
                                                    document.getElementById('status_3').innerHTML = "Unkown Information."
                                            }
                                            switch (doc.data().status_4) {
                                                case 0:
                                                    document.getElementById('status_4').innerHTML = "There is no active fault.";
                                                    break;
                                                case 1:
                                                    document.getElementById('status_4').innerHTML = "Chiller is OFF. Establishing Modbus communications with compressor/s.";
                                                    break;
                                                case 2:
                                                    document.getElementById('status_4').innerHTML = "Chiller is operational and has detected a drop in mains voltage. Awaiting mains voltage for compressor restart.  ";
                                                    break;
                                                case 3:
                                                    document.getElementById('status_4').innerHTML = "Refrigeration system 1 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 4:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 1 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 5:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a Low Pressure fault and is locked out awaiting a manual reset.";
                                                    break;
                                                case 6:
                                                    document.getElementById('status_4').innerHTML = " Refrigeration system 2 has had a High Pressure fault and is locked out awaiting a manual reset. ";
                                                    break;
                                                case 7:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 8:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has had a fault and is auto-resetting.";
                                                    break;
                                                case 9:
                                                    document.getElementById('status_4').innerHTML = " Compressor 1 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 10:
                                                    document.getElementById('status_4').innerHTML = "Compressor 1 has no Modbus communications to the controller.";
                                                    break;
                                                case 11:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 12:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has had a fault and is auto-resetting.";
                                                    break;
                                                case 13:
                                                    document.getElementById('status_4').innerHTML = " Compressor 2 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 14:
                                                    document.getElementById('status_4').innerHTML = "Compressor 2 has no Modbus communications to the controller.";
                                                    break;
                                                case 15:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 16:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has had a fault and is auto-resetting.";
                                                    break;
                                                case 17:
                                                    document.getElementById('status_4').innerHTML = " Compressor 3 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 18:
                                                    document.getElementById('status_4').innerHTML = "Compressor 3 has no Modbus communications to the controller.";
                                                    break;
                                                case 19:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 20:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has had a fault and is auto-resetting.";
                                                    break;
                                                case 21:
                                                    document.getElementById('status_4').innerHTML = " Compressor 4 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 22:
                                                    document.getElementById('status_4').innerHTML = "Compressor 4 has no Modbus communications to the controller.";
                                                    break;
                                                case 23:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 24:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has had a fault and is auto-resetting.";
                                                    break;
                                                case 25:
                                                    document.getElementById('status_4').innerHTML = " Compressor 5 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 26:
                                                    document.getElementById('status_4').innerHTML = "Compressor 5 has no Modbus communications to the controller.";
                                                    break;
                                                case 27:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 28:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has had a fault and is auto-resetting.";
                                                    break;
                                                case 29:
                                                    document.getElementById('status_4').innerHTML = " Compressor 6 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 30:
                                                    document.getElementById('status_4').innerHTML = "Compressor 6 has no Modbus communications to the controller.";
                                                    break;
                                                case 31:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 32:
                                                    document.getElementById('status_4').innerHTML = "Compressor 7 has had a fault and is auto-resetting.";
                                                    break;
                                                case 33:
                                                    document.getElementById('status_4').innerHTML = " Compressor 7 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 34:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 35:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a critical fault or excessive auto-reset faults and is locked out.";
                                                    break;
                                                case 36:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and is auto-resetting.";
                                                    break;
                                                case 37:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has had a fault and the auto-resetting of the fault has failed.  ";
                                                    break;
                                                case 38:
                                                    document.getElementById('status_4').innerHTML = "Compressor 8 has no Modbus communications to the controller.";
                                                    break;
                                                case 39:
                                                    document.getElementById('status_4').innerHTML = "System 1 has a low evaporator pressure and the EXV is being overridden to help raise the pressure.";
                                                    break;
                                                case 40:
                                                    document.getElementById('status_4').innerHTML = "The next start after a power failure will not be a fast start because at least one compressor will require a bearing calibration.  To reset the warning and guarantee a fast start after the next power failure, a bearing calibration must be performed on all compressors. ";
                                                    break;
                                                default:
                                                    document.getElementById('status_4').innerHTML = "Unkown Information."
                                            }
                                    }

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
                                        document.getElementById("subcripText").innerHTML = name + " - " + "<i class='fas fa-sync fa-spin'></i>" + " <font color='Red'>[[STAND-BY]<]</font> &nbsp;&nbsp;&nbsp; |  &nbsp;&nbsp;&nbsp; " + domainer + "  &nbsp;&nbsp;&nbsp;"
                                    }
                                    $('#pie_chart_4').data('easyPieChart').update(doc.data().expan_valve_posi);
                                    $('#pie_chart_5').data('easyPieChart').update(doc.data().refrig_liq_level);
                                    $('#pie_chart_6').data('easyPieChart').update(doc.data().capacity);
                                    if (posi1 != doc.data().capacity) {
                                        if (posi1 < doc.data().capacity) { document.getElementById('cappos').innerHTML = "<i class=\"zmdi zmdi-caret-up pr-5 font-20\"></i><span class=\"weight-500\"> +" + (doc.data().capacity - posi1) + " %</span>" } else { document.getElementById('cappos').innerHTML = "<i class=\"zmdi zmdi-caret-down pr-5 font-20\"></i><span class=\"weight-500\">" + (doc.data().capacity - posi1) + " %</span>" }
                                        posi1 = doc.data().capacity
                                    }
                                    if (posi2 != doc.data().expan_valve_posi) {
                                        if (posi2 < doc.data().expan_valve_posi) { document.getElementById('expane').innerHTML = "<i class=\"zmdi zmdi-caret-up pr-5 font-20\"></i><span class=\"weight-500\"> +" + (doc.data().expan_valve_posi - posi2) + " %</span>" } else { document.getElementById('expane').innerHTML = "<i class=\"zmdi zmdi-caret-down pr-5 font-20\"></i><span class=\"weight-500\">" + (doc.data().expan_valve_posi - posi2) + " %</span>" }
                                        posi2 = doc.data().expan_valve_posi
                                    }
                                    if (posi3 != doc.data().refrig_liq_level) {
                                        if (posi3 < doc.data().refrig_liq_level) { document.getElementById('liqua').innerHTML = "<i class=\"zmdi zmdi-caret-up pr-5 font-20\"></i><span class=\"weight-500\"> +" + (doc.data().refrig_liq_level - posi3) + " %</span>" } else { document.getElementById('liqua').innerHTML = "<i class=\"zmdi zmdi-caret-down pr-5 font-20\"></i><span class=\"weight-500\">" + (doc.data().refrig_liq_level - posi3) + " %</span>" }
                                        posi3 = doc.data().refrig_liq_level
                                    }
                                    option5.series[0].data[0].value = doc.data().evap_pressure;
                                    option5.series[0].axisLine.lineStyle.color[0][0] = doc.data().evap_pressure / 1000;
                                    option5.series[0].axisLine.lineStyle.color[0][1] = detectionData(doc.data().evap_pressure);
                                    eChart_5.setOption(option5, !0);
                                    option6.series[0].data[0].value = doc.data().cond_pressure;
                                    option6.series[0].axisLine.lineStyle.color[0][0] = doc.data().cond_pressure / 1000;
                                    option6.series[0].axisLine.lineStyle.color[0][1] = detectionData(doc.data().cond_pressure);
                                    eChart_6.setOption(option6, !0);
                                    option7.series[0].data[0].value = doc.data().chw_flow;
                                    option7.series[0].axisLine.lineStyle.color[0][0] = doc.data().chw_flow / 200;
                                    option7.series[0].axisLine.lineStyle.color[0][1] = detectionData(doc.data().chw_flow);
                                    eChart_7.setOption(option7, !0);
                                    option8.series[0].data[0].value = doc.data().total_input_power;
                                    option8.series[0].axisLine.lineStyle.color[0][0] = doc.data().total_input_power / 360;
                                    option8.series[0].axisLine.lineStyle.color[0][1] = detectionData(doc.data().total_input_power);
                                    eChart_8.setOption(option8, !0);
                                    option9.series[0].data[0].value = doc.data().chw_press_drop;
                                    option9.series[0].axisLine.lineStyle.color[0][0] = doc.data().chw_press_drop / 200;
                                    option9.series[0].axisLine.lineStyle.color[0][1] = detectionData(doc.data().chw_press_drop);
                                    eChart_9.setOption(option9, !0);
                                    dataSet.push(["Capacity", d_capacity + ' %', doc.data().capacity + " %"]);
                                    dataSet.push(["CHW Flow", d_chw_flow + ' l/s', doc.data().chw_flow + " l/s"]);
                                    dataSet.push(["CHW Entering Temperature", d_chw_enter + ' °C', doc.data().chw_enter + " °C"]);
                                    dataSet.push(["CHW Leaving Temperature", d_chw_leave + ' °C', doc.data().chw_leave + " °C"]);
                                    dataSet.push(["CHW Pressure Drop", d_chw_pressure_drop + ' kPa', doc.data().chw_press_drop + ' kPa']);
                                    dataSet.push(["Condensor Pressure", d_cond_pressure + ' kPa', doc.data().cond_pressure + ' kPa']);
                                    dataSet.push(["C.O.P", d_cop, doc.data().cop]);
                                    dataSet.push(["Setpoint Base", d_base + ' °C', doc.data().setpoint + ' °C']);
                                    dataSet.push(["Control Setpoint", d_control_setpoint + ' °C', doc.data().control_setpoint + ' °C']);
                                    dataSet.push(["COW Entering Temperature", d_cow_enter + ' °C', doc.data().cow_enter + " °C"]);
                                    dataSet.push(["COW Leaving Temperature", d_cow_leave + ' °C', doc.data().cow_leave + " °C"]);
                                    dataSet.push(["Evaporator Pressure", d_evap_pressure + ' kPa', doc.data().evap_pressure + ' kPa']);
                                    dataSet.push(["Expansion Valve Position", d_expan_valve_posi + ' %', doc.data().expan_valve_posi + ' %']);
                                    dataSet.push(["Num of Compressors", d_num_of_compressors, doc.data().num_of_compressors]);
                                    dataSet.push(["Setpoint Offset", d_offset + ' %', doc.data().offset + " %"]);
                                    dataSet.push(["Refrigeration kW", d_ref_kw + " kW", doc.data().ref_kw + " kW"]);
                                    dataSet.push(["Refrigerant Liquid Level", d_refrig_liq_level + ' %', doc.data().refrig_liq_level + ' %']);
                                    dataSet.push(["Input Power", d_total_input_power + ' kW', doc.data().total_input_power + ' kW']);
                                    $(document).ready(function() { $('#edit_datable_2').DataTable({ data: dataSet, bDestroy: !0, columns: [{ title: "Parameters" }, { title: "Designed" }, { title: "Actual" }] }) })
                                })
                                loaded = true;
                            }).catch(function(error) {
                                badnews(error);
                            })
                            .catch(function(error) { badnews(error); })
                    })

            }).catch(function(error) { badnews(error); })
    }).catch(function(error) { badnews(error); })

});


function detectionData(str) {
    var color = '#119DD2';
    if (str >= 200 && str <= 300) { color = '#667ADD' } else if (str > 300) { color = '#D36EE8' }
    return color
}
var option5 = {
    "tooltip": { "align": "centre", "formatter": "Evaporator Presure Tips" },
    "series": [{
        "name": "Open",
        "type": "gauge",
        "splitNumber": 5,
        "min": 0,
        "max": 1000,
        "axisLine": {
            "lineStyle": {
                "color": [
                    [0.31, "#f4f4f4"],
                    [1, "#f4f4f4"]
                ],
                "width": 20
            }
        },
        "axisTick": { "show": !0 },
        "breakpoints": { "AbstractVector": [20, 80, 100] },
        "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        "splitLine": { "show": !0 },
        "itemStyle": { "normal": { "color": "#667add" } },
        "detail": { "formatter": "{value} kpa", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } },
        "title": { "offsetCenter": [0, "400%"] },
        "data": [{ "name": "", "value": 0 }]
    }]
}
var option9 = {
    "tooltip": { "align": "centre", "formatter": "Chilled Water Pressure Drop" },
    "series": [{
        "name": "Open",
        "type": "gauge",
        "splitNumber": 5,
        "min": 0,
        "max": 200,
        "axisLine": {
            "lineStyle": {
                "color": [
                    [0.31, "#f4f4f4"],
                    [1, "#f4f4f4"]
                ],
                "width": 20
            }
        },
        "axisTick": { "show": !0 },
        "breakpoints": { "AbstractVector": [20, 80, 100] },
        "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        "splitLine": { "show": !0 },
        "itemStyle": { "normal": { "color": "#667add" } },
        "detail": { "formatter": "{value} kpa", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } },
        "title": { "offsetCenter": [0, "400%"] },
        "data": [{ "name": "", "value": 0 }]
    }]
}
var option6 = {
    "tooltip": { "align": "right", "formatter": "Condensor PRessure Tips" },
    "series": [{
        "name": "Open",
        "type": "gauge",
        "splitNumber": 5,
        "min": 0,
        "max": 1000,
        "axisLine": {
            "lineStyle": {
                "color": [
                    [0.31, "#f4f4f4"],
                    [1, "#f4f4f4"]
                ],
                "width": 20
            }
        },
        "axisTick": { "show": !0 },
        "breakpoints": { "AbstractVector": [20, 80, 100] },
        "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        "splitLine": { "show": !0 },
        "itemStyle": { "normal": { "color": "#667add" } },
        "detail": { "formatter": "{value} kpa", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } },
        "title": { "offsetCenter": [0, "400%"] },
        "data": [{ "name": "", "value": 0 }]
    }]
}
var option7 = {
    "tooltip": { "align": "centre", "formatter": "The Chilled Water Flow of the Chiller." },
    "series": [{
        "name": "Open",
        "type": "gauge",
        "splitNumber": 5,
        "min": 0,
        "max": 200,
        "axisLine": {
            "lineStyle": {
                "color": [
                    [0.31, "#f4f4f4"],
                    [1, "#f4f4f4"]
                ],
                "width": 20
            }
        },
        "axisTick": { "show": !0 },
        "breakpoints": { "AbstractVector": [20, 80, 100] },
        "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        "splitLine": { "show": !0 },
        "itemStyle": { "normal": { "color": "#667add" } },
        "detail": { "formatter": "{value} l/s", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } },
        "title": { "offsetCenter": [0, "400%"] },
        "data": [{ "name": "", "value": 0 }]
    }]
}
var option8 = {
    "tooltip": { "align": "centre", "formatter": "Total Power Consumed by the Chiller" },
    "series": [{
        "name": "Open",
        "type": "gauge",
        "splitNumber": 5,
        "min": 0,
        "max": 360,
        "axisLine": {
            "lineStyle": {
                "color": [
                    [0.31, "#f4f4f4"],
                    [1, "#f4f4f4"]
                ],
                "width": 20
            }
        },
        "axisTick": { "show": !0 },
        "breakpoints": { "AbstractVector": [20, 80, 100] },
        "axisLabel": { "distance": -60, "textStyle": { color: '#878787', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        "splitLine": { "show": !0 },
        "itemStyle": { "normal": { "color": "#667add" } },
        "detail": { "formatter": "{value} kW", "offsetCenter": [0, "60%"], "textStyle": { "fontSize": 12, "color": "#878787" } },
        "title": { "offsetCenter": [0, "400%"] },
        "data": [{ "name": "", "value": 0 }]
    }]
}
var sparkResize;
$(window).on("resize", function() {
    clearTimeout(sparkResize);
    eChart_5.resize();
    eChart_6.resize();
    eChart_7.resize();
    eChart_8.resize();
    eChart_9.resize()
}).resize();
var sparklineLogin = function() {
    if ($('#voltage_1_sparklines').length > 0) { $("#voltage_1_sparklines").sparkline(voltage_1_logs, { type: 'line', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#667add', highlightSpotColor: '#667add' }) }
    if ($('#voltage_2_sparklines').length > 0) { $("#voltage_2_sparklines").sparkline(voltage_2_logs, { type: 'line', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#667add', highlightSpotColor: '#667add' }) }
    if ($('#voltage_3_sparklines').length > 0) { $("#voltage_3_sparklines").sparkline(voltage_3_logs, { type: 'line', width: '100%', height: '45', lineColor: '#ce6300', fillColor: '#ffa505', minSpotColor: '#667add', maxSpotColor: '#667add', spotColor: '#667add', highlightLineColor: 'rgba(0, 0, 0, 0.6)', highlightSpotColor: '#7f3f00' }) }
    if ($('#current_1_sparklines').length > 0) { $("#current_1_sparklines").sparkline(current_1_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
    if ($('#current_2_sparklines').length > 0) { $("#current_2_sparklines").sparkline(current_2_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
    if ($('#current_3_sparklines').length > 0) { $("#current_3_sparklines").sparkline(current_3_logs, { type: 'bar', width: '100%', height: '45', barWidth: '10', resize: !0, barSpacing: '10', barColor: '#ffa505', highlightSpotColor: '#667add' }) }
    if ($('#spark_2').length > 0) { $("#spark_2").sparkline(off_logs, { type: 'bar', width: '100%', height: '35', barWidth: '5', barSpacing: '5', barColor: '#667add', highlightSpotColor: '#667add' }) }
    if ($('#spark_3').length > 0) { $("#spark_3").sparkline(day_logs, { type: 'bar', width: '100%', height: '35', barWidth: '5', barSpacing: '5', barColor: '#667add', highlightSpotColor: '#667add' }) }
}

function multiplecharts(e, devicechart, t) {

    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv8", am4charts.XYChart);
    chart.colors.step = 2;
    chart.data = devicechart;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = { "timeUnit": "second", "count": 1 };
    dateAxis.tooltipDateFormat = "HH:mm, d MMMM";
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 25;
    var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis1.title = "Temperatures";
    function createAxisAndSeries(field, name, opposite, bullet, unit) {
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.strokeWidth = 2;

        series.name = name;
        series.tooltipText = "{name}: [bold]{valueY}[/] " + unit;
        series.tensionX = 0.8;

        var interfaceColors = new am4core.InterfaceColorSet();
        switch (bullet) {
            case "triangle":
                var bullet = series.bullets.push(new am4charts.Bullet());
                bullet.width = 12;
                bullet.height = 12;
                bullet.horizontalCenter = "middle";
                bullet.verticalCenter = "middle";
                var triangle = bullet.createChild(am4core.Triangle);
                series.yAxis = valueAxis1;
                valueAxis1.renderer.grid.template.disabled = !0;
                valueAxis1.renderer.line.strokeOpacity = 1;
                valueAxis1.renderer.line.strokeWidth = 2;
                valueAxis1.renderer.opposite = opposite;
                triangle.stroke = interfaceColors.getFor("background");
                triangle.strokeWidth = 2;
                triangle.direction = "top";
                triangle.width = 12;
                triangle.height = 12;
                break;
            case "rectangle":
                series.yAxis = valueAxis;
                valueAxis.renderer.grid.template.disabled = !0;
                valueAxis.renderer.line.strokeOpacity = 1;
                valueAxis.renderer.line.strokeWidth = 2;
                valueAxis.renderer.line.stroke = series.stroke;
                valueAxis.renderer.labels.template.fill = series.stroke;
                valueAxis.renderer.opposite = opposite;
                var bullet = series.bullets.push(new am4charts.Bullet());
                bullet.width = 10;
                bullet.height = 10;
                bullet.horizontalCenter = "middle";
                bullet.verticalCenter = "middle";
                var rectangle = bullet.createChild(am4core.Rectangle);
                rectangle.stroke = interfaceColors.getFor("background");
                rectangle.strokeWidth = 2;
                rectangle.width = 10;
                rectangle.height = 10;
                break;
            default:
                series.yAxis = valueAxis;
                valueAxis.renderer.grid.template.disabled = !0;
                valueAxis.renderer.line.strokeOpacity = 1;
                valueAxis.renderer.line.strokeWidth = 2;
                valueAxis.renderer.line.stroke = series.stroke;
                valueAxis.renderer.labels.template.fill = series.stroke;
                valueAxis.renderer.opposite = opposite;
                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.stroke = interfaceColors.getFor("background");
                bullet.circle.strokeWidth = 2;
                break
        }

    }



    if (e.includes("cop") || t) { createAxisAndSeries("cop", "COP", !0, "rectangle", "") }
    if (e.includes("chw_flow") || t) { createAxisAndSeries("ChwF", "CHW Flow", !1, "triangle", " l/s") }
    if (e.includes("chw_enter") || t) { createAxisAndSeries("CHWEnt", "CHW Entering Temperature", !1, "triangle", " °C") }
    if (e.includes("chw_leave") || t) { createAxisAndSeries("Chwl", "CHW Leave Temperature", !0, "rectangle", " °C") }
    if (e.includes("cow_enter") || t) { createAxisAndSeries("cow", "COW Entering Temperature", !1, "triangle", " °C") }
    if (e.includes("cow_leave") || t) { createAxisAndSeries("cowl", "COW Leaving Temperature", !1, "triangle", " °C") }
    if (e.includes("capacity") || t) { createAxisAndSeries("cap", "Capacity", !0, "rectangle", " %") }
    if (e.includes("chw_press_drop") || t) { createAxisAndSeries("Chwpd", "CHW Pressure Drop ", !0, "circle", "  kPa") }
    if (e.includes("control_setpoint") || t) { createAxisAndSeries("cs", "Control Setpoint", !0, "circle", " °C") }
    if (e.includes("offset") || t) { createAxisAndSeries("ofs", "Offset", !1, "triangle", "") }
    if (e.includes("setpoint") || t) { createAxisAndSeries("stp", "Setpoint", !1, "triangle", " °C") }
    if (e.includes("evap_pressure") || t) { createAxisAndSeries("ep", "Evaporator Pressure", !1, "triangle", "  kPa") }
    if (e.includes("expan_valve_posi") || t) { createAxisAndSeries("evp", " Expansion Valve Position", !1, "triangle", " %") }
    if (e.includes("cond_pressure") || t) { createAxisAndSeries("cp", "Condensor Pressure", !1, "triangle", " kPa") }
    if (e.includes("num_of_compressors") || t) { createAxisAndSeries("nop", "Number of Compressors", !1, "triangle", "") }
    if (e.includes("ref_kw") || t) { createAxisAndSeries("refkw", "Refrigeration kW", !1, "triangle", " kW") }
    if (e.includes("refrig_liq_level") || t) { createAxisAndSeries("rll", "Refrigeration Liquid Level", !1, "triangle", " %") }
    if (e.includes("total_input_power") || t) { createAxisAndSeries("tip", "Total Input Power", !1, "triangle", " kW") }
    if (e.includes("totalcurrent") || t) { createAxisAndSeries("tc", "Total Current", !1, "triangle", " Amps") }
    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
    chart.exporting.menu = new am4core.ExportMenu();

}

function loadtable(tabledata) {

    $('#dbtable002').DataTable({
        destroy: !0,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf'],
        data: tabledata,
        columns: [
            { title: "Date and Time" },
            { title: "Capacity" },
            { title: "CHW Entering Temperature" },
            { title: "CHW Flow" },
            { title: "chw Leave" },
            { title: "CHW Press Drop" },
            { title: "control setpoint" },
            { title: "cop" },
            { title: "cow" },
            { title: "cow leave" },
            { title: "evap pressure" },
            { title: "expan valve posi" },
            { title: "num of compressors" },
            { title: "offset" },
            { title: "ref kw" },
            { title: "refrig liq level" },
            { title: "setpoint" },
            { title: "total input power" },
            { title: "totalcurrent" }
        ]
    })

    tabledata = []
}




function generatepiechart(peakp, offp, dayp) {
    var option123 = {
        tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)", backgroundColor: 'rgba(33,33,33,1)', borderRadius: 0, padding: 10, textStyle: { color: '#fff', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
        legend: { show: !1 },
        toolbox: { show: !1, },
        calculable: !0,
        itemStyle: { normal: { shadowBlur: 5, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
        series: [{ name: 'Advertising', type: 'pie', radius: '80%', center: ['50%', '50%'], roseType: 'radius', color: ['#119dd2', '#d36ee8', '#667add'], label: { normal: { fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, data: [{ value: Number(peakp), name: 'Peak Usage (%)' }, { value: Number(offp), name: 'Off Usage (%)' }, { value: Number(dayp), name: 'Day Usage (%)' }, ].sort(function(a, b) { return a.value - b.value }), }, ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function(idx) { return Math.random() * 1000 }
    };
    var eChart_123 = echarts.init(document.getElementById('piecharter'));
    eChart_123.setOption(option123)
}

function generateradar(radar, timedate3_temp_logs) {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv-Radar", am4charts.RadarChart);
    chart.data = radar;
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = { "timeUnit": "hour", "count": 1 };
    document.getElementById('radartitle').innerHTML = "Peak Usage  kwh";
    var categoryAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.extraMin = 0.2;
    valueAxis.extraMax = 0.2;
    valueAxis.tooltip.disabled = !0;
    for (var i = 0, len = timedate3_temp_logs.length; i < len; i++) {
        var series1 = chart.series.push(new am4charts.RadarSeries());
        series1.dataFields.valueY = timedate3_temp_logs[i];
        series1.dataFields.dateX = "date";
        series1.strokeWidth = 3;
        series1.tooltipText = "{valueY} kWh";
        series1.name = timedate3_temp_logs[i];
        series1.bullets.create(am4charts.CircleBullet);
        series1.connect = !1
    }
    chart.cursor = new am4charts.RadarCursor();
    chart.legend = new am4charts.Legend();

}


function echartsConfig() {
    if ($('#e_chart_78').length > 0) {
        var eChart_1 = echarts.init(document.getElementById('e_chart_78'));
        var data = [
            [
                [48604, 77, 17096899, 'Australia', 1990],
                [21163, 77.4, 27662440, 'Canada', 1990],
                [1516, 68, 1154605773, 'China', 1990],
                [13670, 74.7, 10582082, 'Cuba', 1990],
                [28599, 75, 4986705, 'Finland', 1990],
                [29476, 77.1, 56943299, 'France', 1990],
                [31476, 75.4, 78958237, 'Germany', 1990],
                [28666, 78.1, 254830, 'Iceland', 1990],
                [1777, 57.7, 870601776, 'India', 1990],
                [29550, 79.1, 122249285, 'Japan', 1990],
                [2076, 67.9, 20194354, 'North Korea', 1990],
                [12087, 72, 42972254, 'South Korea', 1990],
                [24021, 75.4, 3397534, 'New Zealand', 1990],
                [43296, 76.8, 4240375, 'Norway', 1990],
                [10088, 70.8, 38195258, 'Poland', 1990],
                [19349, 69.6, 147568552, 'Russia', 1990],
                [10670, 67.3, 53994605, 'Turkey', 1990],
                [26424, 75.7, 57110117, 'United Kingdom', 1990],
                [37062, 75.4, 252847810, 'United States', 1990]
            ],
            [
                [14056, 81.8, 23968973, 'Australia', 2015],
                [53294, 81.7, 35939927, 'Canada', 2015],
                [13334, 76.9, 1376048943, 'China', 2015],
                [21291, 78.5, 11389562, 'Cuba', 2015],
                [38923, 80.8, 5503457, 'Finland', 2015],
                [37599, 81.9, 64395345, 'France', 2015],
                [44053, 81.1, 80688545, 'Germany', 2015],
                [42182, 82.8, 329425, 'Iceland', 2015],
                [5903, 66.8, 1311050527, 'India', 2015],
                [36162, 83.5, 126573481, 'Japan', 2015],
                [1390, 71.4, 25155317, 'North Korea', 2015],
                [34644, 80.7, 50293439, 'South Korea', 2015],
                [34186, 80.6, 4528526, 'New Zealand', 2015],
                [64304, 81.6, 5210967, 'Norway', 2015],
                [24787, 77.3, 38611794, 'Poland', 2015],
                [23038, 73.13, 143456918, 'Russia', 2015],
                [19360, 76.5, 78665830, 'Turkey', 2015],
                [38225, 81.4, 64715810, 'United Kingdom', 2015],
                [53354, 79.1, 321773631, 'United States', 2015]
            ]
        ];
        var option = {
            tooltip: { trigger: 'axis', backgroundColor: 'rgba(33,33,33,1)', borderRadius: 0, padding: 10, axisPointer: { type: 'cross', label: { backgroundColor: 'rgba(33,33,33,1)' } }, textStyle: { color: '#fff', fontStyle: 'normal', fontWeight: 'normal', fontFamily: "'Roboto', sans-serif", fontSize: 12 } },
            grid: { show: !1, top: 30, bottom: 10, containLabel: !0, },
            xAxis: { axisLine: { show: !1 }, axisLabel: { textStyle: { color: '#878787', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, splitLine: { show: !1 } },
            yAxis: { axisLine: { show: !1 }, axisLabel: { textStyle: { color: '#878787', fontFamily: "'Roboto', sans-serif", fontSize: 12 } }, splitLine: { show: !1 }, scale: !0 },
            series: [{
                    name: '1990',
                    data: data[0],
                    type: 'scatter',
                    symbolSize: function(data) { return Math.sqrt(data[2]) / 5e2 },
                    label: {
                        emphasis: {
                            show: !0,
                            formatter: function(param) { return param.data[3] },
                            position: 'top'
                        }
                    },
                    itemStyle: { normal: { shadowBlur: 5, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffsetY: 5, color: '#667add' } }
                }, {
                    name: '2015',
                    data: data[1],
                    type: 'scatter',
                    symbolSize: function(data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function(param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowOffsetY: 5,
                            color: '#667add',
                        }
                    }
                },
                {
                    name: 'line',
                    type: 'line',
                    lineStyle: {
                        normal: {
                            color: 'rgba(102,122,221, 0.1)',
                            type: 'dotted',
                            shadowBlur: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowOffsetY: 5,
                        }
                    },
                    smooth: true,
                    showSymbol: false,
                    data: data[0],
                    markPoint: {
                        itemStyle: {
                            normal: {
                                color: 'transparent'
                            }
                        }
                    }
                }
            ]
        };
        eChart_1.setOption(option);
        eChart_1.resize();
    }
}




$(document).ready(function() {
    if ($('#pie_chart_4').length > 0) {
        $('#pie_chart_4').easyPieChart({
            barColor: 'rgba(17,157,210,1)',
            lineWidth: 20,
            animate: 3000,
            update: 21,
            size: 165,
            lineCap: 'square',
            trackColor: 'rgba(33,33,33,0.1)',
            scaleColor: !1,
            onStep: function(from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)) }
        })
    }
    if ($('#pie_chart_6').length > 0) {
        $('#pie_chart_6').easyPieChart({
            barColor: 'rgba(17,157,210,1)',
            lineWidth: 20,
            animate: 3000,
            update: 21,
            size: 165,
            lineCap: 'square',
            trackColor: 'rgba(33,33,33,0.1)',
            scaleColor: !1,
            onStep: function(from, to, percent) { $(this.el).find('.percent').text(Math.round(percent)) }
        })
    }
});



sparklineLogin();
echartsConfig();

function load_design_slider(i) {
    $("#table24").DataTable({ destroy: !0, searching: !1, paging: !1, data: i, columns: [{ title: "Parameter" }, { title: "Designed For" }] }),
        $("#id_d_capacityr").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        //   $("#id_d_chw_limit").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_chw_flow").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_chw_enter").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_chw_leave").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_chw_pressure_drop").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_cond_pressure").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_cop").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_base").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),

        $("#id_d_control_setpoint").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_cow_enter").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_cow_leave").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_evap_pressure").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_expan_valve_posi").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_num_of_compressors").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_offset").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_ref_kw").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_refrig_liq_level").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_setpoint").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 }),
        $("#id_d_total_input_power").ionRangeSlider({ type: "single", min: 0, max: 100, grid: !0 })
}


function rangesave3() {
    device_id = document.getElementById("idtest").value,
        id_d_capacityr = document.getElementById("id_d_capacityr").value,
        id_d_chw_flow = document.getElementById("id_d_chw_flow").value,
        id_d_chw_enter = document.getElementById("id_d_chw_enter").value,
        id_d_chw_leave = document.getElementById("id_d_chw_leave").value,
        id_d_chw_pressure_drop = document.getElementById("id_d_chw_pressure_drop").value,
        id_d_cond_pressure = document.getElementById("id_d_cond_pressure").value,
        id_d_cop = document.getElementById("id_d_cop").value,
        id_d_base = document.getElementById("id_d_base").value,
        id_d_control_setpoint = document.getElementById("id_d_control_setpoint").value,
        id_d_cow_enter = document.getElementById("id_d_cow_enter").value,
        id_d_cow_leave = document.getElementById("id_d_cow_leave").value,
        id_d_evap_pressure = document.getElementById("id_d_evap_pressure").value,
        id_d_expan_valve_posi = document.getElementById("id_d_expan_valve_posi").value,
        id_d_num_of_compressors = document.getElementById("id_d_num_of_compressors").value,
        id_d_offset = document.getElementById("id_d_offset").value,
        id_d_ref_kw = document.getElementById("id_d_ref_kw").value,
        id_d_refrig_liq_level = document.getElementById("id_d_refrig_liq_level").value,
        id_d_setpoint = document.getElementById("id_d_setpoint").value,
        id_d_total_input_power = document.getElementById("id_d_total_input_power").value,


        db.collection("devices").doc(device_id).collection("datasets").doc("design").set({
            capacity: id_d_capacityr,
            chw_flow: id_d_chw_flow,
            chw_enter: id_d_chw_enter,
            chw_leave: id_d_chw_leave,
            chw_press_drop: id_d_chw_pressure_drop,
            cond_pressure: id_d_cond_pressure,
            cop: id_d_cop,
            setpoint: id_d_base,
            control_setpoint: id_d_control_setpoint,
            cow_enter: id_d_cow_enter,
            cow_leave: id_d_cow_leave,
            evap_pressure: id_d_evap_pressure,
            expan_valve_posi: id_d_expan_valve_posi,
            num_of_compressors: id_d_num_of_compressors,
            offset: id_d_offset,
            ref_kw: id_d_ref_kw,
            refrig_liq_level: id_d_refrig_liq_level,
            setpoint: id_d_setpoint,
            total_input_power: id_d_total_input_power,

        }, {
            merge: !0
        }).then(function() {

            e = [];


            e.push(["Capacity", id_d_capacityr + " %", d_capacity + " %"]);
            //     dataset5.push(["Chiller Limit", "<input type='text' class=''  id='id_d_chw_limit' value='" + d_chw_limit + "' name='range' />"]);
            e.push(["CHW Flow", id_d_chw_flow + " l/s", d_chw_flow + " l/s"]);
            e.push(["CHW Entering Temperature", id_d_chw_enter + " °C", d_chw_enter + " °C"]);
            e.push(["CHW Leaving Temperature", id_d_chw_leave + " °C", d_chw_leave + " °C"]);
            e.push(["CHW Pressure Drop", id_d_chw_pressure_drop + ' kPa', d_chw_pressure_drop + ' kPa']);
            e.push(["Condensor Pressure", id_d_cond_pressure + ' kPa', d_cond_pressure + ' kPa']);
            e.push(["C.O.P", id_d_cop, d_cop]);
            e.push(["Setpoint Base", id_d_base + ' °C', d_base + ' °C']);
            e.push(["Control Setpoint", id_d_control_setpoint + ' °C', d_control_setpoint + ' °C']);
            e.push(["COW Entering Temperature", id_d_cow_enter + " °C", d_cow_enter + " °C"]);
            e.push(["COW Leaving Temperature", id_d_cow_leave + " °C", d_cow_leave + " °C"]);
            e.push(["Evaporator Pressure", id_d_evap_pressure + ' kPa', d_evap_pressure + ' kPa']);
            e.push(["Expansion Valve Position", id_d_expan_valve_posi + ' %', d_expan_valve_posi + ' %']);
            e.push(["Num of Compressors", id_d_num_of_compressors, d_num_of_compressors]);
            e.push(["Setpoint Offset", id_d_offset, d_offset]);
            e.push(["Refrigeration kW", id_d_ref_kw + " kW", d_ref_kw + " kW"]);
            e.push(["Refrigerant Liquid Level", id_d_refrig_liq_level + " %", d_refrig_liq_level + " %"]);
            e.push(["Input Power", id_d_total_input_power + ' kW', d_total_input_power + ' kW']);



            $("#edit_datable_2").DataTable({
                data: e,
                bDestroy: !0,
                columns: [{
                    title: "Parameters"
                }, {
                    title: "Designed"
                }, {
                    title: "Actual"
                }]
            });

            swal("Sucessfully Saved.", {
                icon: "success"
            });

        }).catch(function(e) {
            swal({
                title: "Warning",
                text: "Error saving min range datasets " + e,
                icon: "warning",
                buttons: !0,
                dangerMode: !0
            })
        });
}



/* // Analytics JS section

am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("ChillerEfficency", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()


////////////////////////////////////////

am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("ChillerEfficency2", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()

//////////////////////////////////////

am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("ChillerEfficency3", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()

/////////////////////////////////////

am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  var chart = am4core.create("evapApproach", am4charts.PieChart3D);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  chart.data = [
    {
      country: "Lithuania",
      litres: 501.9
    },
    {
      country: "Czech Republic",
      litres: 301.9
    },
    {
      country: "Ireland",
      litres: 201.1
    },
    {
      country: "Germany",
      litres: 165.8
    },
    {
      country: "Australia",
      litres: 139.9
    },
    {
      country: "Austria",
      litres: 128.3
    }
  ];

  chart.innerRadius = am4core.percent(40);
  chart.depth = 120;

  // chart.legend = new am4charts.Legend();

  var series = chart.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "litres";
  series.dataFields.depthValue = "litres";
  series.dataFields.category = "country";
  series.slices.template.cornerRadius = 5;
  series.colors.step = 3;

}); // end am4core.ready()

//////////////////////////////////////////////
am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  var chart = am4core.create("evapApproach2", am4charts.PieChart3D);
  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

  chart.data = [
    {
      country: "Lithuania",
      litres: 501.9
    },
    {
      country: "Czech Republic",
      litres: 301.9
    },
    {
      country: "Ireland",
      litres: 201.1
    },
    {
      country: "Germany",
      litres: 165.8
    },
    {
      country: "Australia",
      litres: 139.9
    },
    {
      country: "Austria",
      litres: 128.3
    }
  ];

  chart.innerRadius = am4core.percent(40);
  chart.depth = 120;

  // chart.legend = new am4charts.Legend();

  var series = chart.series.push(new am4charts.PieSeries3D());
  series.dataFields.value = "litres";
  series.dataFields.depthValue = "litres";
  series.dataFields.category = "country";
  series.slices.template.cornerRadius = 5;
  series.colors.step = 3;

}); // end am4core.ready()
/////////////////////////////////////////////
var dataSet = [
  ["1", "Marketing Designer", "12:00:00 AM", "02:00:00 AM", "2"],
  ["1", "Marketing Designer", "12:00:00 AM", "02:00:00 AM", "2"],
  ["1", "Marketing Designer", "12:00:00 AM", "02:00:00 AM", "2"],
  ["1", "Marketing Designer", "12:00:00 AM", "02:00:00 AM", "2"]
];

$(document).ready(function () {
  $('#almTB').DataTable({
    data: dataSet,
    columns: [
      { title: "No" },
      { title: "Alarm" },
      { title: "Time ACT" },
      { title: "Time DA" },
      { title: "Propaty" }

    ]
  });
});

////////////////////////////////////////////
am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("CHWStemp", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()
////////////////////////////////////////////
am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("CHWRtemp", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()
////////////////////////////////////////////

am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("CDWStemp", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready()

/////////////////////////////////////////////////////////
am4core.ready(function () {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("COWRtemp", am4charts.XYChart);

  // Add data
  chart.data = [{
    "ax": 1,
    "ay": 0.5,
    "bx": 1,
    "by": 2.2
  }, {
    "ax": 2,
    "ay": 1.3,
    "bx": 2,
    "by": 4.9
  }, {
    "ax": 3,
    "ay": 2.3,
    "bx": 3,
    "by": 5.1
  }, {
    "ax": 4,
    "ay": 2.8,
    "bx": 4,
    "by": 5.3
  }, {
    "ax": 5,
    "ay": 3.5,
    "bx": 5,
    "by": 6.1
  }, {
    "ax": 6,
    "ay": 5.1,
    "bx": 6,
    "by": 8.3
  }, {
    "ax": 7,
    "ay": 6.7,
    "bx": 7,
    "by": 10.5
  }, {
    "ax": 8,
    "ay": 8,
    "bx": 8,
    "by": 12.3
  }, {
    "ax": 9,
    "ay": 8.9,
    "bx": 9,
    "by": 14.5
  }, {
    "ax": 10,
    "ay": 9.7,
    "bx": 10,
    "by": 15
  }, {
    "ax": 11,
    "ay": 10.4,
    "bx": 11,
    "by": 18.8
  }, {
    "ax": 12,
    "ay": 11.7,
    "bx": 12,
    "by": 19
  }];

  // Create axes
  var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
  valueAxisX.title.text = 'X Axis';
  valueAxisX.renderer.minGridDistance = 40;

  // Create value axis
  var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxisY.title.text = 'Y Axis';

  // Create series
  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.valueY = "ay";
  lineSeries.dataFields.valueX = "ax";
  lineSeries.strokeOpacity = 0;

  var lineSeries2 = chart.series.push(new am4charts.LineSeries());
  lineSeries2.dataFields.valueY = "by";
  lineSeries2.dataFields.valueX = "bx";
  lineSeries2.strokeOpacity = 0;

  // Add a bullet
  var bullet = lineSeries.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow = bullet.createChild(am4core.Triangle);
  arrow.horizontalCenter = "middle";
  arrow.verticalCenter = "middle";
  arrow.strokeWidth = 0;
  arrow.fill = chart.colors.getIndex(0);
  arrow.direction = "top";
  arrow.width = 12;
  arrow.height = 12;

  // Add a bullet
  var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());

  // Add a triangle to act as am arrow
  var arrow2 = bullet2.createChild(am4core.Triangle);
  arrow2.horizontalCenter = "middle";
  arrow2.verticalCenter = "middle";
  arrow2.rotation = 180;
  arrow2.strokeWidth = 0;
  arrow2.fill = chart.colors.getIndex(3);
  arrow2.direction = "top";
  arrow2.width = 12;
  arrow2.height = 12;

  //add the trendlines
  var trend = chart.series.push(new am4charts.LineSeries());
  trend.dataFields.valueY = "value2";
  trend.dataFields.valueX = "value";
  trend.strokeWidth = 2
  trend.stroke = chart.colors.getIndex(0);
  trend.strokeOpacity = 0.7;
  trend.data = [
    { "value": 1, "value2": 2 },
    { "value": 12, "value2": 11 }
  ];

  var trend2 = chart.series.push(new am4charts.LineSeries());
  trend2.dataFields.valueY = "value2";
  trend2.dataFields.valueX = "value";
  trend2.strokeWidth = 2
  trend2.stroke = chart.colors.getIndex(3);
  trend2.strokeOpacity = 0.7;
  trend2.data = [
    { "value": 1, "value2": 1 },
    { "value": 12, "value2": 19 }
  ];

  // //scrollbars
  // chart.scrollbarX = new am4core.Scrollbar();
  // chart.scrollbarY = new am4core.Scrollbar();

}); // end am4core.ready() */