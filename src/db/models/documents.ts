import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import {
  DocumentsAttributes,
  DocumentsCreationAttributes,
} from "../../interfaces";
import { RequestModel } from "./request";
import { User } from "./user";

@Table({ timestamps: true, tableName: "documents" })
export class Documents extends Model<
  DocumentsAttributes,
  DocumentsCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  request_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
  })
  user_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  document_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  uploader: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  document_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  document_path: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @BelongsTo(() => RequestModel, {
    foreignKey: "request_id",
    targetKey: "request_id",
  })
  Request: RequestModel;

  @BelongsTo(() => User, {
    foreignKey: "user_id",
    targetKey: "user_id",
  })
  User: User;
}
