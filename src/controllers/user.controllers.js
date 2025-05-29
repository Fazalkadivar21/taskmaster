import bcrypt from "bcrypt";
import user from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/genrateJWTtokens.js";

const createUserHandler = async (req, res) => {
  const { username, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userData = {
      username: username,
      password: hashedPassword,
      email: email,
    };

    const newUser = await user.create(userData);

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    const tokenUser = await user.findByIdAndUpdate(newUser._id, { refreshToken });

    const { password: _, ...safeUser } = tokenUser._doc;

    //create accessToken
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("username", safeUser.username, {
        httpOnly: false,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: "User created successfully",
        user: safeUser,
      });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

const loginHandler = async (req, res) => {
  const { username, password } = req.body;
  try {
    const User = await user.findOne({ username: username });
    if (!User) {
      return res.status(404).json({
        message: "Invalid username/password",
      });
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username/password",
      });
    }

    const accessToken = generateAccessToken(User._id);
    const refreshToken = generateRefreshToken(User._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .cookie("username", User.username, {
        httpOnly: false,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: "Login successfull",
      });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

const logoutHandler = async (req, res) => {
  await user.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .json({
      message: "User logged out.",
    });
};

const updateUserHandler = async (req, res) => {
  const { userId, username, email, password,  } = req.body;

  try {
    const updateFields = {};

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error.message}`,
    });
  }
};

const deleteUserHandler = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const User = await user.findOne({ _id: userId });
if (!User) {
      return res.status(404).json({ message: "User not found" }); // ✅ FIXED: null check
    }
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    await user.deleteOne({ _id: userId });

    return res.status(200).json({
      message: "Account Deleted.",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

export {
  loginHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  logoutHandler,
};
