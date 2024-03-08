import { any } from "joi";
import { Optional } from "sequelize";

export interface NotesAttributes {
  requestId: number;
  noteId: number;
  physician_name: string;
  reason: string;
  description: string;
  typeOfNote: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface NotesCreationAttributes
  extends Optional<
    NotesAttributes,
    "createdAt" | "updatedAt" | "noteId" | "physician_name" | "reason"
  > {}
