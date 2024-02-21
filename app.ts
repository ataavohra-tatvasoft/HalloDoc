import express, {Express} from "express";
import { Sequelize } from "sequelize";
import bodyParser from "body-parser";
import routes from "./src/Routes/index";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const app: Express = express();
const sequelize: Sequelize = require("./src/Connections/database");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Application Started!!!");
  })
  .catch((error: Error) => {
    console.log("Error Occurred => ", error.message);
  });