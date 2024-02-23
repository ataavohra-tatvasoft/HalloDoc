import { Sequelize } from "sequelize";
import {config} from 'dotenv'
config()

const sequelize = new Sequelize(
  "hallodoc",
  process.env.DB_USER as string,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: 'localhost',
    define: {
      freezeTableName: true,
    },
  },
);

const connection: Promise<void> = sequelize.authenticate();

/** Connection to Database */
connection
  .then(() => {
    console.log("Connected to database :-) ");
  })
  .catch((error: Error) => {
    console.log("Error Occurred =>", error);
  });

export default sequelize;