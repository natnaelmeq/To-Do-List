

//----------------------
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Task() {
	const inputDom = useRef(null);
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		fetchTask();
	}, []);

	// Fetch all tasks
	async function fetchTask() {
		try {
			setLoading(true);
			const { data } = await axios.get("http://localhost:5000/all-tasks");
			setTasks(data.result);
			setLoading(false);
			console.log(data.result);
		} catch (error) {
			console.log(error.message);
			setLoading(false);
		}
	}

	// Handle form submission to create a task
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setLoading(true);
			const value = inputDom.current.value;
			const date = selectedDate
				? selectedDate.toISOString().slice(0, 10)
				: null; // Convert date to ISO string format

			if (value) {
				await axios.post("http://localhost:5000/create", {
					name: value,
					date: date, // Set the date value in the request body
				});
				console.log(value);
				console.log(date);
			}

			fetchTask();
			inputDom.current.value = "";
		} catch (error) {
			console.log(error.message);
			setLoading(false);
		}
	}

	// Handle task deletion
	async function handleDelete(id) {
		try {
			setLoading(true);
			await axios.delete(`http://localhost:5000/task/${id}`);
			fetchTask();
			setLoading(false);
			console.log(`Task with id ${id} deleted`);
		} catch (error) {
			setLoading(false);
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="task-form">
				<h4>Todo List</h4>
				<div className="form-control">
				
					<input
						ref={inputDom}
						type="text"
						name="name"
						className="task-input"
						placeholder="e.g. write an email"
					/>
					<div className="form-control">
						<label htmlFor="date"></label>
						<DatePicker
							placeholderText="Date"
							name="date"
							selected={selectedDate}
							onChange={(date) => setSelectedDate(date)}
							className="task-date-input form-control"
						/>
					</div>
					<button type="submit" className="btn submit-btn">
						Add
					</button>
				</div>
				<div className="form-alert"></div>
			</form>

			<section className="tasks-container">
				{loading ? (
					<p className="loading"></p>
				) : (
					<div className="tasks">
						{tasks.map((todo) => (
							<div
								key={todo.id}
								className={`single-task ${
									todo.completed ? "task-completed" : ""
								}`}
							>
								<h5>
									<span>
										<i className="far fa-check-circle"></i>
									</span>
									{todo.task_name}
								</h5>
								<h5>{new Date(todo.date).toLocaleDateString()}</h5>

								<div className="task-links">
									<Link to={`/task/${todo.id}`} className="edit-link">
										<i className="fas fa-edit"></i>
									</Link>

									<button
										onClick={() => {
											handleDelete(todo.id);
										}}
										type="button"
										className="delete-btn"
									>
										<i className="fas fa-trash"></i>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
		</>
	);
}

export default Task;
