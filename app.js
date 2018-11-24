var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser")
    firebase   = require("firebase");
                 require("firebase/firestore");
                 require("firebase/auth");



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

var locations = []
var donationsarr = []
var location;


app.get("/", function(req, res) {
res.render("landing");

});

app.post("/", function(req, res){
    res.redirect("locationspage");
});

app.get("/locationspage", function(req, res){
    db.collection("locations").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        var temp = doc.data();
        locations.push(temp);
        });
    res.render("locationspage", {locations: locations});
    locations = [];
    });
});

app.get("/locationspage/new", function(req, res){
    res.render("new");
})

app.get("/registration", function(req, res){
    res.render("registration");
})
app.get("/locationdetails/:id", function(req, res){
    db.collection("locations").where("name", "==", req.params.id)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                location = doc.data();
                res.render("locationdetails", {location: location});
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        location = null;
});

app.get("/locationspage/:id", function(req, res){
    db.collection("donations").where("location", "==", req.params.id)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    donationsarr.push(doc.data());
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    db.collection("locations").where("name", "==", req.params.id)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                location = doc.data();
                res.render("location", {location: location, donations: donationsarr});
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
    donationsarr = [];
    location = null;
});

app.get("/locationspage/")
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
