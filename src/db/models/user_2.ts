import { Table, Column, DataType, Model } from "sequelize-typescript";

import {
  UserAttributes,
  UserCreationAttributes,
} from "../../interfaces/user_model";

@Table({
  timestamps: true,
  tableName: "user",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
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
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.ENUM("admin", "patient", "provider"),
    allowNull: false,
  })
  type_of_user: string;

  // Common fields
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastname: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  mobile_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reset_token: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  reset_token_expiry: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address_1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address_2: string;

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
    type: DataType.STRING,
    allowNull: true,
  })
  country_code: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  zip: number;

  // Admin-specific fields (Assuming redundant role field is removed from the table)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  billing_mobile_no: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role: string;

  // Patient-specific fields
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dob: Date;

  // Provider-specific fields
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  medical_licence: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  NPI_no: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    unique: true,
  })
  alternative_mobile_no: string;

  // Common attributes between Patient and Provider
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  business_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  street: string;

  // Additional attributes
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tax_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profile_picture: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  business_website: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  on_call_status: string;

  @Column({
    type: DataType.ENUM("yes", "no"),
    defaultValue: "no",
    allowNull: false,
  })
  scheduled_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  support_message: string;
}
