const fs = require("fs");
const path = require("path");

const express = require("express");
const port = process.env.PORT || 3000;

const app = express();

// set method allows us to set certain options for express app
// we want to use an engine to process our view files
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/////// MIDDLEWARE ////////
// Middleware to host all static files like css & js
// All files in public folder will be available to all users
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

////// ROUTES ///////
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/restaurants", function (req, res) {
  const filepath = path.join(__dirname, "data", "restaurants.json");
  const filedata = fs.readFileSync(filepath);
  const storedRestaurants = JSON.parse(filedata);
  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
});

app.get("/recommend", function (req, res) {
  res.render("recommend");
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  const filepath = path.join(__dirname, "data", "restaurants.json");

  const filedata = fs.readFileSync(filepath);
  const storedRestaurants = JSON.parse(filedata);

  storedRestaurants.push(restaurant);
  fs.writeFileSync(filepath, JSON.stringify(storedRestaurants));

  // After storing user data, redirect to new page
  res.redirect("/confirm");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/about", function (req, res) {
  res.render("about");
});

//////// STARTING SERVER ////////
app.listen(port);
console.log("Server started at http://localhost:" + port);
