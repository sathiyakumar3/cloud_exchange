const functions = require('firebase-functions');
const admin = require("firebase-admin");
const iot = require('@google-cloud/iot');
const roundTo = require('round-to');
const settings = { /* your settings... */
  timestampsInSnapshots: true
};
admin.initializeApp();
admin.firestore().settings(settings);
const cloudRegion = "asia-east1";
const projectId = "poised-charger-184507-910c4";

exports.updatedevices = functions.firestore
  .document('devices/{device_id}')
  .onUpdate((change, context) =>
  {

    const newValue = change.after.data().blocked;
    const previousValue = change.before.data().blocked;
    if (newValue != previousValue) {
      var device_id = context.params.device_id;
      var registryId = change.after.data().domain || "";
      if (registryId == "") {
        registryId = "devices_hub"
      }
      const iotClient = new iot.v1.DeviceManagerClient({
        // optional auth parameters.
      });
      const devPath = iotClient.devicePath(
        projectId,
        cloudRegion,
        registryId,
        device_id
      );

      format = change.after.data().format;
      pk = change.after.data().publickey;
      const device = {
        name: devPath,
        credentials: [
          {
            publicKey: {
              "format": format,
              "key": pk
            },
          },
        ],
        blocked: change.after.data().blocked
      };
      try {
        const responses = iotClient.updateDevice({
          device: device,
          updateMask: { paths: ['blocked'] },
        });
        console.log('Patched device:', device_id);
      } catch (err) {
        console.error('Error patching device:', device_id, err);
      }
    }
  });


exports.createdevices = functions.firestore.document('devices/{device_id}').onCreate((snap, context) =>
{
  var name = context.params.device_id;
  var registryId = snap.data().domain;
  if (registryId == "") {
    registryId = "devices_hub";
  }
  var client = new iot.v1.DeviceManagerClient({});
  var formattedParent = client.registryPath(projectId, cloudRegion, registryId);
  var pk = snap.data().publickey;
  var format = snap.data().format;
  var request = {
    parent: formattedParent,
    device: {
      "id": name,
      credentials: [{ //"ES256_PEM"
        publicKey: {
          "format": format,
          "key": pk
        }
      }]
    },
  };
  var promise1 = new Promise(function (resolve, reject)
  {
    client.createDevice(request).then(responses =>
    {
      var response = responses[0];
      console.log("Created Device : " + name);
      resolve("success");
    }).catch(err =>
    {
      resolve(err);
      console.log("Failed to Create Device : " + name);
      // console.error(err);
    });
  });
  return promise1.then(function (value)
  {
    console.log(value);
    admin.firestore().collection('devices').doc(name).update({
      'cloud_status': value.toString()
    }).catch(function (error)
    {
      console.log("Error getting document:", error);
    });
  });
});
exports.deletedevices = functions.firestore.document('devices/{device_id}').onDelete((snap, context) =>
{
  var name = context.params.device_id;
  var registryId = snap.data().domain || "";
  if (registryId == "") {
    registryId = "devices_hub"
  }
  var client = new iot.v1.DeviceManagerClient({});
  var formattedName = client.devicePath(projectId, cloudRegion, registryId, name);
  client.deleteDevice({
    name: formattedName
  }).then(responses =>
  {
    var response = responses[0];
    console.log("Deleted Device : " + name);
  }).catch(err =>
  {
    console.log("Failed to Delete Device : " + name);
    console.error(err);
  });
});
exports.createregistry = functions.firestore.document('domains/{domain_id}').onCreate((snap, context) =>
{
  var id = context.params.domain_id;
  var name = snap.data().name;
  var client = new iot.v1.DeviceManagerClient({});
  var formattedParent = client.locationPath(projectId, cloudRegion);
  var deviceRegistry = {
    "id": id,
    "eventNotificationConfigs": [{
      "pubsubTopicName": "projects/poised-charger-184507-910c4/topics/hub-events",
      "subfolderMatches": ""
    }],
    "stateNotificationConfig": {
      "pubsubTopicName": "projects/poised-charger-184507-910c4/topics/hub-states"
    }
  };
  var request = {
    parent: formattedParent,
    deviceRegistry: deviceRegistry,
  };
  var promise1 = new Promise(function (resolve, reject)
  {
    client.createDeviceRegistry(request).then(responses =>
    {
      var response = responses[0];
      console.log("Created Registry : " + id);
      resolve("success");
    }).catch(err =>
    {
      console.error(err);
      console.log("Failed to created Registry : " + id);
      resolve(err);
    });
  });
  return promise1.then(function (value)
  {
    console.log(value);
    admin.firestore().collection('domains').doc(id).update({
      'cloud_status': value.toString()
    }).catch(function (error)
    {
      console.log("Error getting document:", error);
    });
  });
});

exports.sync_live = functions.pubsub.topic('hub-events').onPublish((message) =>
{
  var config_flag = false;
  var device_id = message.attributes.deviceId;
  var oldtimestamp;
  var newtimestamp;
  var difference = 0;
  var last_recorded_log = "";
  var newtimestamp2;
  var difference2 = 0;
  var last_recorded_log = "";
  // console.log("[" + device_id + "] - " + message.data ? Buffer.from(message.data, 'base64').toString() : null);
  var max = [];
  var min = [];
  var live = [];
  var live_processed = 0;
  var log_minimum_points = 0;
  var log_size = 0;
  var log_interval = 0;
  var raw_update = false;
  var live_update = false;
  var log_update = false;
  var alarm_update = false;;
  var live_timestamp = new Date();
  var blocked = false;

  admin.firestore().collection('devices').doc(device_id).collection('datasets').doc('config').get()
    .then(function (config)
    {
      max = config.data().max;
      min = config.data().min;
      log_minimum_points = config.data().log_minimum_points;
      log_size = config.data().log_size;
      log_interval = config.data().log_interval;
      raw_update = config.data().raw_update;
      live_update = config.data().live_update;
      log_update = config.data().log_update;
      alarm_update = config.data().alarm_update;;
      live_timestamp = config.data().live_timestamp;
      live = config.data().live;
      blocked = config.data().blocked;

      Object.keys(live).forEach((name) =>
      {
        live_processed++;
        live[name] = roundTo(Number(message.json[name]), 2);
        if ((Object.keys(live).length == live_processed)) {
          live["timestamp"] = admin.firestore.FieldValue.serverTimestamp();

          var raw_promise = new Promise(function (resolve, reject)
          {
            //RAW UPDATE
            if (raw_update) {
              config_flag = true;

              raw_update = false;
              var rawdata = { message: message.json };
              rawdata["timestamp"] = admin.firestore.FieldValue.serverTimestamp();
              admin.firestore().collection('devices').doc(device_id).collection('datasets').doc('raw').set(rawdata, { merge: true })
                .then(function ()
                {
                  resolve("[RAW : UPDATED]");
                }).catch(function (error)
                {
                  console.log("Transaction failed: ", error);
                  resolve("[RAW : " + error + "]");
                });

            } else {
              resolve("[RAW : SKIPPING]");
            }
          });

          var live_promise = new Promise(function (resolve, reject)
          {
            //LIVE UPDATE
            if (live_update) {
              newtimestamp2 = Date.now();
              difference2 = ((newtimestamp2 - live_timestamp.toMillis()) / 1000) || 0;
              if (difference2 > 600) {
                config_flag = true;
                live_update = false;
              }
              admin.firestore().collection('devices').doc(device_id).collection('datasets').doc('live').set(live, { merge: true }).then(function ()
              {
                resolve("[LIV : UPDATED]");
              }).catch(function (error)
              {
                resolve("[LIV : " + error + "]");
              });
            } else {
              resolve("[LIV : SKIPPING]");
            }
          });

          var log_promise = new Promise(function (resolve, reject)
          {
            //LOG UPDATE
            if (log_update) {
              admin.firestore().collection('devices').doc(device_id).collection('logs').orderBy("timestamp", "desc").limit(1).get().then(snapshot =>
              {
                snapshot.forEach(doc =>
                {
                  oldtimestamp = doc.data().timestamp;
                  newtimestamp = Date.now();
                  difference = ((newtimestamp - oldtimestamp.toMillis()) / 1000) || 0;
                  last_recorded_log = doc.id;
                  // console.log("Old TSP " + oldtimestamp.toMillis() + "| New  TSP" + newtimestamp + "  Diff: " + difference);
                });
                if ((difference >= log_interval || snapshot.size === 0)) {
                  if (log_size < log_minimum_points) {
                    // console.log("[" + device_id + "] - Writing to db")
                    admin.firestore().collection('devices').doc(device_id).collection('logs').doc().set(live, {
                      merge: true
                    });
                    config_flag = true;

                    log_size = log_size + 1;
                    resolve("[LOG : WRITING]"); ///////////FURTHER WORK REQUREID
                  } else {
                    admin.firestore().collection('devices').doc(device_id).collection('logs').doc(last_recorded_log).set(live, {
                      merge: true
                    });
                    resolve("[LOG : REWRITING]"); ///////////FURTHER WORK REQUREID
                  }
                } else {
                  resolve("[LOG : DISCARDING]");
                }
              }).catch(err =>
              {

                //  console.log('[E]-[' + device_id + '] - ', err);
                resolve("[LOG : " + err + "]");
              });
            } else {

              resolve("[LOG : SKIPPING]");
            }

          });

          var alarm_promise = new Promise(function (resolve, reject)
          {
            //ALARM UPDATE
            if (alarm_update) {
              var processed = 0;
              Object.keys(max).forEach((name) =>
              {
                processed++;
                var max_check = new Promise(function (resolve, reject)
                {
                  if (message.json[name] > max[name]) {
                    config_flag = true;
                    max[name] = roundTo(Number(message.json[name]), 2);

                    var timestamp = admin.firestore.FieldValue.serverTimestamp();
                    admin.firestore().collection('devices').doc(device_id).collection('alarms').where("parameter", "==", name).orderBy("timestamp").limit(1).get().then(snapshot =>
                    {
                      snapshot.forEach(doc =>
                      {
                        admin.firestore().collection('devices').doc(device_id).collection('alarms').doc(doc.id).set({
                          timestamp: timestamp,
                          parameter: name,
                          trigger: max[name],
                          value: message.json[name],
                          type: "Max"
                        }, {
                          merge: true
                        });
                      });

                    }).catch(err =>
                    {
                      console.log('[E]-[' + device_id + '] - ', err);
                    });

                    resolve(true);
                  } else {
                    resolve(false);
                  }
                });

                var min_check = new Promise(function (resolve, reject)
                {
                  if (message.json[name] < min[name]) {
                    config_flag = true;
                    min[name] = roundTo(Number(message.json[name]), 2);

                    var timestamp = admin.firestore.FieldValue.serverTimestamp();
                    admin.firestore().collection('devices').doc(device_id).collection('alarms').where("parameter", "==", name).orderBy("timestamp").limit(1).get().then(snapshot =>
                    {
                      snapshot.forEach(doc =>
                      {
                        admin.firestore().collection('devices').doc(device_id).collection('alarms').doc(doc.id).set({
                          timestamp: timestamp,
                          parameter: name,
                          trigger: min[name],
                          value: message.json[name],
                          type: "Min"
                        }, {
                          merge: true
                        });
                      });

                    }).catch(err =>
                    {
                      console.log('[E]-[' + device_id + '] - ', err);
                    });

                    resolve(true);
                  } else {
                    resolve(false);
                  }

                });

                Promise.all([max_check, min_check]).then(function (values)
                {

                  if ((Object.keys(max).length == processed)) {
                    resolve("[ALM : UPDATED]");
                  }
                });


              });


            } else {
              resolve("[ALM : SKIPPED]");
            }
          });

          var block_promise = new Promise(function (resolve, reject)
          {
            if (!blocked) {
              if (raw_update == false && live_update == false && log_update == false && alarm_update == false) {
                admin.firestore().collection('devices').doc(device_id).update({
                  blocked: true
                }).then(function ()
                {
                  resolve("[BLK : UPDATED]");
                  config_flag = true;
                  blocked = true;
                  resolve(true);

                })
                  .catch(function (error)
                  {
                    resolve("[BLK : " + error + "]");
                  });
              } else {
                resolve("[BLK : SKIPPED]");
              }
            } else {
              resolve("[BLK : SKIPPED]");
            }

          });

          return Promise.all([live_promise, alarm_promise, log_promise, raw_promise, block_promise]).then(function (values)
          {
            console.log(device_id + " - " + values);
            if (config_flag) {
              admin.firestore().collection('devices').doc(device_id).collection('datasets').doc('config').update({ raw_update: raw_update, live_update: live_update, log_size: log_size, max: max, min: min, blocked: blocked }, { merge: true })
                .then(function ()
                {
                  console.log("[CON : UPDATED]");
                }).catch(function (error)
                {
                  console.log("[CON : " + error + "]");
                });
            } else {
              console.log("[CON : SKIPPED]");
            }
          });
        }
      });
    }).catch(function (error)
    {

      console.log("Error getting document:", error);
      return true;
    });
});
exports.createsubscriptions = functions.firestore.document('users/{userid}/requests/{domainid}').onWrite((change, context) =>
{
  var data = change.after.data();
  //   var requested_from = change.after.data().requested_from;
  var userid = context.params.userid;
  var domainid = context.params.domainid;
  data["created_on"] = admin.firestore.FieldValue.serverTimestamp();
  admin.firestore().collection('domains').doc(domainid).collection('requests').doc(userid).set(data);
  //Add notification to admin about requst
  //   admin.firestore().collection('users').doc(requested_from).collection('requests').doc(userid).set(data);
});
exports.updatesubscriptions = functions.firestore.document('domains/{domainid}/requests/{userid}').onUpdate((change, context) =>
{
  const data = change.after.data();
  if (change.after.data().approval !== change.before.data().approval) {
    var userid = context.params.userid;
    var domainid = context.params.domainid;
    admin.firestore().collection('users').doc(userid).collection('requests').doc(domainid).update(data);
  } else {
    console.log("Same data so stopping riht here")
  }
});
exports.sendcommand = functions.firestore.document('devices/{device_id}/datasets/send').onUpdate((change, context) =>
{
  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  const newValue = change.after.data();
  // ...or the previous value before this update
  const previousValue = change.before.data();
  // access a particular field as you would any JS property
  //  const name = newValue.name;
  console.log(newValue);
  // perform desired operations ...
  const iot = require('@google-cloud/iot');
  var registryId = "Janith_Site";
  var name = context.params.device_id;
  const client = new iot.v1.DeviceManagerClient({
    // optional auth parameters.
  });
  var cbor = require('cbor');
  encoded = cbor.encode(newValue.send);
  encoded.toString("base64");
  const formattedName = client.devicePath(projectId, cloudRegion, registryId, name);
  const binaryData = newValue.send;
  const request = {
    name: formattedName,
    binaryData: encoded,
  };
  client.sendCommandToDevice(request).then(responses =>
  {
    const response = responses[0];
    console.log("[" + name + "]  Command: " + encoded);
  }).catch(err =>
  {
    console.error(err);
  });
});