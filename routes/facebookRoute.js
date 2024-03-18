const router = require("express").Router();
const {
  facebookLogin,
  facebookCallBack,
} = require("../controllers/facebookController");

router.route("/Login").get(facebookLogin);
router.route("/auth/callback").get(facebookCallBack);
module.exports = router;
