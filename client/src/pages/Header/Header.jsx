import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { UserContext } from "../../context/UserContext";
import "./Header.css"

const Header = () => {
	const [userData, setUserData] = useContext(UserContext);

	const logout = () => {
		setUserData({
			token: undefined,
			user: undefined,
		});
	};

	return (
		<>
			<Navbar fixed="top" />
			<div className="headWrapper fixed-top">
				<nav className="row py-2 mainWrapper text-center mx-auto">
					<Link className="col text-start">
						<h4>My To-Do List</h4>
					</Link>
					<div className="row col text-end">
						<Link to="/login" className="col">
							<button
								onClick={logout}
								className={!userData.user ? "signIn" : "signout"}
							>
								{userData.user ? <p>Log out</p> : <p>Log In</p>}
							</button>
						</Link>
					</div>
				</nav>
			</div>
		</>
	);
};

export default Header;
