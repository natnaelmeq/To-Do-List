const router = require("express").Router();

const {
	createtodoTask,
	getTodoList,
	SingleTodoTask,
	deletesigleTask,
	editSingleTask,
	getAllTasksByUserId,
} = require("./todo.conroller.jsx");


router.post("/", createtodoTask);
router.get("/allTask/:id", getAllTasksByUserId);
router.get("/task/:id", SingleTodoTask);
router.patch("/task/:id", editSingleTask);
router.delete("/task/:id", deletesigleTask);



module.exports = router;
