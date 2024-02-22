import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "hallodoc",
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
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
    console.log("Error Occurred =>", error.message);
  });

export default sequelize;