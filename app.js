const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const postRoutes = require("./routes");


// database connection
exports.conn = async () => {
  const url =
  "mongodb+srv://root:or9lp6PCu0I9ORF5@cluster0-ubp13.mongodb.net/api?retryWrites=true&w=majority";
    // let dbo;
    // let client;
  try {
    return MongoClient.connect(url);
    // dbo = client.db("api");
    //   return dbo
  
  } catch (e) {
    console.log("Error connection mongodb", e);
    
  }
 
};


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  ); 
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorrization "
  );
 
  next();
});

app.use(postRoutes);

app.listen(3000);
