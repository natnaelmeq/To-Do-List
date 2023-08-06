import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "../../axios";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../context/UserContext";

function EditToDo() {
	const [userData, setUserData] = useContext(UserContext);
	const { id } = useParams();
	const todoDom = useRef(null);
	const noteDom = useRef(null);
	const dateDom = useRef(null);
	const checkBoxDom = useRef(null);

	const [toBeEdited, setToBeEdited] = useState(null);

	useEffect(() => {
		fetchTodo();
	}, []);

	async function fetchTodo() {
		try {
			const response = await axios.get(
				`/todo/task/${id}`
			);
			
			const todoData = response.data.data;
			setToBeEdited(todoData); 
			console.log(todoData);
			if (todoData) {
				todoDom.current.value = todoData.todoTask;
				noteDom.current.value = todoData.note;
				dateDom.current.value = moment(todoData.date).format("YYYY-MM-DD");
				checkBoxDom.current.checked = todoData.completed;
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleFormSubmit(e) {
		e.preventDefault();
		const updatedtodo = todoDom.current.value;
		const updatednote = noteDom.current.value;
		const updatedDate = dateDom.current.value;
		const updatedCompleted = checkBoxDom.current.checked;

		try {
			await axios.patch(`http://localhost:4600/api/todo/task/${id}`, {
				todoTask: updatedtodo,
				note: updatednote,
				date: updatedDate,
				completed: updatedCompleted,
			});
			alert("Todo successfully updated");
			// Redirect or show a success message
		} catch (error) {
			console.log(error.message);
			// Handle error: display an error message to the user
		}
	}

	return (
		<>
			{" "}
			<br />
			<br />
			<br />
			<i className="welcome">
				Welcome :- {userData.user?.display_name} &#10084;
			</i>
			<div className="container">
				<form className="single-task-form" onSubmit={handleFormSubmit}>
					<h4>Edit My To-do list</h4>
					<div className="form-control">
						<label>ToDo ID</label>
						<p className="task-edit-id">{id}</p>
					</div>
					<div className="form-control">
						<label htmlFor="name">ToDo:</label>
						<input
							ref={todoDom}
							type="text"
							name="name"
							className="task-edit-name"
							defaultValue={toBeEdited ? toBeEdited.todoTask : ""}
						/>
					</div>
					<div className="form-control">
						<label htmlFor="name">Note/Remark:</label>
						<input
							ref={noteDom}
							type="text"
							name="member"
							className="task-edit-name"
							defaultValue={toBeEdited ? toBeEdited.note : ""}
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
				<Link to="/" className="btn back-link mb-5">
					Back to To Do List
				</Link>
			</div>
		</>
	);
}

export default EditToDo;
