//template of document for shortURL
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//creating format for our jsons in database, timestamps just adds a timestamp to the json
const urlSchema = new Schema(
  {
    originalUrl: String,
    shortenUrl: String
  },
  { timestamps: true }
);

//creates a collection(Table in SQL terms) named 'shorturl' using the format we created in urlSchema
const ModelClass = mongoose.model("shortUrl", urlSchema);
//allow us to use this in our js app
module.exports = ModelClass;
