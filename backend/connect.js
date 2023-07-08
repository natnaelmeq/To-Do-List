
const mysql = require("mysql2");

const pool = mysql.createPool({
	user: process.env.USER,
	host: "srv699.hstgr.io",
	database: process.env.DB,
	password: process.env.PASSWORD,
	connectionLimit: 10,
});

pool.getConnection((err, connection) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log("Connected to MySQL database");
		// Perform queries using the connection object
	}
});
module.exports = pool;

