import { sql } from "@vercel/postgres";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const todoTable = pgTable("tododata", {
  id: serial("id").primaryKey(),
  task: varchar("task", { length: 255 }).notNull(),
  status: boolean("status"),
});

export type Todo = InferSelectModel<typeof todoTable>;
export type newTodo = InferInsertModel<typeof todoTable>;
export const db = drizzle(sql);
