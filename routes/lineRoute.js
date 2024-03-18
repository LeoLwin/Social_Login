const router = require("express").Router();
const { lineCallBack, lineLogin } = require("../controllers/lineController");

router.route("/Login").get(lineLogin);
router.route("/auth/callback").get(lineCallBack);
module.exports = router;
