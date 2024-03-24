import React, { useState, useEffect } from "react";
import {
  updateUserTodoList,
  deleteUserTodoList,
  getUserTodoList,
} from "../functionsApi";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function TodosPage() {
  const [todoItems, setTodoItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showDeleteAllButton, setShowDeleteAllButton] = useState(false);
  const navigate = useNavigate();

  let { userName } = useParams();

  useEffect(() => {
    const fetchUserTodoList = async () => {
      try {
        const response = await getUserTodoList(userName);
        if (response.ok) {
          const data = await response.json();
          setTodoItems(data); // Set the fetched todo items to state
        } else {
          console.error("Failed to fetch user's todo list");
        }
      } catch (error) {
        console.error("Error fetching user's todo list:", error);
      }
    };

    fetchUserTodoList(); // Call the function to fetch user's todo list
  }, [userName]);

  useEffect(() => {
    // Show delete all button if there are tasks
    setShowDeleteAllButton(todoItems.length > 0);
  }, [todoItems]);

  const handleAddTask = async () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        done: false,
        label: inputValue.trim(),
      };
      setTodoItems([...todoItems, newTask]);
      setInputValue("");

      try {
        await updateUserTodoList(userName, [...todoItems, newTask]);
      } catch (error) {
        console.error("Error updating todo list:", error);
      }
    } else {
      alert("Task can't be empty");
    }
  };

  const handleDeleteTask = async (index) => {
    const updatedTodoItems = [...todoItems];
    updatedTodoItems.splice(index, 1);
    setTodoItems(updatedTodoItems);

    try {
      if (updatedTodoItems.length === 0) {
        // If no tasks remaining, delete user's todo list
        await deleteUserTodoList(userName);
        alert("No more tasks left. User will be deleted");
        navigate("/home"); // Reload the page after deleting the last task
      } else {
        // If tasks remaining, update the todo list
        await updateUserTodoList(userName, updatedTodoItems);
        console.log("Todo list updated successfully.");
      }
    } catch (error) {
      console.error("Error updating/deleting todo list:", error);
    }
  };

  const handleDeleteAllTasks = async () => {
    try {
      await deleteUserTodoList(userName);
      setTodoItems([]);
      alert("No more tasks left, user is going to be deleted");
      navigate("/home"); // Reload the page after deleting all tasks
    } catch (error) {
      console.error("Error deleting all tasks:", error);
    }
  };

  const handleCheckbox = (index) => {
    const updatedTodoItems = [...todoItems];
    updatedTodoItems[index].done = !updatedTodoItems[index].done;
    setTodoItems(updatedTodoItems);

    try {
      // Update the todo list with the new checked/unchecked status
      updateUserTodoList(userName, updatedTodoItems);
      console.log("Todo list updated successfully.");
    } catch (error) {
      console.error("Error updating todo list:", error);
    }
  };

  return (
    <div>
      <button className="homeButton" onClick={() => navigate("/home")}>
        Go Home
      </button>
      <h1>Todos for {userName}</h1>
      <div>
        Tasks left to complete: <strong>{todoItems.length}</strong>
      </div>
      <ul>
        <li>
          <input
            type="text"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            placeholder={
              todoItems.length === 0
                ? "No tasks, add a task"
                : "Type to add more tasks"
            }
          />
        </li>
        {todoItems.map((item, index) => (
          <div className="taskField" key={index}>
            <li>
              <span>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleCheckbox(index)}
                />
              </span>
              <label className={item.done ? "lineThrough" : ""}>
                {item.label}
              </label>
              <i
                className="fas fa-trash"
                onClick={() => handleDeleteTask(index)}
              ></i>
            </li>
          </div>
        ))}
      </ul>
      {showDeleteAllButton && (
        <button className="deleteButton" onClick={handleDeleteAllTasks}>
          Delete All Tasks
        </button>
      )}
    </div>
  );
}
