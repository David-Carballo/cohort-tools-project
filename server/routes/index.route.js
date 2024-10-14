const express = require("express");

const router = express.Router();

const cohortRouter = require("./cohort.route")
router.use("/cohorts", cohortRouter);

const studentRouter = require("./student.route")
router.use("/students", studentRouter);

const userRouter = require("./user.routes")
router.use("/users", userRouter)

module.exports = router;