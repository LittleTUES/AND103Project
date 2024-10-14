var express = require("express");
var router = express.Router();

var categoryModel = require("../models/category");

router.get("/", async function (req, res) {
    try {
        var list = await categoryModel.find();

        res.status(200).json({ status: true, data: list });
    } catch (e) {
        res.status(400).json({ status: false, message: "Failed" + '\n' + e });
    }
})

module.exports = router;
