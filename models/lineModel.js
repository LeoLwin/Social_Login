require("dotenv").config();
const axios = require("axios");
const DB = require("../dbConnection");
const jwt = require("jsonwebtoken");

const lineLogin = async () => {
  try {
    const randomState = Math.random().toString(36).substring(7);
    console.log("Ramdom Number : ", randomState);
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CLIENT_ID}&redirect_uri=${process.env.LINE_REDRIECT_URI}&state=${randomState}&scope=profile%20openid&nonce=09876xyz`;
    return url;
  } catch (error) {
    console.error("Error in Google Callback:", error);
    throw {
      success: false,
      message: "Failed to authenticate with Google",
      error: error.message,
    };
  }
};

const lineCallBack = async (code) => {
  try {
    console.log("Hello from user model LineCallBack Code ::::", code);

    const d = {
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.LINE_REDRIECT_URI,
      client_id: process.env.LINE_CLIENT_ID,
      client_secret: process.env.LINE_SECRET_ID,
    };
    const { data } = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      d,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token } = data;

    console.log(access_token);
    const { data: profile } = await axios.get(
      `https://api.line.me/oauth2/v2.1/userinfo`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    console.log(profile);
    const userData = {
      name: profile.name,
      social_id: profile.sub,
      email: "email",
      provider: "Line",
    };

    const user = await DB.query(
      "SELECT * FROM users WHERE social_id = ? AND provider=?",
      [userData.social_id, userData.provider]
    );

    if (user.length > 0) {
      const accessToken = jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            id: user.social_id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return accessToken;
    } else {
      const sql =
        "INSERT INTO users (name, social_id, email, provider) VALUES (?, ?, ?, ?)";
      const result = await DB.query(sql, [
        profile.name,
        profile.sub,
        "email",
        "Line",
      ]);

      const accessToken = jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            id: user.social_id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { message: "User data saved successfully!!", accessToken };
    }
  } catch (error) {
    console.error("Error in Google Callback:", error);
    throw {
      success: false,
      message: "Failed to authenticate with Google",
      error: error.message,
    };
  }
};

module.exports = { lineLogin, lineCallBack };
