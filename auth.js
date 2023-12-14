const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authentication = async (req, res, next) => {
  try {
    let check = JWT.verify(
      req.headers.authorization,
      process.env.ACCESS_SECRET_KEY
    );
    if (check) {
      next();
    }
  } catch (error) {
    res.json({
      status: 401,
      message: "Token Expired!",
    });
  }
};
const createToken = async ({ email }) => {
  let token = JWT.sign({ email }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "15min",
  });
  return token;
};
const refreshVerifyToken = async (token) => {
  try {
    let check = JWT.verify(token, process.env.REFRESH_SECRET_KEY);
    return check;
  } catch (error) {
    console.log(error);
  }
};
const createRefreshToken = async ({ email, name }) => {
  let token = JWT.sign({ email, name }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "1y",
  });
  return token;
};
module.exports = {
  authentication,
  createToken,
  refreshVerifyToken,
  createRefreshToken,
};
