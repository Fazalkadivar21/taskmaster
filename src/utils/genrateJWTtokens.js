import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRATE, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export {
    generateAccessToken,
    generateRefreshToken
}