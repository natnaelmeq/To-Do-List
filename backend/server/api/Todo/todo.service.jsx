const pool = require("../../config/database.jsx");

module.exports = {
	mytodo: (data, callback) => {
		pool.query(
			"INSERT INTO todo(todoTask, note,date, user_id) VALUES (?, ?,?,?)",
			[data.todoTask, data.note, data.date, data.userId],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result);
			}
		);
	},

	todoById: (id, callback) => {
		pool.query(
			"SELECT *  FROM todo WHERE todo.todo_id = ?",
			[id],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result[0]);
			}
		);
	},


	getalltodoTask: (callback) => {
		pool.query("SELECT * FROM todo", [], (err, result) => {
			if (err) {
				return callback(err);
			}
			return callback(null, result);
		});
	},
};
