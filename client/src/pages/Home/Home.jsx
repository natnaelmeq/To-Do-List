import React, { useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

import "./Home.css";

import ToDo from "../ToDo/ToDo";


const Home = ({ logout }) => {
	const [userData] = useContext(UserContext);
	const navigate = useNavigate();
	
	const isLoggedIn = !!userData.user; 

	useEffect(() => {
		if (!isLoggedIn) navigate("/login");
	}, [isLoggedIn, navigate]);
	const authToken = localStorage.getItem("authtoken");

	return (
		<>
			
			<div>
				{userData.user ? (
					<>
						<ToDo />
					</>
				) : null}
			</div>
		
		</>
	);
};

export default Home;
