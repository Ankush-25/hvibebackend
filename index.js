const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');
const bodyParser = require("body-parser");
const mainRouter = require("./routes/main.router");
dotenv.config();


async function dbconnection(MONGO_DB_URI){
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log("The Mongo Database is connected ")
  } catch (error) {
    console.log("The Mongo database is not connected successfully",error)
  }
}

async function startServer() {
  const PORT = process.env.PORT;
  const MONGO_DB_URI = process.env.MONGO_URL;

  app.use(bodyParser.json());
  app.use(express.json());

  await dbconnection(MONGO_DB_URI); 
  console.log("Server Has Started!");
    
  // change this while setuping the production
  app.use(cors({
    origin: process.env.NDE_ENV === 'production' 
      ? 'https://www.vgcut.in'||'https://vgcut.in' 
      : '*',
    methods: ['GET','POST','PUT','DELETE','PATCH']
  }));
    
  app.use("/",mainRouter);

  const httpServer = http.createServer(app)

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log("The Application is Started at",PORT);
  });
}
startServer();
