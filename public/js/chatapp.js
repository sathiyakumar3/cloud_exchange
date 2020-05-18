var domain="";
var x ="";
var y="";
var a ="";
var b ="";
var last_updated="";



     var user = firebase.auth().currentUser;
$(document).ready(function () {
 // domainid = window.location.href.split("id=")[1];
   domain = document.getElementById("idtest").value;




    db.collection("domains")
    .get()
    .then(function(querySnapshot){

      querySnapshot.forEach(function(doc){
        window.alert(doc.data().name)
      })
    })

     //var last_updated="";
     db.collection("domains").doc(domain).collection("chat")
     .get()



     .then(function(querySnapshot) {
       querySnapshot.forEach(function(doc) {
         // doc.data() is never undefined for query doc snapshots
         //console.log(doc.id, " => ", doc.data());



        last_updated = (doc.data().timestamp).toDate().getDate() + "-" + ((doc.data().timestamp).toDate().getMonth() + 1) + "-" + (doc.data().timestamp).toDate().getFullYear() + " " + (doc.data().timestamp).toDate().getHours() + ":" + (doc.data().timestamp).toDate().getMinutes() + ":" + (doc.data().timestamp).toDate().getSeconds();

         if (user.uid==doc.data().user){
           y = x+
           "<li class='self mb-10'>"+
														"<div class='self-msg-wrap'>"+
													"<div class='msg block pull-right'>" +doc.data().text+
												"<div class='msg-per-detail text-right'>"+
											"<span class='msg-time txt-grey'>"+last_updated+"</span>"+ "&nbsp;"+"&nbsp;"+
                      "<i class='zmdi zmdi-delete'onclick='chatdlt(\""+doc.id+"\")'>"+"</i>"+
										"</div>"+
									"</div>"+
								"<div class='clearfix'>"+"</div>"+
							"</div>"+
						"</li>";

           //"<li class='self mb-10'><div class='self-msg-wrap'><div class='msg block msg pull-right'>"+doc.data().text+"<div class='msg-per-detail text-right'><span class='msg-time txt-grey'>"+"</span>"+"<i class='zmdi zmdi-delete'onclick='chatdlt(\""+doc.id+"\")'>"+"</i>"+"</div>"+"</div>"+"<div class='clearfix'>"+"</div>"+"</div>"+"</li>";
           x=y;} else {
             y=x+"<li class='friend'>"+"<div class='friend-msg-wrap'>"+"<div class='msg pull-left'>"+
            "<span class='msg-time txt-grey chat-username'>"+doc.data().name+"</span>"+
             "<p>"+doc.data().text+"</p>"+
             "<div class='msg-per-detail text-right'>"+
             "<span class='msg-time txt-grey'>"+last_updated+"</span>"+
             "</div>"+
             "</div>"+
             "<div class='clearfix'>"+"</div>"+
             "</div>"+
             "</li>";
             x=y;
           }


         });
       }).then(function () {
         document.getElementById('test123').innerHTML = y;
       })
       .catch(function(error) {
         console.log("Error getting documents: ", error);
       });


       var fruits = [];

        db.collection("domains").doc(domain).collection("chat")
       .get()
       .then(function(querySnapshot) {


         querySnapshot.forEach(function(doc) {
           //console.log(fruits);
           if(fruits.includes(doc.data().user)){

           }else{
             fruits.push(doc.data().user);
             a = b+
             "<div class='row'>"+
             "<div class='col-sm-12'>"+"<a href='javascript:void(0)'>"+
             "<div class='chat-data'>"+

             "<div class='user-data'>"+
             "<span class='name block capitalize-font'>"+doc.data().name+"</span>"+
             "</div>"+

             "<div class='clearfix'>"+"</div>"
             +"</div>"+
             "</a>"+
             "</div>"+

             "</div>"
             b=a;
           }

           if (user.uid!=doc.data().userID){


           }else {

           }

           document.getElementById('test1234').innerHTML = a;

         })

       });


});

function chatok(){
  var input_msg_send_chatapp = document.getElementById("input_msg_send_chatapp").value;

  firebase.auth().onAuthStateChanged(function (user) {
    var user = firebase.auth().currentUser;
    //uid = user.uid;




    db.collection("domains").doc(domain).collection("chat").doc().set({
      user:user.uid,
      name:user.displayName,
      text: input_msg_send_chatapp,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      toUser : "",
      fromUser:user.uid
      //  uid : user.uid
    });

    //console.log(user.uid+" | "+user.displayName+" | "+input_msg_send_chatapp+ " | "+firebase.firestore.FieldValue.serverTimestamp())


  });

};
//************************************************

function loadchat(){
  var input_msg_send_chatapp = document.getElementById("input_msg_send_chatapp").value;
  y = x+

"<li class='friend'>"+"<div class='friend-msg-wrap'>"+"<div class='msg pull-left'>"+
  "<p>"+input_msg_send_chatapp+"</p>"+
  "<div class='msg-per-detail text-right'>"+
  "<span class='msg-time txt-grey'>"+"</span>"+
  "</div>"+
  "</div>"+
  "<div class='clearfix'>"+"</div>"+
  "</div>"+
  "</li>";


  //"<li class='self mb-10'><div class='self-msg-wrap'><div class='msg block pull-left' id='text'>"+input_msg_send_chatapp+"<div class='msg-per-detail text-right'><span class='msg-time txt-grey'>"+"</span>"+"</div>"+"</div>"+"<div class='clearfix'>"+"</div>"+"</div>"+"</li>";
  x=y;
   document.getElementById('test123').innerHTML = y;
}

  function chatdlt(){
    window.alert("work")
  }
