const google = require("../models/googleModel");

const googleLogin = async (req, res) => {
  try {
    const url = await google.googleLogin();
    res.redirect(url);
    // res.status(200).json(url);
  } catch (error) {
    console.error("Error in Google login:", error);
    res.status(500).json({ message: error.message });
  }
};

const googleCallBack = async (req, res) => {
  try {
    // const code = req.query.code;
    const result = await google.googleCallBack(req.query.code);
    res.status(200).json(result);
    // res.redirect(`http://localhost:5173/${result}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  googleLogin,
  googleCallBack,
};
