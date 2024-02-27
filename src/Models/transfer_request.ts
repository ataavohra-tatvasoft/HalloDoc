import { DataTypes, Model } from 'sequelize';
import sequelize from '../Connections/database';
import Request from './request'; 

class Transfer_Request extends Model {
  declare transferRequestId: number; 
  declare requestId: number; 
  declare physician_name: string;
  declare description: number;
}
  Transfer_Request.init(
  {
    transferRequestId: {
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
    physician_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  },
  {
    sequelize,
    tableName: 'orders',
  }
);

export default Transfer_Request;
