import React, { useState } from "react";
import { createUserTodoList, getUserTodoList } from "../functionsApi";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userName !== "") {
      try {
        const response = await getUserTodoList(userName);
        if (response.ok) {
          alert("User already exists. Fetching todo items...");
          const data = await response.json();
          console.log("test");
          navigate(`/TodosPage/${userName}`);
        }
      } catch (error) {
        console.error("Error retrieving todo list:", error);
        console.log("User does not exist. Creating new user...");
        try {
          await createUserTodoList(userName);
          alert("New user created successfully. Now you can add your tasks");
          const response = await getUserTodoList(userName);
          if (response.ok) {
            const data = await response.json();
            console.log("test");
            navigate(`/TodosPage/${userName}`);
          }
        } catch (error) {
          console.error("Error creating new user:", error);
        }
      }
    } else {
      alert("Username can't be empty");
    }
  };

  return (
    <div>
      <form className="homePage" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={handleChange}
          style={{ textAlign: "center" }}
        />
        <button className="submitButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
