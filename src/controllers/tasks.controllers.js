import Task from "../models/task.model.js";

/*
    sample_data = {
        heading : "level 0",
        discription : "complete 1st project of level 0",
        priority : "High",
        due : "timestring",
    }
*/

const createTaskHandler = async (req, res) => {
  const { task, userId } = req.body;
  try {
    const newTask = await Task.create({ ...task, userId });
    return res.status(200).json({
      message: "task created",
      taskId: newTask._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

const loadTaskHandler = async (req, res) => {
  const { userId } = req.body;
  try {
    const tasks = await Task.find({
      userId: userId,
    });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found.",
      });
    }
    return res.status(200).json({
      message: "tasks found.",
      tasks: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

const updateTaskHandler = async (req, res) => {
  const { taskId, heading, discription, priority, due, isCompleted } = req.body;
  try {
    const updateData = {};
    if (heading) updateData.heading = heading;
    if (discription) updateData.discription = discription;
    if (priority) updateData.priority = priority;
    if (due) updateData.due = due;
    if (isCompleted) updateData.isCompleted = isCompleted;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found.",
      });
    }
    return res.status(200).json({
      message: "task Updated.",
      tasks: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

const deleteTaskHandler = async (req, res) => {
  const { taskId } = req.body;
  try{
    await Task.deleteOne({_id:taskId})
    return res.status(200).json({
        message : "task deleted"
    })
  }catch (error) {
    return res.status(500).json({
      message: `Error : ${error}`,
    });
  }
};

export {
  createTaskHandler,
  loadTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
};
