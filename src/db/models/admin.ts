
import sequelize from "../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";


class Admin extends Model<
  InferAttributes<Admin>,
  InferCreationAttributes<Admin>
> {
  declare adminid: CreationOptional<number>;
  declare status: string;
  declare email: string;
  declare password: string;
  declare firstname: string;
  declare lastname: string;
  declare role: string;
  declare mobile_no: number;
  declare address_1: string;
  declare address_2: string | null;
  declare city: string;
  declare state: string;
  declare country_code: string;
  declare zip: number;
  declare billing_mobile_no: number;
  declare reset_token: string | null;
  declare reset_token_expiry: number | null;

}

Admin.init(
  {
    adminid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    mobile_no: { type:  DataTypes.BIGINT, allowNull: false, unique: true },
    address_1: { type: DataTypes.STRING, allowNull: false },
    address_2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    country_code: { type: DataTypes.STRING, allowNull: false },
    zip: { type:  DataTypes.INTEGER, allowNull: false },
    billing_mobile_no: {
      type:  DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
    reset_token: { type: DataTypes.STRING, allowNull:true},
    reset_token_expiry:{type: DataTypes.BIGINT, allowNull:true},
  },
  {     
    timestamps:false,
    sequelize,
    tableName: "admin",
  }
);

export default Admin;
