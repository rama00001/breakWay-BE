var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Products = require("../models/products");
var db = require("../server");

router.get("/", function(req, res, next) {
  return res.render("index.ejs");
});

router.get("/products", (req, res, next) => {
  Products.find()
    .then(response => {
      res.json({
        response
      });
    })
    .catch(error => {
      res.json({
        message: "An error Occured"
      });
    });
});

// show products by using category or price
router.get("/get_single_product/:price", (req, res, next) => {
  // let price = req.params.price;
    Products.findOne({ price: req.params.price }, (err, products) => {
      console.log(products)
    if (err) {
      res.send(err);
    }
    res.json(products);
  });
});
 

router.post("/add-products", (req, res, next) => {
  let product = new Products({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  });

  product
    .save()
    .then(response => {
      res.json({
        message: "Product Added Successfully"
      });
    })
    .catch(error => {
      res.json({
        message: "An error occured"
      });
    });
});

router.post("/register", function(req, res, next) {
  console.log(req.body);
  var personInfo = req.body;

  if (
    !personInfo.email ||
    !personInfo.username ||
    !personInfo.password ||
    !personInfo.type
  ) {
    res.send();
  } else {
    User.findOne({ email: personInfo.email }, function(err, data) {
      if (!data) {
        var count;
        User.findOne({}, function(err, data) {
          if (data) {
            count = data.unique_id + 1;
          } else {
            count = 1;
          }

          var newPerson = new User({
            unique_id: count,
            email: personInfo.email,
            username: personInfo.username,
            password: personInfo.password,
            type: personInfo.type
          });

          newPerson.save(function(err, Person) {
            if (err) console.log(err);
            else console.log("Success");
          });
        })
          .sort({ _id: -1 })
          .limit(1);
        res.send({ Success: "You are regestered,You can login now." });
      } else {
        res.send({ Success: "Email is already used." });
      }
    });
  }
});

router.post("/login", function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, data) {
    if (data) {
      if (data.password == req.body.password) {
        req.session.userId = data.unique_id;
        res.json({
          user: {
            id: data._id,
            name: data.username,
            email: data.email,
            type: data.type
          }
        });
      } else {
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not regestered!" });
    }
  });
});

module.exports = router;
