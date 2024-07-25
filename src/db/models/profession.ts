import { Table, Column, DataType, Model } from "sequelize-typescript";
import {
  ProfessionAttributes,
  ProfessionCreationAttributes,
} from "../../interfaces";
@Table({ timestamps: true, tableName: "profession" })
export class Profession extends Model<
  ProfessionAttributes,
  ProfessionCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  profession_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  profession_name: string;
}
