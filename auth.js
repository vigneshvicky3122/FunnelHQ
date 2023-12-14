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
    expiresIn: "15m",
  });
  return token;
};
const refreshVerifyToken = async ({ token, email, name }) => {
  try {
    let check = JWT.verify(token, process.env.REFRESH_SECRET_KEY);

    let newRefreshToken = await createRefreshToken({ email, name });

    return { check, newRefreshToken };
  } catch (error) {
    console.log(error);
  }
};
const createRefreshToken = async ({ email, name }) => {
  let token = JWT.sign({ email, name }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};
module.exports = {
  authentication,
  createToken,
  refreshVerifyToken,
  createRefreshToken,
};
