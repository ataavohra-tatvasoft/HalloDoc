import sequelize from "../../connections/database";
import {
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  CreationOptional,
} from "sequelize";

class Requestor extends Model<
  InferAttributes<Requestor>,
  InferCreationAttributes<Requestor>
> {
    declare user_id: CreationOptional<number>; 
    // declare request_id: number;
    declare first_name: CreationOptional<string>;
    declare last_name: CreationOptional<string>;
    declare mobile_number: CreationOptional<number>;
    declare email: CreationOptional<string>;
    declare house_name: CreationOptional<string>;
    declare street: CreationOptional<string>;
    declare city: CreationOptional<string>;
    declare state: CreationOptional<string>;
    declare zip: CreationOptional<number>;
}


Requestor.init(
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
    tableName: 'requestor',
  }
);

export default Requestor;
