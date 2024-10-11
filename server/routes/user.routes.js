const router = require("express").Router();

const verifyToken = require("../middlewares/auth.middlewares");
const User = require("../models/User.model");

router.get("/:id", verifyToken, async (req, res, next)=>{
    console.log(req.payload);
    try {
        const response = await User.findById(req.payload._id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

module.exports = router;