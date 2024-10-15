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


module.exports = router;
