const express = require("express");

const Student = require("../models/Student.model")

const router = express.Router();

router.get("/", (req, res, next)=>{
    Student.find()
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.status(200).json(students);
    })
    .catch((error) => {
      next(error);    
    });
  })
  
router.post("/", async (req, res, next)=>{
    try {
      await Student.create(req.body);
      res.status(201).send("OK. Estudiante creado")
    } catch (error) {
      next(error);
    }
  })
  
router.get("/cohort/:cohortId", async (req, res, next)=>{
    try {
      // var newId = new mongoose.mongo.ObjectId(req.params.cohortId);
      const response = await Student
      .find({cohort: req.params.cohortId})
      .populate("cohort");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.get("/:studentId", async (req, res, next)=>{
    try {
      const response = await Student.findById(req.params.studentId)
      .populate("cohort");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.put("/:studentId", async (req, res, next)=>{
    try {
      const response = await Student.findByIdAndUpdate(req.params.studentId, req.body, {new:true});
      res.status(202).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.delete("/:studentId", async (req, res, next)=>{
    try {
      await Student.findByIdAndDelete(req.params.studentId);
      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  })

module.exports = router;