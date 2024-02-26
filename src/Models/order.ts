import { DataTypes, Model } from 'sequelize';
import sequelize from '../Connections/database';
import Request from './request'; 

class Order extends Model {
  declare orderId: number; 
  declare requestId: number; 
  declare profession: string;
  declare businessContact: number;
  declare email: string;
  declare faxNumber: number;
  declare orderDetails: string;
  declare numberOfRefill: number;
}

Order.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Request,
        key: 'request_id',
      },
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessContact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    faxNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfRefill: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'orders',
  }
);

export default Order;
