const pool = require("../../config/database.jsx");

module.exports = {
	register: (data, callback) => {
		pool.query(
			"INSERT INTO user(user_name,user_password) VALUES (?, ?)",
			[data.userName, data.password],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result);
			}
		);
	},

	userById: (id, callback) => {
		pool.query(
			"SELECT user.user_id, user_name FROM user  WHERE user.user_id = ?",
			[id],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result[0]);
			}
		);
	},

	getUserByuserName: (userName, callback) => {
		pool.query(
			"SELECT * FROM user WHERE user_name = ?",
			[userName],
			(err, result) => {
				if (err) {
					return callback(err);
				}
				return callback(null, result[0]);
			}
		);
	},

	getAllUsers: (callback) => {
		pool.query("SELECT * FROM user", [], (err, result) => {
			if (err) {
				return callback(err);
			}
			return callback(null, result);
		});
	},
};
