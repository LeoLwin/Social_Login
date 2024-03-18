const Facebook = require("../models/facebookModel");

const facebookLogin = async (req, res) => {
  try {
    const url = await Facebook.facebookLogin();
    res.redirect(url);
    // res.status(200).json(url);
  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(500).json({ message: error.message });
  }
};

const facebookCallBack = async (req, res) => {
  try {
    // const code = req.query.code;
    const result = await Facebook.facebookCallBack(req.query.code);
    res.status(200).json(result);
    // res.redirect(`http://localhost:5173/${result}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    facebookLogin,
    facebookCallBack,
};
