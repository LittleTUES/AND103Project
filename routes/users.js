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
    try {
        const { email, password } = req.body;
        var checkUser = await userModel.find({ email: email, password: password });
        if (checkUser) {
            //Token người dùng sẽ sử dụng gửi lên trên header mỗi lần muốn gọi api
            const token = JWT.sign({ id: email }, config.SECRETKEY, { expiresIn: '30s' });
            //Khi token hết hạn, người dùng sẽ call 1 api khác để lấy token mới
            //Lúc này người dùng sẽ truyền refreshToken lên để nhận về 1 cặp token, refreshToken mới
            //Nếu cả 2 token đều hết hạn người dùng sẽ phải thoát app và đăng nhập lại

            const refreshToken = JWT.sign({ id: email }, config.SECRETKEY, { expiresIn: '1h' });
            res.status(200).json({ status: true, message: "Log-in successful", token: token, refreshToken: refreshToken });
        } else {
            res.status(402).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        res.status(400).json({ status: false, message: "Log-in failed: " + error });
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
