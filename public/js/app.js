var config = {
    apiKey: "AIzaSyC1zErIIiRYLLoxWl-vAagB-r_AhG-8p2E",
    authDomain: "poised-charger-184507-910c4.firebaseapp.com",
    databaseURL: "https://poised-charger-184507-910c4.firebaseio.com",
    projectId: "poised-charger-184507-910c4",
    storageBucket: "poised-charger-184507-910c4.appspot.com",
    messagingSenderId: "1091304846099"
};

firebase.initializeApp(config);

const settings = {
    timestampsInSnapshots: !0
};

firebase.firestore().settings(settings);

var db = firebase.firestore();
