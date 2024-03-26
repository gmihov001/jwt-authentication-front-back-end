import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");


	const login = async (email, password) => {
		const resp = await fetch(`https://urban-space-zebra-7594g7pj7w93r47w-3001.app.github.dev/token`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password })
		})

		if (!resp.ok) throw Error("There was a problem in the login request")

		if (resp.status === 401) {
			throw ("Invalid credentials")
		}
		else if (resp.status === 400) {
			throw ("Invalid email or password format")
		}
		const data = await resp.json()

		localStorage.setItem("jwt-token", data.token);

		actions.logIn(data);

		return data;

	}

	const getUser = async () => {
		// Retrieve token from localStorage
		const token = localStorage.getItem('jwt-token');

		const resp = await fetch(`https://urban-space-zebra-7594g7pj7w93r47w-3001.app.github.dev/users/get/current`, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
			}
		});

		// if (!resp.ok) {
		// 	throw Error("There was a problem in the login request")
		// } else if (resp.status === 403) {
		// 	throw Error("Missing or invalid token");
		// } else {
		// 	throw Error("Unknown error");
		// }

		const data = await resp.json();
		console.log("This is the data you requested", data);
		return data
	}

	return (
		<div className="text-center mt-5">
			<h1>JWT Authenticated Log In Page!!</h1>
			<input name="email" onChange={(e) => setEmail(e.target.value)} />
			<input name="password" onChange={(e) => setPassword(e.target.value)} />
			<button onClick={() => login(email, password)} className="btn btn-warning btn-outline-lg">Log In</button>
			<button onClick={() => getUser()} className="btn btn-warning btn-outline-lg">Get User</button>
		</div>
	);
};
