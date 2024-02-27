import sequelize from "../Connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class Concierge extends Model<
  InferAttributes<Concierge>,
  InferCreationAttributes<Concierge>
> {
    declare user_id: CreationOptional<number>; 
    // declare request_id: number;
    declare first_name: string;
    declare last_name: string;
    declare mobile_number: number;
    declare email: string;
    declare house_name: string;
    declare street: string;
    declare city: string;
    declare state: string;
    declare zip: number;
}


Concierge.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // request_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'Request', 
    //     key: 'request_id',
    //   },
    // },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    house_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'concierge',
  }
);

export default Concierge;
