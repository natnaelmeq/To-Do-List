import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

function Task() {
	const taskInputRef = useRef(null);
	const memberInputRef = useRef(null);
	const dateInputRef = useRef(null);

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
			const value = taskInputRef.current.value;
			const member = memberInputRef.current.value;
			const date = selectedDate
				? moment(selectedDate).format("YYYY-MM-DD")
				: null; // Format date using Moment.js

			if (value) {
				await axios.post("http://localhost:5000/create", {
					name: value,
					member: member,
					date: date, // Set the date value in the request body
				});
				console.log(value);
				console.log(member);
				console.log(date);
			}

			fetchTask();
			taskInputRef.current.value = "";
			memberInputRef.current.value = "";
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
				<h4>Evangadi Forum Project &#128170; follow-up list &#10084;</h4>
				<div className="form-control">
					<input
						ref={taskInputRef}
						type="text"
						name="name"
						className="task-input"
						placeholder="e.g. create the project"
					/>
					<input
						ref={memberInputRef}
						type="text"
						name="member"
						className="task-input"
						placeholder="e.g. Natnael"
					/>
				</div>

				<div className="form-control">
					<label htmlFor="date">Date Completed</label>
					<DatePicker
						ref={dateInputRef}
						selected={selectedDate}
						onChange={(date) => setSelectedDate(date)}
						className="task-date-input form-control"
						dateFormat="MMMM d, yyyy" // Specify the desired date format
					/>
				</div>
				<button type="submit" className="btn submit-btn">
					Add
				</button>

				<div className="form-alert"></div>
			</form>

			<section className="tasks-container">
				{loading ? (
					<p className="loading"></p>
				) : (
					<div className="tasks">
						{tasks.map((evangadiForum) => (
							<div
								key={evangadiForum.id}
								className={`single-task ${
									evangadiForum.completed ? "task-completed" : ""
								}`}
							>
								<h5>
									{/* <span>
										<i className="far fa-check-circle"></i>
									</span> Task:- */}
									{evangadiForum.task_name}
								</h5>
								<h5>/By:-{evangadiForum.member_name}/</h5>
								<h5 className="date">
									{moment(evangadiForum.date).format("MMMM D, YYYY")}
								</h5>{" "}
								{/* Format date using Moment.js */}
								<div className="task-links">
									<Link to={`/task/${evangadiForum.id}`} className="edit-link">
										<button className="edit">Edit</button>
									</Link>

									<button
										onClick={() => {
											handleDelete(evangadiForum.id);
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
