import { useState, useEffect } from "react";
import axios from "axios";

export const useInputValue = (initialValue = "") => {
  const [inputValue, setInputValue] = useState(initialValue);

  return {
    inputValue,
    changeInput: event => setInputValue(event.target.value),
    clearInput: () => setInputValue(""),
    keyInput: (event, callback) => {
      if (event.which === 13 || event.keyCode === 13) {
        callback(inputValue);
        return true;
      }

      return false;
    }
  };
};

export const useTodos = (initialValue = []) => {
  const [todos, setTodos] = useState(initialValue);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get("http://localhost:8080/todo");
      const todos = result.data;
      setTodos(todos);
    };
    fetchData();
  }, []);

  return {
    todos,
    addTodo: text => {
      if (text !== "") {
        axios
          .post("http://localhost:8080/todo", {
            text,
            checked: false
          })
          .then(() => {
            setTodos(
              todos.concat({
                text,
                checked: false
              })
            );
          });
      }
    },
    checkTodo: idx => {
      setTodos(
        todos.map((todo, index) => {
          if (idx === index) {
            todo.checked = !todo.checked;
            axios.patch("http://localhost:8080/todo", {
              id: todo._id,
              checked: todo.checked
            });
          }

          return todo;
        })
      );
    },
    removeTodo: idx => {
      setTodos(
        todos.filter((todo, index) => {
          if (idx === index) {
            axios.delete("http://localhost:8080/todo", {
              data: {
                id: todo._id
              }
            });
            return false;
          } else {
            return true;
          }
        })
      );
    }
  };
};
