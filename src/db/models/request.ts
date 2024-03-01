import sequelize from "../../connections/database";
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
  declare confirmation_no: CreationOptional<string>;
  declare request_state: string;
  declare user_id: number;
  declare requested_by: string;
  declare requestor_id:CreationOptional< number>;
  declare requested_date: Date;
  declare notes_symptoms:CreationOptional< string | null>;
  declare date_of_service:CreationOptional< Date>;
  declare block_status: CreationOptional<string>;
  declare cancellation_status: CreationOptional<string>;
  declare close_case_status: CreationOptional<string>;
  declare transfer_request_status: CreationOptional<string>;
  declare agreement_status: CreationOptional<string>;
  declare assign_req_description: CreationOptional<string>;
  declare createdAt:CreationOptional <Date>;
  declare updatedAt:CreationOptional <Date>;
}

Request.init(
  {
    request_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    confirmation_no: {
      type: DataTypes.STRING,
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: "User",
      //   key: "user_id",
      // },
    },  
    requested_by: {
      type: DataTypes.ENUM("family_friend", "concierge", "business_partner"),
      allowNull: false,
    },
    requestor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // references: {
      //   model: 'Requestor',
      //   key: "user_id",
      // },
    },
    requested_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes_symptoms: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_service: {
      type: DataTypes.DATE,
      allowNull: true,
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      onUpdate: "CASCADE",
    },
    
  },
  {  timestamps:true,
    sequelize,
    tableName: "request",
  }
);

export default Request;
