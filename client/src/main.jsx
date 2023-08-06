

import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";

const authToken = localStorage.getItem("authtoken");
const initialUserData = authToken
	? { user: undefined, token: authToken }
	: { user: undefined, token: undefined };


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserProvider value={initialUserData}>
			<App />
		</UserProvider>
	</React.StrictMode>
);
