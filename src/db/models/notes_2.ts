import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import {
  NotesAttributes,
  NotesCreationAttributes,
} from "../../interfaces/notes_model";
import Request from "./request_2";

@Table({ timestamps: true, tableName: "notes" })
export default class Notes extends Model<NotesAttributes, NotesCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  requestId: number;

  @BelongsTo(() => Request, {
    foreignKey: "requestId",
    targetKey: "request_id",
  })
  request: Request; // Optional association for Request

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  noteId: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  physician_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reason: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM(
      "transfer_notes",
      "admin_notes",
      "physician_notes",
      "patient_notes",
      "admin_cancellation_notes",
      "physician_cancellation_notes",
      "patient_cancellation_notes"
    ),
    allowNull: false,
  })
  typeOfNote: string;
}
