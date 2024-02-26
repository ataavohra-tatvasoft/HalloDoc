import { DataTypes, Model } from 'sequelize';
import sequelize from '../Connections/database';
import Request from './request'; 

class Note extends Model {
  declare noteId: number; 
  declare requestId: number; 
  declare description: string;
  declare typeOfNote: string;
}

Note.init(
  {
    noteId: {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfNote: {
      type: DataTypes.ENUM('transfer', 'admin', 'physician'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'notes',
  }
);

export default Note;
