import sequelize from "../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class Provider extends Model<
  InferAttributes<Provider>,
  InferCreationAttributes<Provider>
> {
  declare provider_id: CreationOptional<number>;
  declare email: string;
  declare password: string;
  declare firstname: string;
  declare lastname: string;
  declare role: string;
  declare mobile_no: number;
  declare medical_licence: string;
  declare NPI_no: number;
  declare address_1: string;
  declare address_2: string | null;
  declare region: string;
  declare city: string;
  declare state: string;
  declare country_code: string;
  declare zip: number;
  declare alternative_mobile_no: number;
  declare business_name: string;
  declare business_website: string;
  declare on_call_status: string;
  declare reset_token: string | null;
  declare reset_token_expiry: number | null;
  declare scheduled_status: CreationOptional<string>;
  declare support_message: CreationOptional<string>;
}

Provider.init(
  {
    provider_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("physician"), allowNull: false },
    mobile_no: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    medical_licence: { type: DataTypes.STRING, allowNull: false },
    NPI_no: { type: DataTypes.INTEGER, allowNull: false },
    address_1: { type: DataTypes.STRING, allowNull: false },
    address_2: { type: DataTypes.STRING, allowNull: true },
    region: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    country_code: { type: DataTypes.STRING, allowNull: false },
    zip: { type: DataTypes.INTEGER, allowNull: false },
    alternative_mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },
    // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
    business_name: { type: DataTypes.STRING, allowNull: false },
    business_website: { type: DataTypes.STRING, allowNull: false },
    on_call_status: { type: DataTypes.STRING, allowNull: false },
    reset_token: { type: DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: DataTypes.BIGINT, allowNull: true },
    scheduled_status: { type: DataTypes.ENUM("yes", "no"), defaultValue: "no" },
    support_message: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: "provider",
  }
);

export default Provider;
