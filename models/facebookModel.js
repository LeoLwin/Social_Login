require("dotenv").config();
const axios = require("axios");
const DB = require("../dbConnection");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const facebookLogin = async () => {
  try {
    const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`;
    return url;
  } catch (error) {
    console.error("Error in Facebook login:", error);
    throw error;
  }
};
const facebookCallBack = async (code) => {
  try {
    console.log(code);
    // Exchange authorization code for access token
    const { data } = await axios.get(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&client_secret=${process.env.FACEBOOK_SECRET_ID}&code=${code}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`
    );
    const { access_token } = data;
    console.log(`Access_Token : ${access_token}`);
    // // Use access_token to fetch user profile
    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v19.0/me?fields=name,email&access_token=${access_token}`
    );
    // Code to handle user authentication and retrieval using the profile data
    console.log(profile);
    const userData = {
      name: profile.name,
      social_id: profile.id,
      provider: "Facebook",
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
        profile.id,
        "emailll",
        "Facebook",
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
    //   return { message: "User data saved ddsuccessfully" };
    }
  } catch (error) {
    console.error("Error in Facebook CallBack:", error);
    throw error;
  }
};
module.exports = { facebookLogin, facebookCallBack };
