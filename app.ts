import express, {Express} from "express";
import { Sequelize } from "sequelize";
import bodyParser from "body-parser";
import routes from "./src/Routes/index";
import dotenv from "dotenv";
import sequelize from "./src/Connections/database"

dotenv.config({ path: ".env" });

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Application Started!!!");
    app.listen(process.env.PORT);
  })
  .catch((error: Error) => {
    console.log(error);
    console.log("Error Occurred => ", error.message);
  });