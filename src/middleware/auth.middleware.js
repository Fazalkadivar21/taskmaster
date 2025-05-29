import jwt from "jsonwebtoken";
import user from "../models/user.model.js";

export const varifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }
    const decodedToken = jwt.varify(token, process.env.ACCESS_TOKEN_SECRATE);

    const User = await user
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!User) {
      res.status(401).json({
        message: "Invalid Token.",
      });
    }

    req.userId = User._id;
    next();

  } catch (error) {
    res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};
