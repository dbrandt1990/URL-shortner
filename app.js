//get requirments
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
//create app
const app = express();
app.use(bodyParser.json());
app.use(cors());

//connect to database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/shortUrls");

//allows node to find html content in public folder
app.use(express.static(__dirname + "/public"));
//creates the database entry

app.get("/new/:urlToShorten(*)", (req, res, next) => {
  var { urlToShorten } = req.params;
  //Regex for url via stackoverflow
  var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;

  if (regex.test(urlToShorten) === true) {
    var short = Math.floor(Math.random() * 100000).toString();

    var data = new shortUrl({
      originalUrl: urlToShorten,
      shortenUrl: short
    });

    data.save(err => {
      if (err) {
        return res.send("Error saving to database");
      }
    });

    return res.json(data);
  }
  var data = new shortUrl({
    originalUrl: urlToShorten,
    shortenUrl: "invalidURL"
  });

  return res.json(data);
});

// Query database for short url and forward full url
app.get("/:urlToForward", (req, res, next) => {
  //stores value of param
  var shorterUrl = req.params.urlToForward;

  //refering to mongoose collection shortUrl
  shortUrl.findOne({ shortenUrl: shorterUrl }, (err, data) => {
    if (err) return res.send("error reading database");
    var re = new RegExp("^(http|https)://", "i");
    var strToCheck = data.originalUrl;
    if (re.test(strToCheck)) {
      res.redirect(301, data.originalUrl);
    } else {
      res.redirect(301, "http://" + data.originalUrl);
    }
  });
});

//listen to see if working
app.listen(3000, () => {
  console.log("working");
});
