import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import Header from "../Header/Header";
import { UserContext } from "../../context/UserContext";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./Login.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Footer from "../Footer/Footer";

const Login = () => {
	const [userData, setUserData] = useContext(UserContext);
	const navigate = useNavigate();
	const [form, setForm] = useState({});
	const [passwordVisible, setPasswordVisible] = useState(false);
	// console.log(userData)

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const loginRes = await axios.post("/users/login", {
				userName: form.userName,
				password: form.password,
			});

			setUserData({
				token: loginRes.data.token,
				user: loginRes.data.user,
			});

			localStorage.setItem("authtoken", loginRes.data.token);
			navigate("/");
		} catch (error) {
			console.log("Error:", error.response.data.msg);
			alert(error.response.data.msg);
		}
	};

	useEffect(() => {
		if (userData.user) navigate("/");
	}, []);


	const passwordchange = () => {
		setPasswordVisible(!passwordVisible);
	};

	return (
		<>
			<section>
				<Container>
					<Row>
						<Col>
							<div className="login_container  pt-4 shadow">
								<div className="text-center px-md-1 px-sm-3 mx-md-3">
									<h5>Login to your Account</h5>
									<p>
										Don't have an account?{" "}
										<div>
											<Link
												to="/signup"
												style={{
													color: "orange",
													cursor: "pointer",
												}}
											>
												Create a new Account here
											</Link>
										</div>
									</p>
								</div>

								<form onSubmit={handleSubmit}>
									<input
										type="text"
										className="form-control"
										name="userName"
										placeholder="User Name "
										onChange={handleChange}
									/>{" "}
									<br />
									<span >
										{" "}
										<input
											type={passwordVisible ? "text" : "password"}
											className="p-2 mt-1 form-control"
											name="password"
											placeholder="Password"
											onChange={handleChange}
										/>{" "}
										<i
											onClick={passwordchange}
											style={{
												position: "relative",
												top: "-35px",
												left: "85%",
												cursor: "pointer",
											}}
										>
											{passwordVisible ? (
												<VisibilityIcon />
											) : (
												<VisibilityOffIcon />
											)}
										</i>
									</span>
									<br />
									<button type="submit" className="mt-5c signIn">
										Log In
									</button>
								</form>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default Login;
