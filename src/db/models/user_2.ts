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
    allowNull: true,
    unique: true,
  })
  username: string;

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
    type: DataType.ENUM("admin", "patient", "provider", "vendor"),
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
  mobile_no: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  reset_token: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  reset_token_expiry: bigint;

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

  @Column({
    type: DataType.ENUM("admin", "patient", "physician", "clinical", "vendor"),
    allowNull: true,
    defaultValue: null,
  })
  role: string;

  // Admin-specific fields
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  billing_mobile_no: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status: string;

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
  alternative_mobile_no: bigint;

  @Column({
    type: DataType.ENUM("yes", "no"),
    allowNull: true,
    defaultValue: "no",
  })
  stop_notification_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  synchronization_email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  admin_notes: string;


  // Vendors-specific fields
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profession: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    unique: true,
  })
  business_contact: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    // unique: true,
  })
  fax_number: number;

  // Common attributes between Patient and Provider
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  street: string;

  //Common attributes between Admin and Provider
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
    defaultValue: 0,
  })
  open_requests: number;

  // Common attributes between Patient and Provider and Vendor
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  business_name: string;

  //Regions of service
  @Column({
    type: DataType.ENUM("yes","no"),
    allowNull: false,
    defaultValue:"no"
  })
  district_of_columbia: string;

  @Column({
    type: DataType.ENUM("yes","no"),
    allowNull: false,
    defaultValue:"no"
  })
  new_york: string;

  @Column({
    type: DataType.ENUM("yes","no"),
    allowNull: false,
    defaultValue:"no"
  })
  virginia: string;

  @Column({
    type: DataType.ENUM("yes","no"),
    allowNull: false,
    defaultValue:"no"
  })
  maryland: string;

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
  business_website: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profile_picture: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  signature_photo: string;

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
