import {
  Table,
  Column,
  DataType,
  Model,
} from "sequelize-typescript";
import {
  RequestorCreationAttributes,
  RequestorAttributes,
} from "../../interfaces/requestor";

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
  mobile_number: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  house_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  street: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  state: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  zip: number;
}
