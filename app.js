var express = require("express");
var app = express();
var bodyparser = require("body-parser")


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
