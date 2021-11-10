//////////////////////////////////
// Dependencies
/////////////////////////////////
// get .env variables
require("dotenv").config()
// pull PORT from .env, give it a default of 3000 (object destructuring)
const {PORT = 3001, DATABASE_URL} = process.env
// import express
const express = require("express")
// create the application object
const app = express()
// import mongoose
const mongoose = require("mongoose")
// import middleware
const cors = require("cors")
const morgan = require("morgan")

//////////////////////////////
// Models
//////////////////////////////
// the cheese schema
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
}, {timestamps: true})

const Cheese = mongoose.model("Cheese", CheeseSchema)

/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies

////////////////////////////////
// Routes
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// Cheese index route
// get request to /cheeses, returns all cheeses as json
app.get("/cheeses", async (req, res) => {
    try {
      // send all cheeses
      res.json(await Cheese.find({}));
    } catch (error) {
      res.status(400).json({ error });
    }
  })

// Cheeses create route
// post request to /cheeses, uses request body to make new cheese
app.post("/cheeses", async (req, res) => {
    try {
      // create a new cheese
      res.json(await Cheese.create(req.body));
    } catch (error) {
      res.status(400).json({ error });
    }
  })

// Cheeses update  route
// put request /cheeses/:id, updates person based on id with request body
app.put("/cheeses/:id", async (req, res) => {
    try {
        // update a cheese
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}));
      } catch (error) {
        res.status(400).json({ error });
      }
})

// Destroy Route 
// delete request to /cheeses/:id, deletes the cheese specified
app.delete("/cheeses/:id", async (req, res) => {
    try {
        // delete a cheese
        res.json(await Cheese.findByIdAndRemove(req.params.id));
      } catch (error) {
        res.status(400).json({ error });
      }
})

/////////////////////////////////
// Database Connection
////////////////////////////////
// establish connection
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

// Connection Events
mongoose.connection
.on("open", () => console.log("You are connected to Mongo"))
.on("close", () => console.log("You are disconnected from Mongo"))
.on("error", (error) => console.log(error))

/////////////////////////////////
// Server Listener
/////////////////////////////////
app.listen(PORT, () => {console.log(`listening on PORT ${PORT}`)})