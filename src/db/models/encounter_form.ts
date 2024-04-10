import {
  Table,
  Column,
  DataType,
  Model,
  BelongsTo,
} from "sequelize-typescript";
import {
  EncounterFormAttributes,
  EncounterFormCreationAttributes,
} from "../../interfaces/encounter_form";
import Request from "./request";


@Table({ timestamps: true, tableName: "encounter-form" })
export default class EncounterForm extends Model<
  EncounterFormAttributes,
  EncounterFormCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  form_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  request_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  location: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    unique: true,
  })
  date_of_birth: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    unique: true,
  })
  date_of_service: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    unique: true,
  })
  phone_no: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  history_of_present: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  medical_history: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  medications: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  allergies: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  temperature: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  heart_rate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  respiratory_rate: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  blood_pressure: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    unique: true,
  })
  o2: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  pain: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  heent: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  cv: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  chest: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  abd: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  extr: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  skin: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  neuro: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  other: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  diagnosis: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  treatment_plan: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  medication_dispensed: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  procedures: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  follow_up: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  finalize: string;

  @BelongsTo(() => Request, {
    foreignKey: "request_id",
    targetKey: "request_id",
  })
  Request: Request;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}
