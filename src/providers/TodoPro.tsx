"use client";
import { Todo, newTodo } from "@/lib/dizzle";
import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { TodoContext } from "./TodoTs";

type Props = { children: ReactNode };

const Todos = createContext<TodoContext>({} as TodoContext);

export default function TodoPro({ children }: Props) {
  const [userInputs, setUserInputs] = useState<newTodo>({
    task: "",
    status: false,
  });
  const [list, setList] = useState<Todo[]>([]);

  // initial input states
  const initialState = useCallback(
    () =>
      setUserInputs({
        task: "",
        status: false,
      }),
    []
  );

  const handleChangeInputs = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setUserInputs({
        ...userInputs,
        [name]: name === "status" ? value === "done" : value,
      });
    },
    []
  );

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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

        const result = await responce.json();
        toast.success(result.message);
        initialState();
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  // edit id
  const [editID, setEditID] = useState<number>();

  // update
  const [updateBtn, setUpdateBtn] = useState<boolean>(false);

  // handle Reset
  const handleReset = useCallback(() => initialState(), []);

  //   handle edit
  const handleEdit = useCallback((id: number) => {
    let listClone = list.slice();
    const match = listClone.findIndex((item) => item.id === id);
    setUpdateBtn(true);
    setEditID(id);
    setUserInputs({
      task: listClone[match].task,
      status: listClone[match].status,
    });
  }, []);

  // get all todos
  const getAllTodos = useCallback(async () => {
    try {
      const responce = await fetch("/api/todos", {
        method: "GET",
        mode: "same-origin",
      });
      const result: { data: Todo[] } = await responce.json();
      console.log(result.data);
      setList(result.data);
    } catch (error) {
      console.log("🚀  getAllTodos  error:", error);
    }
  }, []);

  // handle update
  const handleUpdate = useCallback(async (id: number) => {
    try {
      const responce = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
        mode: "same-origin",
      });
      const result = await responce.json();
      toast.success(result.message);
      setUpdateBtn(false);
      initialState();
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    }
  }, []);

  // handle delete
  const handleDelete = useCallback(async (id: number) => {
    try {
      const responce = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        mode: "same-origin",
      });
      const result = await responce.json();
      toast.success(result.message);
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    }
  }, []);

  //   clear all data
  const handleClearAll = async () => {
    try {
      const responce = await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await responce.json();
      toast.success(result.message);
    } catch (error) {
      console.log("🚀  handleDelete  error:", error);
    }
  };

  useEffect(() => {
    getAllTodos();
    return () => {};
  }, [handleFormSubmit, handleUpdate, handleDelete]);

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
