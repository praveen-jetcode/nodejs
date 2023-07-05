var express = require("express");
var router = express.Router();
const AuthContoller = require("./../controller/Authcontoller");
const UserController = require("../controller/UserController");
/* GET users listing. */

router.post("/signup", AuthContoller.PostSignup).post("/signin", AuthContoller.login);
router.post("/forgotPassword" , AuthContoller.forgotPassword);
router.patch("/resetPassword/:token" , AuthContoller.resetPassword);
router.patch("/updatepassword" ,AuthContoller.protect , AuthContoller.updatePassword);
router.patch("/updateuser", AuthContoller.protect , UserController.updateUsers);
router.delete("/deleteuser",AuthContoller.protect , UserController.deleteUsers);
router.get("/" , UserController.getAllUsers)
module.exports = router;
