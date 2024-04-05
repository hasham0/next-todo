import { NextRequest, NextResponse } from "next/server";
import { Todo, db, newTodo, todoTable } from "@/lib/dizzle";
import { sql } from "@vercel/postgres";

export async function GET(request: NextRequest) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS TodoData(id serial, Task varchar(255), Status boolean)`;

    const allTodos: Todo[] = await db.select().from(todoTable).execute();

    return NextResponse.json({
      data: allTodos,
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json({
      error: err,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userTodo = await request.json();
    const newUserTodo: newTodo = {
      task: userTodo.task,
      status: userTodo.status,
    };
    const newData = await db.insert(todoTable).values(newUserTodo).returning();
    return NextResponse.json({
      message: "todo added successfully",
      data: newData,
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json({
      error: err,
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const deleteAllData = await db.delete(todoTable).returning();
    return NextResponse.json({
      message: "all todo deleted",
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json({
      error: err,
    });
  }
}
