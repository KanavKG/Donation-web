var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser")
    firebase   = require("firebase");
                 require("firebase/firestore");



var config = {
    apiKey: "AIzaSyANdsKVA9aRHqJSzQxkTez7-9I-HFI6Vko",
    authDomain: "donationtracker-2bec2.firebaseapp.com",
    databaseURL: "https://donationtracker-2bec2.firebaseio.com",
    projectId: "donationtracker-2bec2",
    storageBucket: "donationtracker-2bec2.appspot.com",
    messagingSenderId: "515896993726"
  };

firebase.initializeApp(config);

var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

app.use(express.static(__dirname + '/public/'));
app.use(bodyparser.urlencoded({extended: true}));


app.set("view engine", "ejs");

var locations = [
    {name: "AFD Station 4", city: "Atlanta"},
    {name: "BOYS & GIRLS CLUB W.W. WOOLFOLK", city: "Atlanta"},
    {name: "PATHWAY UPPER ROOM CHRISTIAN MINISTRIES", city: "Atlanta"},
    {name: "PAVILION OF HOPE INC", city: "Scottdale"},
    {name: "KEEP NORTH FULTON BEAUTIFUL", city: "Decatur"},
    {name: "D&D CONVENIENCE STORE", city: "Sandy Spring"}
]


app.get("/", function(req, res) {
    db.collection("users").add({
    first: "Ada",
    last: "Lovelace",
    location: "AFD Station 4",
    role: "Location Employee"
})
.then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});

res.render("landing");

});

app.post("/", function(req, res){

    res.redirect("locationspage");
})
app.get("/locationspage", function(req, res){
    res.render("locationspage", {locations: locations});
});

app.get("/locationspage/newlocation", function(req, res){
    res.render("newlocation.ejs");
})
app.post("/locationspage", function(req, res){

    var name = req.body.name;
    var city = req.body.city;
    var newLocation = {name: name, city: city};
    locations.push(newLocation);
    res.redirect("/locationspage");

    // get data from ofrm and add a location
    // redirect back to locations page


})
app.listen(3000, function (){
    console.log("Server is running on port 3000")
})
