import { useState, useEffect } from "react";
import "./App.css";
import "./components/card.css";
import { v4 as uuidv4 } from "uuid";
import TextType from "./components/tittleText";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    let todoString = localStorage.getItem("todos");

    if (todoString) {
      let todo_list = JSON.parse(localStorage.getItem("todos"));
      setTodos(todo_list);
    }
  }, []);

  useEffect(() => {
    if (todo.length) {
      saveToLocalStorage(todos);
    }
  }, [todos,todo.length]);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("todos", JSON.stringify(data));
  };

  const handleAdd = () => {
    const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
    setTodos(newTodos);
    setTodo("");
    saveToLocalStorage(newTodos);
  };

  const handleAddByEnter = (e) => {
    if (e.key === "Enter" && todo.length > 2) {
      e.preventDefault();
      handleAdd();
    }
  };

  const toggleShowFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleEdit = (e, id) => {
    const editTodo = todos.filter((i) => i.id === id);
    setTodo(editTodo[0].todo);

    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  const askBeforeDelete = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const newTodos = todos.filter((item) => item.id !== taskToDelete);
    setShowConfirm(false);
    setTaskToDelete(null);
    setTodos(newTodos);

    saveToLocalStorage(newTodos);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  const handleCheckboxChange = (e) => {
    let id = e.target.name;

    let index = todos.findIndex((todo) => {
      return todo.id === id;
    });

    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;

    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  return (
    <>
      <div className="tittle w-full h-[10vh] text-4xl font-bold flex justify-center items-center">
        <TextType
          text={["iTask", "Task Manager", "For your all tasks !"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          className="text-black"
        />
      </div>
      <div className="main-container relative min-h-[90vh] max-h-max py-8 ">
        <div className="box w-[75vw] min-h-[100%] max-h-max mx-auto py-2 rounded-4xl">
          <div className="content flex flex-col px-5 mt-5 gap-3">
            <div className="add-todo text-(--text-color) text-[20px] font-bold">
              Add a Todo
            </div>
            <div className="inputGroup flex gap-10">
              <input
                onChange={handleChange}
                onKeyDown={handleAddByEnter}
                value={todo}
                type="text"
                name="task-name"
                required
              />
              <label htmlFor="name">Add Task</label>
              <button
                className="text-(--text-color) border-2 border-red-600"
                onClick={handleAdd}
                disabled={todo.length < 2}
              >
                Save
              </button>
            </div>

            <hr />

            <div className="task-filter flex gap-8 items-center">
              <div className="text-(--text-color) text-[25px] max-sm:text-[20px] font-bold">
                Your Todos
              </div>

              <label className="ios-checkbox red flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={toggleShowFinished}
                  checked={showFinished}
                />
                <div className="checkbox-wrapper scale-[0.8]">
                  <div className="checkbox-bg"></div>
                  <svg
                    className="checkbox-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      className="check-path"
                      d="M4 12L10 18L20 6"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
                <div className="text-(--text-color) text-[18px] font-bold">
                  Show Finished
                </div>
              </label>
            </div>

            <div className="cards flex flex-col gap-8 my-5">
              {todos.length === 0 && (
                <div className="mx-auto text-(--text-color) text-[16px] font-bold">
                  No tasks to show
                </div>
              )}
              {todos
                .slice()
                .reverse()
                .map((item) => {
                  return (
                    (showFinished || !item.isCompleted) && (
                      <div
                        key={item.id}
                        className="card-cont flex justify-between items-center gap-5"
                      >
                        <label className="custom-checkbox">
                          <input
                            name={item.id}
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={item.isCompleted}
                            value={item.isCompleted}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <div
                          className={`card w-[80%] bg-[#c6c6c6] px-4 py-2 rounded-xl first-cap ${
                            item.isCompleted ? "line-through opacity-50" : ""
                          }`}
                        >
                          {item.todo}
                        </div>
                        <div className="buttons flex gap-5">
                          <button
                            className="button"
                            onClick={(e) => handleEdit(e, item.id)}
                          >
                            <div className="button-outer">
                              <div className="button-inner">
                                <span>Edit</span>
                              </div>
                            </div>
                          </button>
                          <button
                            className="button"
                            onClick={() => {
                              askBeforeDelete(item.id);
                            }}
                          >
                            <div className="button-outer">
                              <div className="button-inner">
                                <span>Delete</span>
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )
                  );
                })}
            </div>

            {showConfirm && (
              <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
                <div className="dg-box">
                  <div className="dg-box-content">
                    <p className="dg-box-heading">Are you sure?</p>
                    <p className="dg-box-description">
                      Do you really want to delete this task?
                    </p>
                  </div>
                  <div className="dg-box-button-wrapper">
                    <button
                      className="dg-box-button secondary"
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                    <button
                      className="dg-box-button primary"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
