import {
  Table,
  Column,
  DataType,
  Model,
} from "sequelize-typescript";
import {
  RequestorCreationAttributes,
  RequestorAttributes,
} from "../../interfaces/requestor_model";

@Table({
  timestamps: true,
  tableName: "requestor"
})
export default class Requestor extends Model<
  RequestorCreationAttributes,
  RequestorAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  last_name: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  mobile_number: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  house_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  zip: number;
}
