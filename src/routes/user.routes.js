import { Router } from "express";
import { varifyToken } from "../middleware/auth.middleware.js";
import {
  loginHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  logoutHandler,
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/login").post(loginHandler);
router.route("/createUser").post(createUserHandler);
router.route("/updateUser").post(varifyToken, updateUserHandler);
router.route("/deleteUser").post(varifyToken, deleteUserHandler);
router.route("/logout").post(varifyToken,logoutHandler)

export default router;
