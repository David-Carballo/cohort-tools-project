const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model")
const Student = require("./models/Student.model")
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require('cors');

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts = require("./cohorts.json");
// const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
// app.use(cors()); //Permite cualquier entrada
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ['http://localhost:5173'],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHORTS ROUTES

app.get("/api/cohorts", (req, res)=>{
  Cohort.find({})
  .then((cohorts) => {
    console.log("Retrieved cohorts ->", cohorts);
    res.json(cohorts);
  })
  .catch((error) => {
    console.error("Error while retrieving cohorts ->", error);
    res.status(500).json({ error: "Failed to retrieve cohorts" });
  });
})

app.post("/api/cohorts", async (req, res)=>{
  try {
    await Cohort.create(req.body);
    res.send("OK. Cohort creado")
  } catch (error) {
    console.log(error);
  }
})

app.get("/api/cohorts/:cohortId", async (req, res)=>{
  try {
    const response = await Cohort.findById(req.params.cohortId);
    res.json(response);
  } catch (error) {
    console.log()
  }
})

app.put("/api/cohorts/:cohortId", async (req, res)=>{
  try {
    const response = await Cohort.findByIdAndUpdate(req.params.cohortId, req.body, {new:true});
    res.json(response);
  } catch (error) {
    console.log(error)
  }
})

app.delete("/api/cohorts/:cohortId", async (req, res)=>{
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res.send("OK. Cohort eliminado");
  } catch (error) {
    console.log(error)
  }
})

// STUDENTS ROUTES

app.get("/api/students", (req, res)=>{
  Student.find()
  .then((students) => {
    console.log("Retrieved students ->", students);
    res.json(students);
  })
  .catch((error) => {
    console.error("Error while retrieving students ->", error);
    res.status(500).json({ error: "Failed to retrieve students" });
  });
})

app.post("/api/students", async (req, res)=>{
  try {
    await Student.create(req.body);
    res.send("OK. Estudiante creado")
  } catch (error) {
    console.log(error);
  }
})

app.get("/api/students/cohort/:cohortId", async (req, res)=>{
  try {
    // var newId = new mongoose.mongo.ObjectId(req.params.cohortId);
    const response = await Student
    .find({cohort: req.params.cohortId})
    .populate("cohort");
    res.json(response);
  } catch (error) {
    console.log(error)
  }
})

app.get("/api/students/:studentId", async (req, res)=>{
  try {
    const response = await Student.findById(req.params.studentId);
    res.json(response);
  } catch (error) {
    console.log()
  }
})

app.put("/api/students/:studentId", async (req, res)=>{
  try {
    const response = await Student.findByIdAndUpdate(req.params.studentId, req.body, {new:true});
    res.json(response);
  } catch (error) {
    console.log(error)
  }
})

app.delete("/api/students/:studentId", async (req, res)=>{
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.send("OK. Estudiante eliminado");
  } catch (error) {
    console.log(error)
  }
})




// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});