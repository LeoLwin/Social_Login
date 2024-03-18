const Line = require("../models/lineModel");

const lineLogin = async (req, res) => {
  try {
    const url = await Line.lineLogin();
    res.redirect(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const lineCallBack = async (req, res) => {
  try {
    const result = await Line.lineCallBack(req.query.code);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { lineLogin, lineCallBack };
