require("dotenv").config();
const moment = require("moment");
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./connect.js");
const port = 5000;


app.use(cors());
app.use(express.json());
app.get("/", (request, response) => response.status(200).send("hello world"));

// table schema
app.get("/install", (req, res) => {
	const installTable = `CREATE TABLE IF NOT EXISTS evangadiForum (
    id INT NOT NULL AUTO_INCREMENT,
    task_name VARCHAR(255) not null,
    member_name VARCHAR(255) not null,
    date DATE,
    completed BOOLEAN DEFAULT false,
    PRIMARY KEY (id)
  )`;

	pool.query(installTable, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send("Table created");
		}
	});
});

// create task
app.post("/create", (req, res) => {
	const { name, member, date } = req.body;

	if (!name) {
		return res.status(401).send("Please provide data");
	}

	const createTask = `INSERT INTO evangadiForum (task_name, member_name, date) VALUES (?, ?, ?)`;
	const createValues = [name, member, date];

	pool.query(createTask, createValues, (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err);
		} else {
			return res.status(201).send("Task created");
		}
	});
});

// get all tasks
app.get("/all-tasks", (req, res) => {
	const allTasks = `SELECT * FROM evangadiForum`;

	pool.query(allTasks, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		} else {
			return res.status(200).json({ result });
		}
	});
});

// get single task
app.get("/task/:id", async (req, res) => {
	const id = req.params.id;
	const singleTask = `SELECT * FROM evangadiForum WHERE id = ?`;

	pool.query(singleTask, [id], (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		}

		if (result.length < 1) {
			return res.status(404).send(`No task with id: ${id}`);
		} else {
			return res.status(200).json(result[0]);
		}
	});
});

// update task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	const { name, member, date, completed } = req.body;

	let completedValue = completed ? 1 : 0;

	const updateTask = `UPDATE evangadiForum
    SET ${name ? `task_name = ?,` : ""}
        ${member ? `member_name = ?,` : ""}
        ${date ? `date = ?,` : ""}
        completed = ?
    WHERE id = ?`;

	const updateValues = [name, member, date, completedValue, id];

	pool.query(updateTask, updateValues, (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err.message);
		} else {
			if (result.affectedRows === 0) {
				return res.status(404).send(`No task with id: ${id}`);
			}
			const singleTask = `SELECT * FROM evangadiForum WHERE id = ?`;
			pool.query(singleTask, [id], (err, result) => {
				if (err) {
					return res.status(500).json({ msg: err });
				} else {
					const formattedResult = {
						...result[0],
						date: moment(result[0].date).format("YYYY-MM-DD"),
					};
					return res.status(200).json(formattedResult);
				}
			});
		}
	});
});

// delete task
app.delete("/task/:id", (req, res) => {
	const id = req.params.id;
	const deleteTask = `DELETE FROM evangadiForum WHERE id = ?`;

	pool.query(deleteTask, [id], (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err.message);
		} else {
			if (result.affectedRows === 0) {
				return res.status(404).send(`No task with id: ${id}`);
			}
			return res.status(200).send(`Task with id ${id} deleted successfully.`);
		}
	});
});

app.listen(5000, (err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log(`http://localhost:${port}`);
		console.log("Connected with port 5000");
	}
});

module.exports = pool;



















