import { Todo } from "@/lib/dizzle";
import { useTodo } from "@/providers/TodoPro";
import { PencilIcon, Trash2 } from "lucide-react";
import React from "react";

type Props = {
  values: Todo;
  myKey: number;
};

export default function List({ myKey, values }: Props) {
  const { handleDelete, handleUpdate, handleEdit } = useTodo();

  return (
    <tr
      className={`w-full border-2 border-black text-center ${
        values.status === true ? "bg-green-300" : "bg-red-300"
      }`}
    >
      <td>{myKey}</td>
      <td>{values.task}</td>
      <td>{values.status ? "done" : "pending"}</td>
      <td>
        <button
          className="m-1 rounded-full bg-white p-2 duration-200 ease-out hover:bg-gray-700 hover:text-white"
          onClick={() => handleEdit(values.id)}
        >
          <PencilIcon />
        </button>
      </td>
      <td>
        <button
          className="m-1 rounded-full bg-white p-2 duration-200 ease-out hover:bg-red-700 hover:text-white"
          onClick={() => handleDelete(values.id)}
        >
          <Trash2 />
        </button>
      </td>
    </tr>
  );
}
