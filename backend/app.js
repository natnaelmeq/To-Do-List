
console.clear();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
// mysql connection
const { connect } = require("./connect");

// table schema
app.get("/install", (req, res) => {
	const installTable = `CREATE TABLE IF NOT EXISTS todo (
      id INT NOT NULL AUTO_INCREMENT,
      task_name VARCHAR(255),
      date DATE,
      completed BOOLEAN DEFAULT false,
      PRIMARY KEY (id)
    )`;
	connect.query(installTable, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send("Table created");
		}
	});
});

app.use(express.json());

// create task
app.post("/create", (req, res) => {
	const { name, date } = req.body;
	console.log(req.body);
	if (!name) {
		return res.status(401).send("Please provide data");
	}
	const createTask = `INSERT INTO todo (task_name, date) VALUES ('${name}', '${date}')`;

	connect.query(createTask, (err, result) => {
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
	const allTasks = `SELECT * FROM todo`;
	connect.query(allTasks, (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		} else {
			return res.status(200).json({ result });
		}
	});
});

// get single task
app.get("/task/:id", (req, res) => {
	const id = req.params.id;

	const singleTask = `SELECT * FROM todo WHERE id = ?`;
	connect.query(singleTask, [id], (err, result) => {
		if (err) {
			return res.status(500).json({ msg: err });
		}

		if (result.length < 1) {
			return res.status(404).send(`No task with id: ${id}`);
		} else {
			return res.status(200).json({ result });
		}
	});
});

// update task
app.patch("/task/:id", (req, res) => {
	const id = req.params.id;
	const { name, completed } = req.body;

	let completedValue = completed ? 1 : 0;

	const updateTask = `UPDATE todo
    SET ${name ? `task_name = ?,` : ""}
        completed = ?
    WHERE id = ?`;
	console.log(updateTask);

	connect.query(updateTask, [name, completedValue, id], (err, result) => {
		if (err) {
			console.log(err);
			return res.send(err.message);
		} else {
			if (result.affectedRows === 0) {
				return res.status(404).send(`No task with id: ${id}`);
			}
			const singleTask = `SELECT * FROM todo WHERE id = ?`;
			connect.query(singleTask, [id], (err, result) => {
				if (err) {
					return res.status(500).json({ msg: err });
				} else {
					return res.status(200).json({ result });
				}
			});
		}
	});
});

// delete task
app.delete("/task/:id", (req, res) => {
	const id = req.params.id;

	const deleteTask = `DELETE FROM todo WHERE id = ?`;

	connect.query(deleteTask, [id], (err, result) => {
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
		console.log("Yes, I am connected");
		return "Yes, I am connected";
	}
});
