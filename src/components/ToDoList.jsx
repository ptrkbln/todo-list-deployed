import React from "react";
import { useState, useReducer, useEffect } from "react";
import ToDoItem from "./ToDoItem";

const initialValue = [];

export default function ToDoList() {
  const [inputValue, setInputValue] = useState("");
  const [completedTodos, setCompletedTodos] = useState(0);
  const [todos, dispatch] = useReducer(reducer, initialValue);
  console.log(todos);

  function reducer(state, action) {
    switch (action.type) {
      case "ADD_TODO":
        return [
          /* everything returned is our new state (todos) */ ...state,
          {
            text: action.payload,
            id: crypto.randomUUID() /* id and completed could also go to payload (as another object within payload) in line 29 (dispatch function) */,
            completed: false,
          } /* text: inputValue would also work in this case, but it wouldnt work if the reducer were in a different file*/,
        ];
      case "TOGGLE_TODO":
        return state.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        );
      case "DELETE_TODO":
        return state.filter((todo) => todo.id !== action.payload);

      default:
        return state;
    }
  }

  function handleToggle(idToGive) {
    dispatch({ type: "TOGGLE_TODO", payload: idToGive });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (inputValue.trim()) {
      dispatch({
        /* dispatch contains the action object (action.type, action.payload) */
        type: "ADD_TODO",
        payload: inputValue,
      });
    } /* payload could be skipped in this case */
    setInputValue(
      ""
    ); /* so that we dont need to delete the input field manually */
  }

  function handleClick(id) {
    dispatch({ type: "DELETE_TODO", payload: id });
  }

  useEffect(() => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    setCompletedTodos(completedCount);
  }, [todos]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Todo Liste 📝 </h1>
      <form onSubmit={handleSubmit}>
        {" "}
        {/* also with enter, not just with click (as in case of onClick) */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="   Neues Todo"
        />
        <button className="add-button">Hinzufügen</button>
      </form>
      <ul style={{ listStyleType: "none" }}>
        {todos.map((todo) => (
          <ToDoItem
            todo={todo}
            key={todo.id}
            handleToggle={handleToggle}
            handleClick={handleClick}
          />
        ))}
      </ul>
      <p className="erledigte-p">Erledigte Todos: {completedTodos}</p>
    </div>
  );
}
