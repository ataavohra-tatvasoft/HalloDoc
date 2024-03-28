import { any } from "joi";
import { Optional } from "sequelize";


export interface ShiftsAttributes {
  shift_id: number;
  user_id: number;
  region: string;
  physician: string;
  status: string;
  shift_date: Date;
  start: any;
  end: any;
  repeat_end: string;
  repeat_days: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ShiftsCreationAttributes
  extends Optional<
    ShiftsAttributes,
    | "shift_id"
    | "user_id"
    | "region"
    | "physician"
    | "status"
    | "shift_date"
    | "start"
    | "end"
    | "repeat_end"
    | "repeat_days"
    | "createdAt"
    | "updatedAt"
  > {}
