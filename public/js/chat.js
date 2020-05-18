function fetch_chat(t)
{
    var element = document.getElementById("total_chat");
    element.classList.add("label");
    element.classList.add("label-success");
    document.getElementById("total_chat").innerText = 0;

    t.forEach(function (t)
    {
        if (t.name != "Cloud_Exchange") {
            var e = db.collection("domains").doc(t.id).collection("chat");
            document.getElementById(t.name + "_label").innerText = 0;
            fetch(e, t.name + "_chat", t.name + "_label", "0");
        }

    });
}

function fetch(t, e, h)
{

    var n = [], a = "";
    t.orderBy("timestamp", "desc").get().then(function (t)
    {
        t.forEach(function (t)
        {
            chat_count(h);

            chat_count("total_chat");
            n.push({
                id: t.id,
                path: t.ref.path
            }), a += ds(t.ref.path, t.data().photoURL, t.id, datetimeformat(t.data().timestamp), t.data().name, t.data().message, h);
        }), document.getElementById(e).innerHTML = a;
    }).then(function ()
    {
        var myEle = document.getElementById("test_" + e);
        if (myEle && n.length != 0) {

            myEle.classList.add("label");
            myEle.classList.add("label-primary");
            myEle.innerText = n.length;

        }
        for (i in n) {
            var t = n[i].id;
            fetch(db.doc(n[i].path).collection("chat"), t, h);
        }
    }).catch(function (t)
    {
        badnews(t);
    });
}

function ds(t, e, n, a, i, c, h)
{

    var d = "<div class='streamline user-activity' id=" + n + "></div>", l = '<div class="sl-item" id="main_' + n + '"><a href="#href_' + n + '"  data-toggle="collapse"><div class="sl-avatar avatar avatar-sm avatar-circle"><img class="img-responsive img-circle" src=\'' + e + '\' alt="avatar"></div><div class="sl-content"><p class="inline-block"> <span class="" id="test_' + n + '"></span> <span>  ' + c + '</span><span class="capitalize-font txt-primary mr-5 weight-500"> -' + i + '</span><span class="block txt-grey font-12 capitalize-font">' + a + '</span></p></div></a><div class="collapse" id="href_' + n + '" aria-expanded="false" style=""> ' +
        '<div class="well"> ' + d + '<div class="button-list mt-25 "><input type="text" class="form-control  rounded-outline-input rounded-input" id ="input_' + n + '"   placeholder="add a comment..."></input><button class="btn btn-success btn-anim  btn-rounded" onclick="save_reply(\'' + t + "','" + n + "','" + h + '\')"><i class="fas fa-plus"></i><span class="btn-text">Reply</span></button><button class="btn btn-warning btn-anim  btn-rounded" onclick="delete_reply(\'' + t + "','" + n + "','" + h + '\')"><i class="icon-like"></i><span class="btn-text">delete</span></button ></div > <div class="pull-left"></div><div class="pull-right"></div></div></div></div></div>';
    return l;
}



function removeElement(t, h)
{




    var e = document.getElementById(t);
    e.parentNode.removeChild(e);
}

function delete_reply(t, e, h)
{
    fetch_chat(total_op);
    removeElement("main_" + e, h), db.doc(t).delete().then(function ()
    {
        goodnews("Document successfully deleted!");
    }).catch(function (t)
    {
        badnews(t);
    });
}
function chat_count(item)
{

    document.getElementById(item).innerText = Number(document.getElementById(item).innerText) + 1;
}
function chat_decount(item)
{

    document.getElementById(item).innerText = Number(document.getElementById(item).innerText) - 1;
}
function verdict_saver(t)
{
    document.getElementById("total_chat").innerText = Number(document.getElementById("total_chat").innerText) - Number(document.getElementById(t + "_label").innerText);

    document.getElementById(t + "_label").innerText = 0;

    var e = firebase.auth().currentUser,
        n = document.getElementById("add_" + t).value;
    if (null != e) {
        var a = e.photoURL, i = e.displayName, c = new Date();
        db.collection("domains").doc(t).collection("chat").add({
            name: i,
            message: n,
            timestamp: c,
            photoURL: a
        }).then(function ()
        {
            fetch(db.collection("domains").doc(t).collection("chat"), t + "_chat", t + "_label");
        }).catch(function (t)
        {
            badnews(t);
        });
    }
}

function save_reply(t, e, h)
{
    chat_count(h);


    chat_count("total_chat");

    var n = firebase.auth().currentUser, a = document.getElementById("input_" + e).value;
    if (null != n && "" != a) {
        var i = n.photoURL, c = n.displayName, d = new Date();
        db.doc(t).collection("chat").add({
            name: c,
            message: a,
            timestamp: d,
            photoURL: i
        }).then(function (t)
        {
            document.getElementById("input_" + e).value = "";
            document.getElementById(e).innerHTML = document.getElementById(e).innerHTML + ds(t.path, i, t.id, d, c, a, h);
        }).catch(function (t)
        {
            badnews(t);
        });
    }
}