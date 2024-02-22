import sequelize from "../Connections/database";
import { Sequelize, DataTypes, Model } from "sequelize";

class Admin extends Model {
  public adminid!: number;
  public status!: string;
  public email!: string;
  public password!: string;
  public firstname!: string;
  public lastname!: string;
  public role!: string;
  public mobile_no!: number;
  public address_1!: string;
  public address_2!: string;
  public city!: string;
  public state!: string;
  public zip!: number;
  public billing_mobile_no!: number;
}

Admin.init(
  {
    adminid: {
      type: DataTypes.NUMBER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique:true  },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    mobile_no: { type: DataTypes.NUMBER, allowNull: false, unique:true },
    address_1: { type: DataTypes.STRING, allowNull: false },
    address_2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    zip: { type: DataTypes.NUMBER, allowNull: false},
    billing_mobile_no: { type: DataTypes.NUMBER, allowNull: false, unique:true  },
  },
  {
    sequelize,
    modelName: "admin",
  }
);

export default Admin;
