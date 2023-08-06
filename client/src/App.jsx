import { useEffect } from "react";
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "./axios";
import { UserContext } from "./context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./pages/Login/Login.jsx";
import Home from "./pages/Home/Home.jsx";

import SignUp from "./pages/Register/Register";

import Footer from "./pages/Footer/Footer.jsx";
import ToDo from "./pages/ToDo/ToDo.jsx";
import EditToDo from "./pages/EditTask/EditToDo";
import Header from "./pages/Header/Header";

function App() {
	const [userData, setuserData] = useContext(UserContext);
	const checkLoggedIN = async () => {
		let token = localStorage.getItem("authtoken");
		console.log("Token from localStorage:", token);
		if (token === null) {
			// localStorage.setItem("auth-token", "");
			token = "";
		} else {
			const userRes = await axios.get("/users", {
				headers: { "x-auth-token": token },
			});
			setuserData({
				token,
				user: {
					id: userRes.data.data.user_id,
					display_name: userRes.data.data.user_name,
				},
			});
		}
	};
	const logout = () => {
		setuserData({
			token: undefined,
			user: undefined,
		});
	};

	localStorage.setItem("auth-token", "");

	useEffect(() => {
		checkLoggedIN();
	}, []);

	return (
		<Router>
			<div>
				<Header/>
				<Routes>
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					{/* <Route path="/question" element={<Question />} /> */}
					<Route path="/allTask" element={<ToDo />} />
					<Route path="/task/:id" element={<EditToDo/>} />

					<Route path="/" element={<Home logout={logout} />} />
				</Routes>
				<Footer/>
			</div>
		</Router>
	);
}

export default App;
