import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const sequelize = new Sequelize(
  "hallodoc_ngrok",
  process.env.DB_USER as string,
  process.env.DB_PASS,
  {
    dialect: "mysql",
    host: "localhost",
    define: {
      freezeTableName: true,
    },
  }
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
  
async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process on failure
  }
}

connectToDatabase();

export default sequelize;
