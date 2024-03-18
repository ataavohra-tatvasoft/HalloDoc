import { any } from "joi";
import { Optional } from "sequelize";

export interface DocumentsAttributes {
  request_id: number;
  user_id: number;
  document_id: number;
  document_name: string;
  document_path: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface DocumentsCreationAttributes
  extends Optional<
    DocumentsAttributes,
    "createdAt" | "updatedAt" | "user_id" | "document_id" | "document_name"
  > {}
