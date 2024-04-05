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
  const [userInputs, setUserInputs] = useState<newTodo>({
    task: "",
    status: false,
  });
  const [list, setList] = useState<Todo[] | null | undefined>([]);

  // initial input states
  const initialState = () =>
    setUserInputs({
      task: "",
      status: false,
    });

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

  // edit id
  const [editID, setEditID] = useState<number>();

  // update
  const [updateBtn, setUpdateBtn] = useState<boolean>(false);

  // handle Reset
  const handleReset = () => initialState();

  //   handle edit
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

  // get all todos
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

  // handle update
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
      console.log("🚀  handleUpdate  result:", result);
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

  // handle delete
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

  useEffect(() => {
    getAllTodos();
  }, [setList]);

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
