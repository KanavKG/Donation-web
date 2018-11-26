var express    = require("express"),
    app        = express(),
    bodyparser = require("body-parser")
    firebase   = require("firebase");
                 require("firebase/firestore");
                 require("firebase/auth");
                 require('dotenv').config();

firebase.initializeApp({
    apiKey: process.env.MY_API_KEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSEGINGSENDERID
  });

// firebase.initializeApp(config);

var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

app.use(express.static(__dirname + '/public/'));
app.use(bodyparser.urlencoded({extended: true}));


app.set("view engine", "ejs");

var locations = [];
var donationsarr = []
var location;
var donation;
var user;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log("userlognin");
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var role = user.role;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});

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

app.get("/signin", function(req, res){
    res.render("signin");
});

app.post("/signin", function(req, res){
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;
    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(function(){
        res.redirect("locationspage");
    })
    .catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code)
    console.log(error.message);
});
})
app.get("/registration", function(req, res){
    res.render("registration");
});

app.post("/registration", function(req, res){
    var fname = req.body.inputFirstName;
    var lname = req.body.inputLastName;
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;
    var confirm = req.body.confirmInputPassword;
    var role = req.body.roledropdown;
    if (password === confirm) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function() {
            var user = firebase.auth().currentUser;
            db.collection("users").add({
                first: fname,
                last: lname,
                role: role,
                UID: user.uid
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

            res.redirect("locationspage");
            //Add user to database
            //Redirect to locationspage
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error.code);
            console.log(error.message);
        });
    } else {
        console.log("Password and Confirm passwords do not match");
        res.redirect("registration");
    }
});

app.get("/locationdetails/:id/:id2", function(req, res){
    db.collection("donations").where("name", "==", req.params.id2)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                donation = doc.data();
                res.render("donationdetails", {donation: donation});
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        donation = null;
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

app.get("/locationspage/:id/newdonation", function(req, res){
    res.render("newdonation");
})

app.post("/locationspage/:id/newdonation", function(req, res){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    db.collection("donations").add({
        name: req.body.inputName,
        location: req.body.inputLocation,
        value: req.body.inputValue,
        shortDescription: req.body.inputShort,
        fullDescription: req.body.inputLong,
        comment: req.body.inputComment,
        category: req.body.typedropdown,
        timestamp: dateTime
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        res.redirect("location")
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    })
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
