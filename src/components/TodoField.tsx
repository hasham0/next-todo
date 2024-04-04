"use client";
import { Todo } from "@/lib/dizzle";
import List from "./List";
import { useTodo } from "@/providers/TodoPro";

type Props = {};

export default function TodoField({}: Props) {
  const {
    handleChangeInputs,
    handleFormSubmit,
    userInputs,
    list,
    updateBtn,
    handleReset,
    handleClearAll,
    editID,
    handleUpdate,
  } = useTodo();

  return (
    <section>
      {/* todo form */}
      <form
        className="flex flex-col flex-wrap items-center justify-center gap-4 border-4 border-black p-5"
        onSubmit={handleFormSubmit}
      >
        <label htmlFor="todoText">
          <input
            className="border-2 border-black p-1 text-center capitalize"
            type="text"
            required
            name="task"
            placeholder="Enter your todo"
            value={userInputs?.task}
            onChange={handleChangeInputs}
          />
        </label>

        <label
          className="flex flex-col"
          htmlFor="status"
        >
          Choose a Status
          <select
            required
            className="p-2"
            name="status"
            value={userInputs.status ? "done" : "pending"}
            onChange={handleChangeInputs}
          >
            <option value="pending">pending</option>
            <option value="done">done</option>
          </select>
        </label>
        <span>
          {updateBtn ? (
            <button
              className="rounded-lg bg-black p-2 capitalize text-white duration-200 ease-in-out hover:bg-gray-300 hover:text-black"
              type="button"
              onClick={() => {
                console.log(editID);
                if (editID) handleUpdate(editID);
              }}
            >
              update todo
            </button>
          ) : (
            <span className="space-x-5">
              <button
                className="rounded-lg bg-black p-2 capitalize text-white duration-200 ease-in-out hover:bg-gray-300 hover:text-black"
                type="submit"
              >
                add todo
              </button>
              <button
                className="rounded-lg bg-black p-2 capitalize text-white duration-200 ease-in-out hover:bg-gray-300 hover:text-black"
                type="button"
                onClick={() => handleReset()}
              >
                reset
              </button>
            </span>
          )}
        </span>
        <span className="space-x-5">
          <button
            className="rounded-lg bg-black p-2 capitalize text-white duration-200 ease-in-out hover:bg-gray-300 hover:text-black"
            type="button"
            onClick={() => handleClearAll()}
          >
            clear All Data
          </button>
        </span>
      </form>

      {/* list */}
      <div className="m-5 mx-auto flex w-1/2 flex-col border-2 border-black">
        <section className="m-6 flex justify-center">
          <table className="w-full">
            <thead>
              <tr className="border-2 border-red-600 bg-gray-200 uppercase ">
                <th>id</th>
                <th>task</th>
                <th>status</th>
                <th>edit</th>
                <th>delete</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {list &&
                list.map((item: Todo, index: number) => (
                  <List
                    key={index}
                    values={item}
                    myKey={item.id}
                  />
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </section>
  );
}
