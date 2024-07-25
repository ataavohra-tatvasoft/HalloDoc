// import { Sequelize } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import {
  User,
  RequestModel,
  Requestor,
  Notes,
  Order,
  Documents,
  Profession,
  Region,
  Business,
  Logs,
  Access,
  Role,
  RoleAccessMapping,
  UserRegionMapping,
  EncounterForm,
  Shifts,
} from "../db/models";

dotenv.config({ path: ".env" });

const sequelize = new Sequelize({
  database: "hallodoc",
  host: "localhost",
  dialect: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  storage: ":memory:",
  models: [
    User,
    RequestModel,
    Requestor,
    Notes,
    Order,
    Documents,
    Profession,
    Region,
    Business,
    Logs,
    Access,
    Shifts,
    Role,
    UserRegionMapping,
    RoleAccessMapping,
    EncounterForm,
  ],
});

const connection: Promise<void> = sequelize.authenticate();

/** Connection to Database */
connection
  .then(() => {
    console.log("Connected to database :-) ");
  })
  .catch((error: Error) => {
    console.log("Error Occurred =>", error);
  });

async function connect_to_database() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
}

export default connect_to_database;
