var express = require('express');
var router = express.Router();


var userModel = require("../models/user");

const JWT = require('jsonwebtoken');
const config = require("../utils/config-env");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
/**
* @swagger
* /users/:
*   get:
*     summary: Lấy danh sách người dùng
*     responses:
*       200:
*         description: Thành công trả về danh sách người dùng
*       400:
*         description: Thất bại
*       401:
*         description: Unauthorized
*       403:
*         description: jwt expired
*/
router.get('/', async function (req, res) {
    try {
        const token = req.header("Authorization").split(' ')[1];
        if (token) {
            JWT.verify(token, config.SECRETKEY, async function (err, id) {
                if (err) {
                    res.status(403).json({ "status": 403, "err": err });
                } else {
                    //xử lý chức năng tương ứng với API
                    var list = await userModel.find();
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
 * /users/login/:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     description: Đăng nhập với email và password để nhận token và refresh token.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Thông tin đăng nhập người dùng
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Thất bại
 *       402:
 *         description: User không tồn tại
 */
router.post('/login', async function (req, res) {
    console.log('>>>>>>>>>>>>>> In API');
    console.log("SECRETKEY inside API: ", config.SECRETKEY); // Thêm log để kiểm tra

    try {
        const { email, password } = req.body;
        var checkUser = await userModel.findOne({ email: email, password: password });
        if (checkUser) {
            console.log("User found, creating tokens...");
            const token = JWT.sign({ id: checkUser._id }, config.SECRETKEY, { expiresIn: '30s' });
            const refreshToken = JWT.sign({ id: checkUser._id }, config.SECRETKEY, { expiresIn: '1h' });
            res.status(200).json({ status: true, message: "Log-in successful", token: token, refreshToken: refreshToken });
        } else {
            res.status(402).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        console.log("Error: ", error); // Log lỗi để kiểm tra
        res.status(400).json({ status: false, message: "Log-in failed: " + error });
    }
});

router.post('/sign-in', async function (req, res) {
    console.log('>>>>>>>>>>>>>> In API'); // Kiểm tra log
    console.log("SECRETKEY inside API: ", config.SECRETKEY); // Log để kiểm tra

    try {
        const { email, password } = req.body;
        var checkUser = await userModel.findOne({ email: email, password: password });
        if (checkUser) {
            const token = JWT.sign({ id: email }, config.SECRETKEY, { expiresIn: '30s' });
            const refreshToken = JWT.sign({ id: email }, config.SECRETKEY, { expiresIn: '1h' });
            res.status(200).json({ status: true, message: "Đăng nhập thành công", token: token, refreshToken: refreshToken });
        } else {
            res.status(400).json({ status: false, message: "không tìm thấy user" });
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(400).json({ status: false, message: "Đăng nhập thất bại" });
    }
});

/**
 * @swagger
 * /users/register/:
 *   post:
 *     summary: Đăng ký tài khoản
 *     description: Đăng ký tài khoản mới với thông tin người dùng.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Thông tin đăng ký người dùng
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Thất bại
 */
router.post('/register', async function (req, res) {
    try {
        //xử lý chức năng tương ứng với API
        const { name, email, password } = req.body;
        const account = { name, email, password };
        await userModel.create(account);
        res.status(200).json({ status: true, message: "Create account successful" });
    } catch (err) {
        res.status(400).json({ "status": 400, message: "Failed: " + err });
    }
});

module.exports = router;
