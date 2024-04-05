import { db, todoTable } from "@/lib/dizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type UserIdTS = {
  params: { id: string };
};

export async function PUT(request: NextRequest, userID: UserIdTS) {
  try {
    const updateData = await request.json();
    const { id } = userID.params;
    const updatedUserId: { updatedId: number }[] = await db
      .update(todoTable)
      .set({ task: updateData.task, status: updateData.status })
      .where(eq(todoTable.id, Number(id)))
      .returning({ updatedId: todoTable.id });

    return NextResponse.json({
      message: "todo updated successfully",
      data: { id: updatedUserId[0].updatedId, ...updateData },
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json({
      error: err,
    });
  }
}

export async function DELETE(request: NextRequest, userID: UserIdTS) {
  try {
    const { id } = userID.params;
    const deleteUserId: { deleteID: number }[] = await db
      .delete(todoTable)
      .where(eq(todoTable.id, Number(id)))
      .returning({
        deleteID: todoTable.id,
      });
    return NextResponse.json({
      message: "todo deleted successfully",
      data: deleteUserId,
    });
  } catch (error) {
    const err = (error as { message: string }).message;
    return NextResponse.json({
      error: err,
    });
  }
}
