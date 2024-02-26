import sequelize from "../Connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class Request extends Model<
  InferAttributes<Request>,
  InferCreationAttributes<Request>
> {
  declare request_id: number;
  declare request_state: string;
  declare patient_id: number;
  declare firstname: string;
  declare lastname: string;
  declare dob: Date;
  declare mobile_number: number;
  declare email: string;
  declare street: string;
  declare city: string;
  declare state: string;
  declare zip: number;
  declare requested_by: string;
  declare requestor_id: number;
  declare requestor_name: string;
  declare requested_date: Date;
  declare address: string;
  declare notes: string | null;
  declare region: string;
  declare physician_name: string;
  declare date_of_service: Date;
  declare block_status: string;
}

Request.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    request_state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requested_by: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requestor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requestor_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    requested_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    physician_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_service: {
      type: DataTypes.DATE,
      allowNull: false
    },
    block_status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Request',
    tableName: 'request',
  }
);

export default Request;
