import sequelize from "../connections/database";
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
  declare request_id: CreationOptional<number>;
  declare confirmation_no: CreationOptional<number>;
  declare request_state: string;
  declare patient_id: number;
  // declare firstname: string;
  // declare lastname: string;
  // declare dob: Date;
  // declare mobile_number: number;
  // declare email: string;
  // declare street: string;
  // declare city: string;
  // declare state: string;
  // declare zip: number;
  declare requested_by: string;
  declare requestor_id: number;
  // declare requestor_name: string;
  declare requested_date: Date;
  // declare address: string;
  declare notes_symptoms: string | null;
  // declare region: string;
  declare physician_id: number;
  // declare physician_name: string;
  declare date_of_service: Date;
  declare block_status: string;
  declare cancellation_status: string;
  declare close_case_status: string;
  declare transfer_request_status: string;
  declare agreement_status: string;
  declare assign_req_description: string;
}

Request.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    confirmation_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    request_state: {
      type: DataTypes.ENUM(
        "new",
        "active",
        "pending",
        "conclude",
        "toclose",
        "unpaid"
      ),
      allowNull: false,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Patient",
        key: "patient_id",
      },
      unique:false,
    },  
    requested_by: {
      type: DataTypes.ENUM("family_friend", "concierge", "business_partner"),
      allowNull: false,
    },
    requestor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Concierge',
        key: "user_id",
      },
    },
    requested_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes_symptoms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    physician_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Provider',
        key: "provider_id",
      },
    },
    date_of_service: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    block_status: {
      type: DataTypes.ENUM("yes", "no"),
      defaultValue: "no",
      allowNull: false,
    },
    cancellation_status:{
      type: DataTypes.ENUM("yes", "no"),
      defaultValue: "no",
      allowNull: false,
    },
    close_case_status:{
      type: DataTypes.ENUM("yes", "no"),
      defaultValue: "no",
      allowNull: false,
    },
    transfer_request_status:{
      type: DataTypes.ENUM("undefined","pending","accepted","rejected"),
      defaultValue: "undefined",
      allowNull: false,
    },
    agreement_status:{
      type: DataTypes.ENUM("undefined","pending","accepted","rejected"),
      defaultValue: "undefined",
      allowNull: false,
    },
    assign_req_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    
  },
  {
    sequelize,
    tableName: "request",
  }
);

export default Request;
