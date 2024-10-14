const express = require("express");

const router = express.Router();

const Cohort = require("../models/Cohort.model")

router.get("/", (req, res, next)=>{
    Cohort.find({})
    .then((cohorts) => {
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      next(error);
    });
  })
  
router.post("/", async (req, res, next)=>{
    try {
      const response = await Cohort.create(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.get("/:cohortId", async (req, res, next)=>{
    try {
      const response = await Cohort.findById(req.params.cohortId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.put("/:cohortId", async (req, res, next)=>{
    try {
      const response = await Cohort.findByIdAndUpdate(req.params.cohortId, req.body, {new:true});
      res.status(202).json(response);
    } catch (error) {
      next(error);
    }
  })
  
router.delete("/:cohortId", async (req, res, next)=>{
    try {
      await Cohort.findByIdAndDelete(req.params.cohortId);
      res.sendStatus(202);
    } catch (error) {
      next(error);
    }
  })

module.exports = router;