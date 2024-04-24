import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import Documents from "./documents";
import Order from "./order";
import Notes from "./notes";
import User from "./user";
import Requestor from "./requestor";
import {
  RequestCreationAttributes,
  RequestAttributes,
} from "../../interfaces/request";
import EncounterForm from "./encounter_form";

@Table({
  timestamps: true,
  tableName: "request",
})
export default class Request extends Model<
  RequestAttributes,
  RequestCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  request_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  confirmation_no: string;

  @Column({
    type: DataType.ENUM(
      "new",
      "active",
      "pending",
      "conclude",
      "toclose",
      "unpaid"
    ),
    allowNull: false,
  })
  request_state: string;

  @Column({
    type: DataType.ENUM(
      "unassigned",
      "assigned",
      "accepted",
      "md_on_route",
      "md_on_site",
      "closed",
      "conclude",
      "blocked",
      "clear",
      "cancelled by admin",
      "cancelled by provider"
    ),
    defaultValue: "unassigned",
    allowNull: false,
  })
  request_status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patient_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  physician_id: number;

  @Column({
    type: DataType.ENUM(
      "family/friend",
      "concierge",
      "business",
      "vip",
      "admin",
      "patient",
      "physician"
    ),
    allowNull: false,
  })
  requested_by: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  relation_with_patient: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  requestor_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  requested_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  concluded_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_of_service: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  closed_date: Date;

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  block_reason: string;

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
    allowNull: false,
  })
  agreement_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  notes_symptoms: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  assign_req_description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  final_report: number;

  @BelongsTo(() => User, {
    as: "Physician",
    foreignKey: "physician_id",
    targetKey: "user_id",
  })
  Physician: User;

  @BelongsTo(() => User, {
    as: "Patient",
    foreignKey: "patient_id",
    targetKey: "user_id",
  })
  Patient: User;

  @BelongsTo(() => Requestor, {
    foreignKey: "requestor_id",
    targetKey: "user_id",
  })
  Requestor: Requestor;

  @HasMany(() => Notes, { foreignKey: "request_id" })
  Notes: Notes[];

  @HasOne(() => Order, { foreignKey: "request_id" })
  Order: Order[];

  @HasOne(() => EncounterForm, { foreignKey: "request_id" })
  EncounterForm: EncounterForm;

  @HasMany(() => Documents, { as: "Documents", foreignKey: "request_id" })
  Documents: Documents[];
  
  // @HasMany(() => User)
  // Patient: User[];

  // @HasMany(() => Requestor)
  // Requestors: Requestor[];
}
