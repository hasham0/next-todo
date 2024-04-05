"use client";
import { Todo, newTodo } from "@/lib/dizzle";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { TodoContext, responceTS } from "./TodoTs";

type Props = { children: ReactNode };

const Todos = createContext<TodoContext>({} as TodoContext);

export default function TodoPro({ children }: Props) {
  /* <!-- user todo inputs --> */
  const [userInputs, setUserInputs] = useState<newTodo>({
    task: "",
    status: false,
  });

  /* <!-- list array --> */
  const [list, setList] = useState<Todo[]>([]);

  /* <!--  initial input states  --> */
  const initialState = () =>
    setUserInputs({
      task: "",
      status: false,
    });

  /* <!-- change handler --> */
  const handleChangeInputs = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setUserInputs({
      ...userInputs,
      [name]: name === "status" ? value === "done" : value,
    });
  };

  /* <!-- form submit handler --> */
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const responce = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
        mode: "same-origin",
      });
      const result: responceTS = await responce.json();
      toast.success(result.message);
      const todos = JSON.parse(localStorage.getItem("TodoValues")!);
      if (todos.length <= 0) {
        localStorage.setItem("TodoValues", JSON.stringify(result.data));
        setList(result.data);
      } else {
        const newData = todos.slice();
        newData.push(result.data[0]);
        localStorage.setItem("TodoValues", JSON.stringify(newData));
        setList(newData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      initialState();
    }
  };

  /* <!-- todo edit index --> */
  const [editID, setEditID] = useState<number>();

  /* <!-- update button --> */
  const [updateBtn, setUpdateBtn] = useState<boolean>(false);

  /* <!-- reset handler  --> */
  const handleReset = () => initialState();

  /* <!-- edit handler --> */
  const handleEdit = (id: number) => {
    if (list) {
      let listClone = list.slice();
      const match = listClone.findIndex((item) => item.id === id);
      setUpdateBtn(true);
      setEditID(id);
      setUserInputs({
        task: listClone[match].task,
        status: listClone[match].status,
      });
    }
  };

  /* <!-- get all todos handler --> */
  const getAllTodos = async () => {
    try {
      const todos = JSON.parse(localStorage.getItem("TodoValues")!);
      if (todos.length >= 1) {
        setList(todos);
      } else {
        const responce = await fetch("/api/todos", {
          method: "GET",
          mode: "same-origin",
        });
        const result: responceTS = await responce.json();
        setList(result.data);
        return localStorage.setItem("TodoValues", JSON.stringify(result.data));
      }
    } catch (error) {
      console.log("🚀  getAllTodos  error:", error);
    }
  };

  /* <!-- update todo handler  --> */
  const handleUpdate = async (id: number) => {
    try {
      if (!userInputs) {
        toast.error("fill all fields");
      }
      const responce = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
        mode: "same-origin",
      });
      const result: { message: string; data: Todo } = await responce.json();
      toast.success(result.message);
      const todos: Todo[] = JSON.parse(localStorage.getItem("TodoValues")!);
      if (todos) {
        const removeTodo = todos.findIndex((item: Todo) => item.id === id);
        todos.splice(Number(removeTodo), 1, result.data);
        setList(todos);
        localStorage.setItem("TodoValues", JSON.stringify(todos));
      }
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    } finally {
      setUpdateBtn(false);
      initialState();
    }
  };

  /* <!-- delete todo handler --> */
  const handleDelete = async (id: number) => {
    try {
      const responce = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        mode: "same-origin",
      });
      const result: responceTS = await responce.json();
      toast.success(result.message);
      const todos = JSON.parse(localStorage.getItem("TodoValues")!);
      if (todos) {
        const updatedTodos = todos.filter((todo: Todo) => todo.id !== id);
        setList(updatedTodos);
        localStorage.setItem("TodoValues", JSON.stringify(updatedTodos));
      }
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    }
  };

  /* <!-- delete all todo handler  --> */
  const handleClearAll = async () => {
    try {
      const responce = await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result: responceTS = await responce.json();
      toast.success(result.message);
      localStorage.setItem("TodoValues", JSON.stringify([]));
      setList([]);
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    }
  };

  //note: call all todos when dom is mount
  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <Todos.Provider
      value={{
        handleClearAll,
        editID,
        handleReset,
        handleDelete,
        handleUpdate,
        list,
        updateBtn,
        handleEdit,
        userInputs,
        handleChangeInputs,
        handleFormSubmit,
      }}
    >
      {children}
    </Todos.Provider>
  );
}

export const useTodo = () => {
  return useContext(Todos);
};
