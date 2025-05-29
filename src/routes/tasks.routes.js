import { Router } from "express";
import { varifyToken } from "../middleware/auth.middleware.js";
import {
  createTaskHandler,
  loadTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/tasks.controllers.js";

const router = Router();

router.route("/createTask").post(varifyToken,createTaskHandler);
router.route("/loadTask").post(varifyToken,loadTaskHandler);
router.route("/uploadTask").post(varifyToken,updateTaskHandler);
router.route("/deleteTask").post(varifyToken,deleteTaskHandler);

export default router;
