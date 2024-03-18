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
} from "../../interfaces/documents_model";
import Request from "./request_2";
import User from "./user_2";

@Table({ timestamps: true, tableName: "documents" })
export default class Documents extends Model<
  DocumentsAttributes,
  DocumentsCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  request_id: number;

  // @BelongsTo(() => Request, {
  //   foreignKey: "request_id",
  //   targetKey: "request_id",
  // })
  // request: Request; // Optional association for Request

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

  @BelongsTo(() => Request, {
    foreignKey: "request_id",
    targetKey: "request_id",
  })
  Request: Request;

  @BelongsTo(() => User, {
    foreignKey: "user_id",
    targetKey: "user_id",
  })
  User: User;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
