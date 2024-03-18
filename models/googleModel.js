require("dotenv").config();
const axios = require("axios");
const DB = require("../dbConnection");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const googleLogin = async () => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.Google_Client_Id}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
    return url;
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
};

const googleCallBack = async (code) => {
  try {
    console.log(code);
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.Google_Client_Id,
      client_secret: process.env.Google_Client_Secret,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const { access_token } = data;
    console.log(access_token);

    // Use access_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    console.log(profile);

    try {
      const user = await DB.query("SELECT * FROM users WHERE social_id = ?", [
        profile.id,
      ]);


      if (user && user.length > 0) {
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
          profile.id,
          profile.email,
          "Google",
        ]);
        const accessToken = jwt.sign(
          {
            user: {
              name: profile.name,
              email: profile.email,
              id: profile.id,
            },
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return accessToken;
      }
    } catch (error) {
      console.error("Error in Google Callback:", error);
      return {
        success: false,
        message: "Failed to register user",
        error: error.message,
      };
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

module.exports = { googleLogin, googleCallBack };
