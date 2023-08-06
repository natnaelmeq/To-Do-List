const pool = require("../../config/database.jsx");

const { mytodo, todoById, getalltodoTask } = require("./todo.service.jsx");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment");

module.exports = {
	createtodoTask: (req, res) => {
		const { todoTask, note, date, userId } = req.body;
		// const usequestionidrId = req.user.id;

		if (!todoTask) {
			return res.status(400).json({ msg: "please complete the your todo" });
		}

		const data = {
			todoTask,
			note,
			date,
			userId,
		};

		mytodo(data, (err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ msg: "Error", error: err });
			}

			const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
				expiresIn: "3h",
			});
			return res.json({
				token,
				user: { id: result.userId, display_name: result.user_name },
			});
		});
	},

	getTodoList: (req, res) => {
		getalltodoTask((err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			return res.status(200).json({ data: result });
		});
	},

	SingleTodoTask: (req, res) => {
		const id = req.params.id;
		todoById(id, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			return res.status(200).json({ data: result });
		});
	},

	getAllTasksByUserId: (req, res) => {
		const  userId  = req.params.id;

		const allTasks = `SELECT * FROM todo WHERE user_id = ?;`;

		pool.query(allTasks, [userId], (err, result) => {
			if (err) {
				return res.status(500).json({ msg: err });
			} else {
				return res.status(200).json({ data:result });
			}
		});
	},

	editSingleTask: (req, res) => {
		// Update task
		const id = req.params.id;
		const { todoTask, note, date, completed } = req.body;

		let completedValue = completed ? 1 : 0;

		const updateTask = `UPDATE todo
      SET ${todoTask ? `todoTask = ?,` : ""}
          ${note ? `note = ?,` : ""}
          ${date ? `date = ?,` : ""}
          completed = ?
      WHERE todo_id = ?`;

		const updateValues = [todoTask, note, date, completedValue, id];

		pool.query(updateTask, updateValues, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "Error", error: err });
			}

			if (result.affectedRows === 0) {
				return res.status(404).send(`No todo with id: ${id}`);
			}

			const singleTask = `SELECT * FROM todo WHERE todo_id = ?`;
			pool.query(singleTask, [id], (err, response) => {
				if (err) {
					console.log(err);
					return res.status(500).json({ msg: "Error", error: err });
				}

				const formattedResult = {
					...response[0],
					date: moment(response[0].date).format("YYYY-MM-DD"),
				};
				res.status(200).json(formattedResult);
			});
		});
	},

	// delete task
	deletesigleTask: (req, res) => {
		const id = req.params.id;
		const deleteTask = `DELETE FROM todo WHERE todo_id = ?`;
		console.log(id);

		pool.query(deleteTask, [id], (err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "Error", error: err });
			}

			if (result.affectedRows === 0) {
				return res.status(404).send(`No task with id: ${id}`);
			}

			res.status(200).send(`Task with id ${id} deleted successfully.`);
		});
	},
};
