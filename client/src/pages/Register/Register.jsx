import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

import axios from "../../axios";
import Header from "../Header/Header";
import "./Register.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { Form } from "react-bootstrap";


const SignUp = () => {
	const [userData, setuserData] = useContext(UserContext);
	const [form, setform] = useState({});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const navigate = useNavigate();
	const handleChange = (e) => {
		setform({ ...form, [e.target.name]: e.target.value });
	};
	const passwordchange = () => {
		setPasswordVisible((Prev) => !Prev);
	};

	console.log(userData);
	console.log(form);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/users", form);
			alert("Successfully signed up! Please log in with your new account.");
			navigate("/login");
			// const loginRes = await axios.post(
			// 	"http://localhost:4500/api/users/login",
			// 	{ email: form.email, password: form.password }
			// );
			// setuserData({
			// 	token: loginRes.data.token,
			// 	user: loginRes.data.user,
			// });
			// localStorage.setItem("auth-token", loginRes.data.token);
			// navigate("/login");
		} catch (error) {
			console.log("problem", error.response.data.msg);
			alert(error.response.data.msg);
		}
	};
	return (
		<>
			
			<div>
				<div className="sign-up-container  col-md">
					<h3>Register</h3>
					<p>
						Already have an account? {""}
						<span
							onClick={() => {
								navigate("/login");
							}}
							style={{
								color: "orange",
								cursor: "pointer",
							}}
						>
							Sign in
						</span>
					</p>

					<form onSubmit={handleSubmit}>
						<div className="row"></div>
						<Form.Group controlId="userName">
							<Form.Control
								type="text "
								className="hakimm py-2 mt-2 form-control"
								name="userName"
								placeholder="User Name"
								onChange={handleChange}
								required
							/>
						</Form.Group>
						<br />

						<Form.Group controlId="password">
							<span onClick={passwordchange}>
								{" "}
								<input
									type={passwordVisible ? "text" : "password"}
									className="p-2 mt-1 form-control"
									name="password"
									placeholder="Password"
									onChange={handleChange}
								/>{" "}
								<i
									style={{
										position: "relative",
										top: "-35px",
										left: "85%",
										cursor: "pointer",
									}}
								>
									{passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
								</i>
							</span>
						</Form.Group>

						<button
							onSubmit={handleSubmit}
							variant="primary"
							type="submit"
							className="mt-5c register"
						>
							Register
						</button>
					</form>
					<Link to="/login" className="color_orange">
						{" "}
						Already have an account?{" "}
					</Link>
				</div>
			</div>
		
		</>
	);
};

export default SignUp;
