const router = require("express").Router();
const {
  googleLogin,
  googleCallBack,
} = require("../controllers/googleController");

router.route("/Login").get(googleLogin);
router.route("/auth/callback").get(googleCallBack);
module.exports = router;
