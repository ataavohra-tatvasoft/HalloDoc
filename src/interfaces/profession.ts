import { Optional } from "sequelize";

export interface ProfessionAttributes {
  profession_id: number;
  profession_name: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ProfessionCreationAttributes
  extends Optional<ProfessionAttributes, "createdAt" | "updatedAt"> {}
