var express = require("express");
var router = express.Router();

var productModel = require("../models/product");

const JWT = require('jsonwebtoken');
const config = require("../utils/config-env");


/**
* @swagger
* /san-pham/list:
*   get:
*     summary: Lấy danh sách sản phẩm
*     responses:
*       200:
*         description: Trả về danh sách sản phẩm
*       400:
*         description: Thất bại
*       401:
*         description: Unauthorized
*       403:
*         description: jwt expired
*/
// router.get('/list', async function (req, res, next) {
//     try {
//         const token = req.header("Authorization").split(' ')[1];
//         if (token) {
//             JWT.verify(token, config.SECRETKEY, async function (err, id) {
//                 if (err) {
//                     res.status(403).json({ "status": 403, "err": err });
//                 } else {
//                     //xử lý chức năng tương ứng với API
//                     var list = await productModel.find();
//                     res.status(200).json(list);
//                 }
//             });
//         } else {
//             res.status(401).json({ "status": 401, message: "Unauthorized" });
//         }
//     } catch (err) {
//         res.status(400).json({ "status": 400, message: "Thất bại" });
//     }
// });

router.get("/", async function (req, res) {
    console.log("Request received at /products/list");
    // try {
    //     var list = await productModel.find();
    res.status(200).json({ status: true });
    // } catch (e) {
    //     console.log("Error: ", e);
    //     res.status(400).json({ status: false, message: "Thất bại" });
    // }
});

module.exports = router;