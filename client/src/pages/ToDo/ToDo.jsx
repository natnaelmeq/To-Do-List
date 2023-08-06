import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "../../axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import { UserContext } from "../../context/UserContext";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "./Todo.css";

const ToDo = () => {
	const [userData, setUserData] = useContext(UserContext);
	const [todoList, setTodoList] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [loading, setLoading] = useState(true);
	const todoInputRef = useRef(null);
	const noteInputRef = useRef(null);
	const dateInputRef = useRef(null);
	const { id } = useParams();
	const navigate = useNavigate();
	console.log(todoList);

	useEffect(() => {
		if (!userData.user) navigate("/login");
	}, [userData.user, navigate]);
	const gettoken = localStorage.getItem("authtoken");
	console.log(userData.user.id);

	useEffect(() => {
		fetchToDoList();
	}, []);
	const fetchToDoList = async () => {
		const userId = userData?.user?.id;
		console.log(userId);
		try {
			setLoading(true);
			const response = await axios.get(`/todo/allTask/${userId}`);
			const data = response.data.data;
			console.log(data);
			setTodoList(data);
			setLoading(false);
		} catch (error) {
			console.log("Error:", error);
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const todo = todoInputRef.current.value;
			const note = noteInputRef.current.value;
			const date = selectedDate
				? moment(selectedDate).format("YYYY-MM-DD")
				: null;
			if (!todo) {
				alert("Please enter a todo task.");
				setLoading(false);
				return;
			}
			if (todo) {
				await axios.post(
					`/todo`,
					{
						todoTask: todo,
						note: note,
						date: date,
						userId: userData?.user?.id,
					},
					{
						headers: { Authorization: `Bearer ${gettoken}` },
					}
				);
			}

			fetchToDoList();
			todoInputRef.current.value = "";
			noteInputRef.current.value = "";
			setLoading(false);

			alert("Your new 'todo'sucessfully added");
		} catch (error) {
			console.log("Error:", error.msg);
		}
	};

	async function handleDelete(id) {
		try {
			const confirmed = window.confirm(
				"Are you sure you want to delete this task?"
			);

			if (confirmed) {
				await axios.delete(`/todo/task/${id}`);
				fetchToDoList();
				console.log(`Task with id ${id} deleted`);
			} else {
				console.log("Deletion canceled by the user");
			}
		} catch (error) {
			console.log("Error deleting task:", error);
		}
	}

	return (
		<> <br /><br /><br /><i className="welcome">Welcome :- {userData.user?.display_name} &#10084;</i>
			<form onSubmit={handleSubmit} className="task-form">
				<h4>To-do List </h4>
				
				<div className="form-control">
					<input
						ref={todoInputRef}
						type="text"
						name="task"
						className="task-input"
						placeholder="e.g. Deploy Evangadi Project "
					/>
					<input
						ref={noteInputRef}
						type="text"
						name="remark"
						className="task-input"
						placeholder="e.g. Remark/note"
					/>
				</div>
				<br />
				<div className="date">
					<label htmlFor="date">Date</label>
					<DatePicker
						name="date"
						// ref={dateInputRef}
						selected={selectedDate}
						onChange={(date) => setSelectedDate(date)}
						dateFormat="MMMM d, yyyy"
					/>
				</div>{" "}
				<br />
				<button type="submit" className="btn submit-btn">
					Add
				</button>
				<div className="form-alert"></div>
			</form>
			<section className="tasks-container">
				<div className="tasks">
					{todoList.length > 0 ? (
						todoList.map((singleTask) => (
							<div
								key={singleTask.todo_id}
								className={`single-task ${
									singleTask.completed ? "task-completed" : ""
								}`}
							>
								<p style={{ fontSize: "16px" }}>{singleTask.todoTask}</p>
								<p style={{ fontSize: "12px" }}>/{singleTask.note}/</p>
								<p className="date">
									{moment(singleTask.date).format("MMMM D, YYYY")}
								</p>

								<div className="task-links">
									<Link
										to={`/task/${singleTask.todo_id}`}
										className="edit-link"
									>
										<button className="edit">Edit</button>
									</Link>

									<button
										onClick={() => {
											handleDelete(singleTask.todo_id);
										}}
										type="button"
										className="delete-btn"
									>
										<i className="fas fa-trash"></i>
									</button>
								</div>
							</div>
						))
					) : (
						<h5 className="text-center">No To-Do submitted yet.</h5>
					)}
				</div>
			</section>
			;
		</>
	);
};

export default ToDo;
