import { Table, Column, DataType, Model } from "sequelize-typescript";
import {
  ProfessionAttributes,
  ProfessionCreationAttributes,
} from "../../interfaces/profession_model";
@Table({ timestamps: true, tableName: "profession" })
export default class Profession extends Model<ProfessionAttributes, ProfessionCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  },)
  profession_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  },)
  profession_name: string;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
