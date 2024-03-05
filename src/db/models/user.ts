import sequelize from "../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<number>;
  declare email: string;
  declare password:CreationOptional <string>;
  declare type_of_user: string;

  // Common fields for all user types
  declare firstname: string;
  declare lastname: string;
  declare mobile_no: number;
  declare address_1:  string;
  declare address_2: CreationOptional<string> | null;
  declare city: string ;
  declare state: string ;
  declare country_code: CreationOptional<string> | null;
  declare zip: number ;
  declare reset_token: CreationOptional<string> | null;
  declare reset_token_expiry: CreationOptional<number> | null;

  // Admin-specific fields
  declare billing_mobile_no: CreationOptional<number> | null;;
  declare status: CreationOptional<string> | null;;
  declare role: CreationOptional<string> | null;; // Removed redundant "admin" role field

  // Patient-specific fields
  declare dob: CreationOptional<Date> | null;

  // Provider-specific fields
  declare medical_licence: CreationOptional<string> | null;
  declare NPI_no: CreationOptional<number> | null;
  declare alternative_mobile_no: CreationOptional<number> | null;

  //Common attributes between Patient and Provider
  declare street: CreationOptional<string> | null;
  declare business_name: CreationOptional<string> | null;

  // Additional attributes
  declare tax_id: CreationOptional<string> | null;
  declare profile_picture: CreationOptional<string> | null;
  //   declare business_name: string;
  declare business_website: CreationOptional<string> | null;
  declare on_call_status: CreationOptional<string> | null;
  declare scheduled_status: CreationOptional<string> | null;
  declare support_message: CreationOptional<string> | null;
}

User.init(
  {
    user_id: {
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
    type_of_user: {
      type: DataTypes.ENUM("admin", "patient", "provider"),
      allowNull: false,
    },

    // Common fields
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    reset_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reset_token_expiry: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    address_1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address_2: {
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
    country_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // Admin-specific fields
    billing_mobile_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true // Removed redundant "admin" role field
    },

    // Patient-specific fields
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // Provider-specific fields
    medical_licence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    NPI_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    alternative_mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },
    //Common attributes between Patient and Provider
    business_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Additional attributes
    tax_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // business_name: { type: DataTypes.STRING, allowNull: false },
    business_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    on_call_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduled_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    support_message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },

  {
    timestamps: true,
    sequelize,
    tableName: "user",
  }
);

export default User;
