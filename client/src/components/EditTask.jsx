import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
function EditTask() {
	const { id } = useParams();
	const inputDom = useRef(null);
	const checkBoxDom = useRef(null);

	const [task, setTask] = useState([]);
	console.log(task)
	useEffect(() => {
		fetchTask();
	}, []);

	// fetch all task
	async function fetchTask() {
		try {
			const { data } = await axios(`http://localhost:5000/task/${id}`);
			const toBeEdited=data.result
			setTask(data.result);
			console.log(toBeEdited);
			if (data.result.length > 0) {
				inputDom.current.value = toBeEdited[0].task_name;
				checkBoxDom.current.checked = toBeEdited[0].completed;
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	// edit functionality
//------------------------------------------
	
	async function handleFormSubmit(e) {
		e.preventDefault();
		const updatedName = inputDom.current.value;
		const updatedCompleted = checkBoxDom.current.checked;

		try {
			await axios.patch(`http://localhost:5000/task/${id}`, {
				name: updatedName,
				completed: updatedCompleted,
			});
			console.log("Task updated successfully");
			// Redirect or show a success message
		} catch (error) {
			console.log(error.message);
			// Handle error: display an error message to the user
		}
	}
	//--------------------------------------------------------------

	return (
		<>
			<div className="container">
				<form className="single-task-form" onSubmit={handleFormSubmit}>
					<h4 >Edit Task</h4>
					<div className="form-control">
						<label>Task ID</label>
						<p className="task-edit-id">{id}</p>
					</div>
					<div className="form-control">
						<label htmlFor="name">Name</label>
						<input
							ref={inputDom}
							type="text"
							name="name"
							className="task-edit-name"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="completed">completed</label>
						<input
							ref={checkBoxDom}
							type="checkbox"
							name="completed"
							className="task-edit-completed"
						/>
					</div>
					<button type="submit" className="block btn task-edit-btn">
						edit
					</button>
					<div className="form-alert"></div>
				</form>
				<Link to="/" className="btn back-link">
					back to tasks
				</Link>
			</div>
		</>
	);
}


export default EditTask;

