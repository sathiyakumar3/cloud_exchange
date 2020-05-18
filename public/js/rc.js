function rcsubmit(){
  

 var rcText = document.getElementById('rctext').value;

 var test = db.collection("devices").doc("RC_Workshop").collection("datasets").doc("send");

// Set the "capital" field of the city 'DC'
console.log(rcText);
return test.set({
    send:rcText
})
.then(function() {
    console.log("Document successfully updated!");
})
.catch(function(error) {
    // The document probably doesn't exist.
    console.error("Error updating document: ", error);
});

 console.log(rcText);
}
