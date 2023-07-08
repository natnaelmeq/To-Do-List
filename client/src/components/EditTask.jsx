import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import moment from "moment";

function EditTask() {
	const { id } = useParams();
	const inputDom = useRef(null);
	const memberDom = useRef(null);
	const dateDom = useRef(null);
	const checkBoxDom = useRef(null);

	const [toBeEdited, setToBeEdited] = useState(null);

	useEffect(() => {
		fetchTask();
	}, []);

	async function fetchTask() {
		try {
			const response = await axios.get(`http://localhost:5000/task/${id}`);
			const data = response.data;
			const taskData = data;
			setToBeEdited(taskData); // Set the value of toBeEdited
			console.log(taskData);
			if (taskData.length > 0) {
				inputDom.current.value = taskData[0].task_name;
				memberDom.current.value = taskData[0].member_name;
				dateDom.current.value = moment(taskData[0].date).format("YYYY-MM-DD");
				checkBoxDom.current.checked = taskData[0].completed;
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleFormSubmit(e) {
		e.preventDefault();
		const updatedName = inputDom.current.value;
		const updatedMember = memberDom.current.value;
		const updatedDate = dateDom.current.value;
		const updatedCompleted = checkBoxDom.current.checked;

		try {
			await axios.patch(`http://localhost:5000/task/${id}`, {
				name: updatedName,
				member: updatedMember,
				date: updatedDate,
				completed: updatedCompleted,
			});
			(alert("Thank you , Successfully Updated") );
			// Redirect or show a success message
		} catch (error) {
			console.log(error.message);
			// Handle error: display an error message to the user
		}
	}

	return (
		<>
			<div className="container">
				<form className="single-task-form" onSubmit={handleFormSubmit}>
					<h4>Edit My Todo list</h4>
					<div className="form-control">
						<label>Task ID</label>
						<p className="task-edit-id">{id}</p>
					</div>
					<div className="form-control">
						<label htmlFor="name">Task Name:</label>
						<input
							ref={inputDom}
							type="text"
							name="name"
							className="task-edit-name"
							defaultValue={toBeEdited ? toBeEdited.task_name : ""}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="name">Member:</label>
						<input
							ref={memberDom}
							type="text"
							name="member"
							className="task-edit-name"
							defaultValue={toBeEdited ? toBeEdited.member_name : ""}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="name">Date:</label>
						<input
							ref={dateDom}
							type="date"
							className="task-edit-name"
							defaultValue={
								toBeEdited ? moment(toBeEdited.date).format("YYYY-MM-DD") : ""
							}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="completed">Completed</label>
						<input
							ref={checkBoxDom}
							type="checkbox"
							name="completed"
							className="task-edit-completed"
							defaultChecked={toBeEdited ? toBeEdited.completed : false}
						/>
					</div>
					<button type="submit" className="block btn task-edit-btn">
						Edit
					</button>
					<div className="form-alert"></div>
				</form>
				<Link to="/" className="btn back-link">
					Back to tasks
				</Link>
			</div>
		</>
	);
}

export default EditTask;
