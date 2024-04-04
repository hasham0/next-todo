import { Todo, newTodo } from "@/lib/dizzle";
import { ChangeEvent, FormEvent } from "react";

type TodoContext = {
  userInputs: newTodo;
  list: Todo[];
  editID: number | undefined;
  updateBtn: boolean;
  handleUpdate: (id: number) => void;
  handleDelete: (id: number) => void;
  handleReset: () => void;
  handleEdit: (id: number) => void;
  handleClearAll: () => void;
  handleChangeInputs: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleFormSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type { TodoContext };
