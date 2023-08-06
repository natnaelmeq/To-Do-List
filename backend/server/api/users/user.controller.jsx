const {
	register,
	userById,
	getUserByuserName,
	getAllUsers,
} = require("./user.service.jsx");
const pool = require("../../config/database.jsx");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();



module.exports = {
	createUser: (req, res) => {
		const { userName, password } = req.body;
		console.log(req.body);
		if (!userName || !password)
			return res
				.status(400)
				.json({ msg: "please complete all fields " });

		if (password.length < 4)
			return res
				.status(400)
				.json({ msg: "Password must be at least 4 characters long." });

		pool.query(
			"SELECT * FROM user WHERE user_name = ?",
			[userName],
			(err, results) => {
				if (err) {
					return res.status(500).json({ msg: "Database connection error" });
				}

				if (results.length > 0) {
					return res
						.status(400)
						.json({ msg: "An account with this user name already exists." });
				} else {
					const salt = bcrypt.genSaltSync();
					const hashedPassword = bcrypt.hashSync(password, salt);
					
					register({ userName, password: hashedPassword }, (err, result) => {
						if (err) {
							console.log(err);
							return res.status(500).json({ msg: "Database connection error" });
						}
						return res
							.status(200)
							.json({ msg: "New user added successfully", data: results });
					});
				}
			}
		);
	},
	getUsers: (req, res) => {
		getAllUsers((err, result) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			return res.status(200).json({ data: result });
		});
	},

	getUserById: (req, res) => {
		userById(req.id, (err, results) => {
			if (err) {
				console.log(err);
				return res.status(500).json({ msg: "database connection err" });
			}
			if (!results) {
				return res.status(404).json({ msg: "Record not found" });
			}
			return res.status(200).json({ data: results });
		});
	},
	login: (req, res) => {
		const { userName, password } = req.body;
		console.log(userName)
		//validation
		if (!userName || !password)
			return res.status(400).json({ msg: "Not all fields have been provided" });
		getUserByuserName(userName, (err, results) => {
			if (err) {
				console.log(err);
				res.status(500).json({ msg: "database connection err" });
			}
			if (!results) {
				return res
					.status(404)
					.json({ msg: "No account with this user name has been registered" });
			}
			const isMatch = bcrypt.compareSync(password, results.user_password);
			if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });
			const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, {
				expiresIn: "3h",
			});
			console.log(token);
			console.log(userName, password);
			// console.log(results)
			return res.json({
				token,
				user: { id: results.user_id, display_name: results.user_name },
			});
		});
	},
};
