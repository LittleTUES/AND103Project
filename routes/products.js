var express = require("express");
var router = express.Router();

var productModel = require("../models/product");

const JWT = require('jsonwebtoken');
const config = require("../utils/config-env");


/**
* @swagger
* /products/:
*   get:
*     summary: Lấy danh sách sản phẩm
*     responses:
*       200:
*         description: Thành công trả về danh sách sản phẩm
*       400:
*         description: Thất bại
*       401:
*         description: Unauthorized
*       403:
*         description: jwt expired
*/
router.get('/', async function (req, res) {
    try {
        // const token = req.header("Authorization").split(' ')[1];
        const authorizationHeader = req.header("Authorization");
        console.log("Authorization Header: ", authorizationHeader);
        const token = authorizationHeader.split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    //xử lý chức năng tương ứng với API
                    var list = await productModel.find();
                    res.status(200).json(list);
                }
            });
        } else {
            res.status(401).json({ "status": 401, message: "Unauthorized" });
        }
    } catch (err) {
        res.status(400).json({ "status": 400, message: "Failed" });
    }
});

/**
* @swagger
* /products/add/:
*   post:
*     summary: Thêm sản phẩm
*     responses:
*       200:
*         description: Thành công thêm sản phẩm
*       400:
*         description: Thất bại
*       401:
*         description: Unauthorized
*       403:
*         description: jwt expired
*/
router.post('/add', async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    //xử lý chức năng tương ứng với API
                    const { name, image, quantity, price, category } = req.body;
                    const obj = await categoryModel.findById({ _id: category });
                    if (obj) {
                        const itemAdd = { name, price, quantity, image, category };
                        await productModel.create(itemAdd);
                        res.status(200).json({ status: true, message: "Add successful" });
                    } else {
                        return res.status(400).json({ status: false, message: "Category does not exist" });
                    }
                }
            });
        } else {
            res.status(401).json({ "status": 401, message: "Unauthorized" });
        }
    } catch (err) {
        res.status(400).json({ "status": 400, message: "Failed" });
    }
});

module.exports = router;