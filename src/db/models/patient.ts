import sequelize from "../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class Patient extends Model<
  InferAttributes<Patient>,
  InferCreationAttributes<Patient>
> {
  declare patient_id: CreationOptional<number>;
  declare email: string;
  declare password: CreationOptional<string>;
  declare firstname: string;
  declare lastname: string;
  declare dob: Date;
  declare mobile_number: number;
  declare region: CreationOptional<string>;
  declare business_name: CreationOptional<string>;
  declare street:CreationOptional <string>;
  declare city:CreationOptional <string>;
  declare state:CreationOptional <string>;
  declare zip:CreationOptional <string>;
  declare address:CreationOptional <string>;
  declare reset_token: CreationOptional<string | null>;
  declare reset_token_expiry: CreationOptional<number | null>;
}

Patient.init(
  {
    patient_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    business_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token: { type: DataTypes.STRING, allowNull: true },
    reset_token_expiry: { type: DataTypes.BIGINT, allowNull: true },
  },
  {  timestamps:false,
    sequelize,
    modelName: "Patient",
    tableName: "patient",
  }
);

export default Patient;
