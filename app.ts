import express, { Express } from "express";
// import { Sequelize } from "sequelize";
import "./src/db/models/associations";
import bodyParser from "body-parser";
import routes from "./src/routes";
import dotenv from "dotenv";
import sequelize from "./src/connections/database";

dotenv.config({ path: ".env" });

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Application Started!!!");
//     app.listen(process.env.PORT);
//   })
//   .catch((error: Error) => {
//     console.log(error);
//     console.log("Error Occurred => ", error.message);
//   });
app.listen(process.env.PORT);
console.log("Application Started!!!");
