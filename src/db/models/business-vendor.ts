import { Table, Column, DataType, Model } from "sequelize-typescript";
import {
  BusinessAttributes,
  BusinessCreationAttributes,
} from "../../interfaces/business-vendor";

@Table({ timestamps: true, tableName: "business-vendor" })
export default class Business extends Model<
  BusinessAttributes,
  BusinessCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  business_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  business_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  business_website: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profession: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  fax_number: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  mobile_no: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  business_contact: bigint;

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
